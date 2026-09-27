import { spawn, type ChildProcess } from "node:child_process";
import { createRequire } from "node:module";

import AxeBuilder from "@axe-core/playwright";
import { chromium, type Page } from "playwright";

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
/** Anything at or above `serious` fails the run. */
const BLOCKING = new Set(["critical", "serious"]);

interface Scenario {
  name: string;
  viewport: { width: number; height: number };
  prepare: (page: Page) => Promise<void>;
}

const SCENARIOS: Scenario[] = [
  {
    name: "desktop / default",
    viewport: { width: 1600, height: 1000 },
    prepare: async () => {},
  },
  {
    name: "desktop / command palette open",
    viewport: { width: 1600, height: 1000 },
    prepare: async (page) => {
      await page.keyboard.press("Control+k");
      await page.waitForSelector(".cmd-overlay", { state: "visible", timeout: 5000 });
    },
  },
  {
    name: "desktop / terminal open",
    viewport: { width: 1600, height: 1000 },
    prepare: async (page) => {
      await page.keyboard.press("`");
      await page.waitForSelector(".term-overlay", { state: "visible", timeout: 5000 });
    },
  },
  {
    name: "mobile / navigation open",
    viewport: { width: 390, height: 844 },
    prepare: async (page) => {
      await page.click('button[aria-controls="mobile-menu"]');
      await page.waitForSelector(".mobile-menu.open", { timeout: 5000 });
    },
  },
];

function startServer(): ChildProcess {
  // Resolved relative to this file so we don't depend on npx being on PATH.
  const require = createRequire(import.meta.url);
  const nextBin = require.resolve("next/dist/bin/next");
  return spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
    stdio: "ignore",
    windowsHide: true,
  });
}

async function waitForServer(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE, { redirect: "manual" });
      if (res.ok || res.status < 500) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server never became ready at ${BASE}`);
}

/** The intro overlay hides the page for ~1.6s; axe must see the real DOM. */
async function settle(page: Page) {
  await page.waitForSelector(".loader-screen.done", { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(400);
}

/**
 * Sections below the fold sit at `opacity: 0` until an IntersectionObserver
 * adds `.in`. Without scrolling, axe silently skips every one of them — so a
 * "pass" would only cover the hero.
 */
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

async function main() {
  const server = startServer();
  const browser = await chromium.launch();
  let failures = 0;

  try {
    await waitForServer();

    for (const scenario of SCENARIOS) {
      const context = await browser.newContext({
        viewport: scenario.viewport,
        colorScheme: "dark",
        reducedMotion: "reduce",
        locale: "en-US",
      });
      const page = await context.newPage();

      try {
        await page.goto(BASE, { waitUntil: "load", timeout: 60_000 });
        await settle(page);
        await revealAll(page);
        await scenario.prepare(page);

        const results = await new AxeBuilder({ page })
          .withTags(WCAG_TAGS)
          .analyze();

        const violations = results.violations;
        const blocking = violations.filter((v) => BLOCKING.has(v.impact ?? ""));

        const label = blocking.length
          ? `FAIL (${blocking.length} blocking)`
          : "pass";

        console.log(`\n[${scenario.name}] ${label}`);

        for (const v of violations) {
          const mark = BLOCKING.has(v.impact ?? "") ? "X" : "-";
          console.log(
            `  ${mark} [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node${
              v.nodes.length === 1 ? "" : "s"
            })`,
          );
          if (BLOCKING.has(v.impact ?? "")) {
            for (const node of v.nodes.slice(0, 80)) {
              const summary = node.failureSummary
                ?.split("\n")
                .find((l) => l.includes("insufficient color contrast"));
              console.log(`      ${node.target.join(" ")}`);
              if (summary) console.log(`        ${summary.trim()}`);
            }
          }
        }

        failures += blocking.length;
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(
    failures
      ? `\n${failures} critical/serious violation(s).`
      : "\n0 critical/serious violations.",
  );
  process.exit(failures ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
