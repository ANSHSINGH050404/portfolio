import { chromium, type Page } from "playwright";

const BASE = process.env.PERF_URL ?? "http://localhost:3100";

interface Res {
  url: string;
  kind: string;
  bytes: number;
}

function kb(n: number) {
  return `${(n / 1024).toFixed(1)} KB`;
}

async function collect(page: Page): Promise<Res[]> {
  const rows: Res[] = [];
  page.on("response", (res) => {
    const req = res.request();
    const url = res.url();
    if (url.startsWith("data:") || url.includes("/api/stats")) return;
    const kind = req.resourceType();
    void res
      .body()
      .then((b) => rows.push({ url, kind, bytes: b.length }))
      .catch(() => {
        const len = Number(res.headers()["content-length"] ?? 0);
        if (len) rows.push({ url, kind, bytes: len });
      });
  });
  return rows;
}

/** Buffered observers so we catch paint/LCP entries from the very first load. */
function installVitals(page: Page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const out: Record<string, unknown> = {};
        const po = new PerformanceObserver((list) => {
          for (const e of list.getEntries() as PerformanceEntry[]) {
            if (e.entryType === "largest-contentful-paint") {
              const lcp = e as unknown as {
                renderTime: number;
                loadTime: number;
                element: Element | null;
                size: number;
            };
              out.lcp = Math.round(lcp.renderTime || lcp.loadTime);
              out.lcpSize = Math.round(lcp.size);
              out.lcpEl = lcp.element
                ? `${lcp.element.tagName.toLowerCase()}${
                    lcp.element.id ? "#" + lcp.element.id : ""
                  }${(() => {
                    const c = lcp.element?.getAttribute("class");
                    return c ? "." + c.split(/\s+/).slice(0, 2).join(".") : "";
                  })()}`
                : null;
            }
            if (e.entryType === "layout-shift") {
              const ls = e as unknown as { value: number; hadRecentInput: boolean };
              if (!ls.hadRecentInput) {
                out.cls = Math.round(((out.cls as number) ?? 0) * 1000 + ls.value * 1000) / 1000;
              }
            }
            if (e.entryType === "paint") {
              if (e.name === "first-contentful-paint") out.fcp = Math.round(e.startTime);
            }
          }
        });
        try {
          po.observe({ type: "largest-contentful-paint", buffered: true });
          po.observe({ type: "layout-shift", buffered: true });
          po.observe({ type: "paint", buffered: true });
        } catch {
          /* unsupported */
        }
        // Long tasks approximate TBT.
        let blocking = 0;
        const ltpo = new PerformanceObserver((list) => {
          for (const e of list.getEntries() as PerformanceEntry[]) {
            blocking += Math.max(0, (e as unknown as { duration: number }).duration - 50);
          }
        });
        try {
          ltpo.observe({ type: "longtask", buffered: true });
        } catch {
          /* unsupported */
        }
        setTimeout(() => {
          out.tbt = Math.round(blocking);
          resolve(out);
        }, 4000);
      }),
  );
}

async function main() {
  const browser = await chromium.launch();

  for (const label of ["cold", "repeat"] as const) {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      colorScheme: "dark",
      // First load gets the real motion path; the repeat pass is what a
      // returning visitor sees.
      reducedMotion: label === "repeat" ? "reduce" : "no-preference",
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    const rows = await collect(page);

    const jsCov = label === "cold" ? await page.coverage.startJSCoverage({ resetOnNavigation: false }) : null;
    const cssCov = label === "cold" ? await page.coverage.startCSSCoverage({ resetOnNavigation: false }) : null;

    await page.goto(BASE, { waitUntil: "load", timeout: 60_000 });

    // Read vitals before scrolling: a programmatic scroll doesn't count as
    // input, so it would keep spawning new LCP candidates and inflate the
    // number well past what a real visitor sees.
    const vitals = await installVitals(page);

    // Walk the page so every reveal fires and lazy work runs.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.7);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);

    const jsUsage = jsCov ? await page.coverage.stopJSCoverage() : [];
    const cssUsage = cssCov ? await page.coverage.stopCSSCoverage() : [];

    const byKind = new Map<string, number>();
    for (const r of rows) byKind.set(r.kind, (byKind.get(r.kind) ?? 0) + r.bytes);

    const scripts = rows.filter((r) => r.kind === "script").sort((a, b) => b.bytes - a.bytes);
    const images = rows.filter((r) => r.kind === "image").sort((a, b) => b.bytes - a.bytes);

    let jsTotal = 0;
    let jsUsed = 0;
    for (const f of jsUsage) {
      const size = f.source?.length ?? 0;
      if (!size) continue;
      let used = 0;
      for (const fn of f.functions) {
        for (const r of fn.ranges) used += r.endOffset - r.startOffset;
      }
      jsTotal += size;
      jsUsed += Math.min(used, size);
    }

    let cssTotal = 0;
    let cssUsed = 0;
    for (const f of cssUsage) {
      const size = f.text?.length ?? 0;
      if (!size) continue;
      let used = 0;
      for (const r of f.ranges) used += r.end - r.start;
      cssTotal += size;
      cssUsed += Math.min(used, size);
    }

    console.log(`\n──── ${label} ────`);
    console.log(`bytes by type: ${[...byKind].map(([k, v]) => `${k}=${kb(v)}`).join("  ")}`);
    console.log(`\nvitals: ${JSON.stringify(vitals)}`);
    console.log(
      `\njs coverage: ${kb(jsUsed)} used / ${kb(jsTotal)} total (${((jsUsed / (jsTotal || 1)) * 100).toFixed(1)}%)`,
    );
    console.log(
      `css coverage: ${kb(cssUsed)} used / ${kb(cssTotal)} total (${((cssUsed / (cssTotal || 1)) * 100).toFixed(1)}%)`,
    );
    console.log(`\ntop scripts (${scripts.length}):`);
    for (const s of scripts.slice(0, 18)) {
      console.log(`  ${kb(s.bytes).padStart(10)}  ${s.url.replace(BASE, "").replace(/^\/_next\//, "_next/")}`);
    }
    if (images.length) {
      console.log(`\nimages (${images.length}):`);
      for (const i of images.slice(0, 10)) console.log(`  ${kb(i.bytes).padStart(10)}  ${i.url.replace(BASE, "")}`);
    }

    await context.close();
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
