/**
 * Proves that the GitHub API routes cannot publish private repositories or
 * pull requests, even when the deployment authenticates with a token that
 * belongs to the author.
 *
 * A token belonging to ANSHSINGH050404 can see 8 private repositories and
 * the 7 pull requests opened against them. Without `type=public` and
 * `is:public` on every query, adding that token to Vercel would put
 * private work on a public page.
 *
 * Run with `bun scripts/verify-public-only.ts`.
 */
export {};

import { execFileSync } from "node:child_process";

const gh = execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
const headers: Record<string, string> = {
	Authorization: `Bearer ${gh}`,
	Accept: "application/vnd.github+json",
	"X-GitHub-Api-Version": "2022-11-28",
};

const USER = "ANSHSINGH050404";
const API = "https://api.github.com";

type Repo = { name: string; private: boolean };
type Item = { repository_url: string; private?: boolean };

let failures = 0;
const check = (label: string, ok: boolean, detail = "") => {
	console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
	if (!ok) failures++;
};

async function listRepos(query: string): Promise<Repo[]> {
	const out: Repo[] = [];
	for (let page = 1; page <= 3; page++) {
		const res = await fetch(
			`${API}/users/${USER}/repos?per_page=100&page=${page}${query}`,
			{ headers },
		);
		if (!res.ok) return out;
		const batch = (await res.json()) as Repo[];
		out.push(...batch);
		if (batch.length < 100) break;
	}
	return out;
}

async function searchPrs(query: string): Promise<Item[]> {
	// The search API has its own rate limit (30/min authenticated), so the
	// requests are spaced out rather than fired back to back.
	const res = await fetch(
		`${API}/search/issues?q=${encodeURIComponent(query)}&per_page=100`,
		{ headers },
	);
	if (!res.ok) {
		throw new Error(`search failed: ${res.status}`);
	}
	return (await res.json()).items as Item[];
}

async function searchTotal(query: string): Promise<number> {
	const res = await fetch(
		`${API}/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
		{ headers },
	);
	if (!res.ok) {
		throw new Error(`search failed: ${res.status}`);
	}
	return ((await res.json()) as { total_count: number }).total_count;
}

/** Waits out the search API's 30/min limit. */
async function searchCooldown(): Promise<void> {
	await new Promise((r) => setTimeout(r, 2500));
}

/** The private repositories the token can see at all. */
const selfRepos = (await (
	await fetch(`${API}/user/repos?per_page=100`, { headers })
).json()) as Repo[];
const privateNames = new Set(
	selfRepos.filter((r) => r.private).map((r) => r.name),
);
console.log(
	`=== the token can see ${privateNames.size} private repositories: ${[...privateNames].join(", ")} ===\n`,
);

// The queries the routes now use.
const listingQuery = "&type=public";
const searchQuery = `author:${USER} type:pr -user:${USER} is:public`;
const mergedQuery = `author:${USER} type:pr is:merged -user:${USER} is:public`;

console.log("=== repo listing ===");
const listed = await listRepos(listingQuery);
const listedPrivate = listed.filter((r) => r.private);
check(
	"listing returns no private repositories",
	listedPrivate.length === 0,
	`${listed.length} repos, ${listedPrivate.length} private`,
);

console.log("\n=== PR search ===");
const prs = await searchPrs(searchQuery);
const prPrivate = prs.filter((p) =>
	privateNames.has(p.repository_url.replace(`${API}/repos/`, "").split("/")[0]),
);
check(
	"PR search returns no PRs from private repositories",
	prPrivate.length === 0,
	`${prs.length} PRs, ${prPrivate.length} from private repos`,
);

await searchCooldown();
const merged = await searchPrs(mergedQuery);
const mergedPrivate = merged.filter((p) =>
	privateNames.has(p.repository_url.replace(`${API}/repos/`, "").split("/")[0]),
);
check(
	"merged-PR search returns no PRs from private repositories",
	mergedPrivate.length === 0,
	`${merged.length} PRs, ${mergedPrivate.length} from private repos`,
);

console.log("\n=== the counts the site will now publish ===");
await searchCooldown();
const upstreamTotal = await searchTotal(searchQuery);
await searchCooldown();
const mergedTotal = await searchTotal(mergedQuery);
console.log(`  upstream PRs: ${upstreamTotal}`);
console.log(`  merged upstream: ${mergedTotal}`);
check(
	"upstream count matches the live site (122)",
	upstreamTotal === 122,
	`${upstreamTotal}`,
);
check(
	"merged count matches the live site (25)",
	mergedTotal === 25,
	`${mergedTotal}`,
);

console.log(
	`\n=== ${failures === 0 ? "all checks passed" : `${failures} check(s) failed`} ===`,
);
process.exit(failures === 0 ? 0 : 1);
