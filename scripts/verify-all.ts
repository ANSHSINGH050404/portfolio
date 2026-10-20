import { chromium } from "playwright";

export {};

const BASE = process.env.PERF_URL ?? "http://localhost:3130";
const EXPECTED_SLUGS = [
	"one-authoritative-state-per-room",
	"a-browser-agent-needs-observer-nodes",
	"structured-data-beats-prose-for-agents",
];

async function main() {
	const browser = await chromium.launch();
	const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
	const page = await ctx.newPage();

	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(e.message));
	page.on("console", (m) => {
		if (m.type() === "error") errors.push(m.text());
	});

	let pass = 0;
	let fail = 0;
	const check = (label: string, ok: boolean, detail = "") => {
		console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
		if (ok) pass++;
		else fail++;
	};

	await page.goto(BASE, { waitUntil: "networkidle", timeout: 60_000 });
	await page.waitForTimeout(3000);

	// 1. Hero stats match the API.
	const hero = await page.evaluate(
		() => document.querySelector("#about ul")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
	);
	const stats = await page.evaluate(async () => {
		const r = await fetch("/api/stats");
		return r.json();
	});
	check(
		"hero shows live API values",
		hero.includes(`${stats.originalRepos} original repos`) &&
			hero.includes(`${stats.upstreamPrs} upstream PRs`) &&
			hero.includes(`${stats.mergedPrs} merged upstream`),
		hero.slice(0, 70),
	);

	// 2. h1 reads as the name.
	const h1 = await page.evaluate(
		() => document.querySelector("h1")?.textContent?.trim() ?? "",
	);
	check("h1 text is the name", h1 === "Ansh Singh", JSON.stringify(h1));

	// 3. Section headings read correctly.
	const headings = await page.evaluate(() =>
		Array.from(document.querySelectorAll(".section-title")).map(
			(h) => h.textContent?.replace(/\s+/g, " ").trim() ?? "",
		),
	);
	check(
		"section headings spaced correctly",
		headings.every((h) => !/^[a-z]+[A-Z]/.test(h) && !h.includes("projectsprojects")),
		headings.join(" | "),
	);

	// 4. No outline box on the heading outline span.
	const outlineOk = await page.evaluate(() => {
		const el = document.querySelector(".section-title-outline");
		if (!el) return false;
		return getComputedStyle(el).outlineStyle === "none";
	});
	check("no outline box on headings", outlineOk);

	// 5. Project facts are verified.
	const facts = await page.evaluate(() =>
		Array.from(document.querySelectorAll(".case-card")).map((c) => ({
			title: c.querySelector(".case-title")?.textContent,
			facts: Array.from(c.querySelectorAll(".case-metric-val")).map(
				(m) => m.textContent,
			),
		})),
	);
	check(
		"every project card shows a deployment status",
		facts.length === 4 && facts.every((f) => f.facts.includes("Live")),
		facts.map((f) => `${f.title}:${f.facts.join("/")}`).join(" | "),
	);

	// 6. PR badges are accurate.
	const badges = await page.evaluate(() =>
		Array.from(document.querySelectorAll(".pr-card")).map(
			(c) => c.querySelector(".pr-card-foot span")?.textContent,
		),
	);
	const badgeSet = [...new Set(badges)];
	check(
		"PR badges distinguish merged from closed",
		badgeSet.every((b) => ["Open", "Merged", "Closed"].includes(b ?? "")),
		badgeSet.join(", "),
	);

	// 7. Blog routes.
	const blogList = await page.evaluate(async () => {
		const r = await fetch("/blog");
		return r.status;
	});
	check("/blog responds", blogList === 200);

	for (const slug of EXPECTED_SLUGS) {
		const res = await page.request.get(`${BASE}/blog/${slug}`);
		check(`/blog/${slug}`, res.status() === 200);
	}

	// 8. Structured data and llms.txt.
	const ld = await page.evaluate(() => {
		const el = document.querySelector('script[type="application/ld+json"]');
		if (!el) return null;
		try {
			return JSON.parse(el.textContent ?? "");
		} catch {
			return null;
		}
	});
	check(
		"JSON-LD Person parses",
		!!ld && ld["@type"] === "Person" && Array.isArray(ld.sameAs),
		`sameAs: ${ld?.sameAs?.length ?? 0} links`,
	);

	const llms = await page.request.get(`${BASE}/llms.txt`);
	const llmsText = await llms.text();
	check(
		"llms.txt serves the profile",
		llms.status() === 200 && llmsText.includes("## Selected work"),
		`${llmsText.length} bytes`,
	);

	// 9. Terminal commands.
	await page.keyboard.press("`");
	await page.waitForSelector(".term-overlay", { state: "visible", timeout: 8000 });
	const runCmd = async (cmd: string) => {
		await page.fill(".term-input", cmd);
		await page.press(".term-input", "Enter");
		await page.waitForTimeout(cmd === "stats" ? 1500 : 600);
		return await page.evaluate(
			() =>
				document.querySelector(".term-body")?.textContent ?? "",
		);
	};
	const statsOut = await runCmd("stats");
	check(
		"terminal stats matches the API",
		statsOut.includes(`${stats.originalRepos}`) &&
			statsOut.includes(`${stats.upstreamPrs}`) &&
			statsOut.includes(`${stats.mergedPrs} merged`),
		statsOut.split("\n").slice(-4).join(" "),
	);
	await runCmd("clear");
	const jsonOut = await runCmd("whoami --json");
	const jsonOk = await page.evaluate((src) => {
		try {
			JSON.parse(src);
			return true;
		} catch {
			return false;
		}
	}, jsonOut.slice(jsonOut.indexOf("{"), jsonOut.lastIndexOf("}") + 1));
	check("terminal whoami --json is valid JSON", jsonOk);

	// 10. No-JS.
	const noJsCtx = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1440, height: 900 },
	});
	const noJsPage = await noJsCtx.newPage();
	await noJsPage.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60_000 });
	await noJsPage.waitForTimeout(800);
	const noJs = await noJsPage.evaluate(() => {
		const loader = document.querySelector(".loader-screen");
		const fi = Array.from(document.querySelectorAll(".fi"));
		return {
			loader: loader ? getComputedStyle(loader).display : "none",
			hidden: fi.filter((e) => getComputedStyle(e).opacity === "0").length,
			h1: document.querySelector("h1")?.textContent?.trim(),
		};
	});
	check(
		"page readable without JS",
		noJs.loader === "none" && noJs.hidden === 0 && noJs.h1 === "Ansh Singh",
		`loader=${noJs.loader} hidden=${noJs.hidden}`,
	);
	await noJsCtx.close();

	console.log(`\nconsole errors: ${errors.length}`);
	for (const e of errors.slice(0, 6)) console.log(`  ${e.slice(0, 160)}`);

	console.log(`\n=== ${pass} passed, ${fail} failed ===`);

	await browser.close();
	process.exit(fail === 0 && errors.length === 0 ? 0 : 1);
}

await main();
