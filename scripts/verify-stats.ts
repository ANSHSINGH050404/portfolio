/**
 * Verifies the own-repo filter used by /api/stats against the GitHub search
 * API. Run with `bun scripts/verify-stats.ts`.
 */
const API = "https://api.github.com";
const GITHUB_USER = "ANSHSINGH050404";

const headers: Record<string, string> = {
	Accept: "application/vnd.github+json",
	"User-Agent": `${GITHUB_USER}-portfolio`,
	...(process.env.GITHUB_TOKEN
		? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
		: {}),
};

async function gh<T>(url: string): Promise<T> {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`GitHub ${res.status}`);
	return (await res.json()) as T;
}

type GhRepo = { name: string; full_name: string; fork: boolean; language: string | null };
type GhSearchItem = { repository_url: string };
type GhSearchPage = { total_count: number; items: GhSearchItem[] };

export {};

function ownerOf(repositoryUrl: string): string {
	const match = /\/repos\/([^/]+)\//i.exec(repositoryUrl);
	return match ? match[1].toLowerCase() : "";
}

const [page1, page2, page3, search] = await Promise.all([
	gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=1`),
	gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=2`),
	gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=3`),
	gh<GhSearchPage>(
		`${API}/search/issues?q=author:${GITHUB_USER}+type:pr&per_page=100&page=1`,
	),
]);

const repos = [...page1, ...page2, ...page3];
const own = repos.filter((r) => !r.fork);
const languages = new Set(own.map((r) => r.language).filter(Boolean));

const pages = Math.min(
	10,
	Math.ceil(Math.max(search.total_count, search.items.length) / 100),
);
const rest =
	pages > 1
		? await Promise.all(
				Array.from({ length: pages - 1 }, (_, i) =>
					gh<GhSearchPage>(
						`${API}/search/issues?q=author:${GITHUB_USER}+type:pr&per_page=100&page=${i + 2}`,
					),
				),
			)
		: [];
const prItems = [...search.items, ...rest.flatMap((p) => p.items)];

const selfOwner = GITHUB_USER.toLowerCase();

// Old (buggy) filter, kept here to prove the difference.
const oldPrefix = `${API}/repos/${GITHUB_USER}/`;
const oldUpstream = prItems.filter((i) => !i.repository_url.startsWith(oldPrefix));

const newUpstream = prItems.filter((i) => ownerOf(i.repository_url) !== selfOwner);

console.log("=== search coverage ===");
console.log(`total_count from search : ${search.total_count}`);
console.log(`items fetched           : ${prItems.length}`);
console.log(`pages fetched           : ${pages}`);

console.log("\n=== own-repo PRs by owner segment (case as GitHub returned it) ===");
const ownSegments = new Map<string, number>();
for (const item of prItems) {
	const raw = /\/repos\/([^/]+)\//i.exec(item.repository_url)?.[1] ?? "?";
	if (ownerOf(item.repository_url) === selfOwner) {
		ownSegments.set(raw, (ownSegments.get(raw) ?? 0) + 1);
	}
}
console.log([...ownSegments].map(([k, v]) => `${k}: ${v}`).join(", "));

console.log("\n=== filter comparison ===");
console.log(`old (case-sensitive prefix) upstream: ${oldUpstream.length}`);
console.log(`new (case-insensitive owner) upstream: ${newUpstream.length}`);

const expected = await gh<{ total_count: number }>(
	`${API}/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged&per_page=1`,
);
const mergedCount = expected.total_count;
console.log(`\nmerged PRs (is:merged)  : ${mergedCount}`);
console.log(
	`unmerged+open remaining  : ${prItems.length - newUpstream.length} own-repo PRs`,
);

console.log("\n=== stats the route will now return ===");
console.log(
	JSON.stringify(
		{
			originalRepos: own.length,
			upstreamPrs: newUpstream.length,
			mergedPrs: mergedCount,
			languages: languages.size,
		},
		null,
		2,
	),
);
