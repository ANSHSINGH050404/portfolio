/**
 * Cross-checks the PR-wall numbers against the GitHub search API.
 *
 * The wall claims "pull requests shipped upstream" and "merged into
 * projects I don't own", so both the set and the merged count have to
 * exclude the author's own repositories and forks.
 *
 * Run with `bun scripts/verify-prs.ts`.
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

export {};

async function gh<T>(url: string): Promise<T> {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`GitHub ${res.status}`);
	return (await res.json()) as T;
}

type SearchItem = {
	number: number;
	title: string;
	state: string;
	repository_url: string;
	updated_at: string;
	pull_request?: { merged_at?: string | null } | null;
};
type SearchPage = { total_count: number; items: SearchItem[] };

const selfOwner = GITHUB_USER.toLowerCase();
const ownerOf = (url: string) =>
	(/\/repos\/([^/]+)\//i.exec(url)?.[1] ?? "").toLowerCase();

const all = await gh<SearchPage>(
	`${API}/search/issues?q=author:${GITHUB_USER}+type:pr&per_page=100&sort=updated&order=desc`,
);
const excluded = await gh<SearchPage>(
	`${API}/search/issues?q=author:${GITHUB_USER}+type:pr+-user:${GITHUB_USER}&per_page=100&sort=updated&order=desc`,
);
const mergedAll = await gh<SearchPage>(
	`${API}/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged&per_page=100`,
);
const mergedExcluded = await gh<SearchPage>(
	`${API}/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged+-user:${GITHUB_USER}&per_page=100`,
);

const upstream = all.items.filter((i) => ownerOf(i.repository_url) !== selfOwner);
const upstreamMerged = mergedAll.items.filter(
	(i) => ownerOf(i.repository_url) !== selfOwner,
);

console.log("=== totals from the search API ===");
console.log(`all authored PRs                : ${all.total_count}`);
console.log(`excluded via -user: qualifier   : ${excluded.total_count}`);
console.log(`merged (all)                    : ${mergedAll.total_count}`);
console.log(`merged (excluded via -user:)    : ${mergedExcluded.total_count}`);

console.log("\n=== computed by filtering items ===");
console.log(`upstream PRs (owner != self)   : ${upstream.length}`);
console.log(`upstream merged (owner != self) : ${upstreamMerged.length}`);
console.log(`own-repo PRs filtered out       : ${all.items.length - upstream.length}`);

console.log("\n=== merged PRs by owner ===");
const byOwner = new Map<string, number>();
for (const item of mergedAll.items) {
	const owner = /\/repos\/([^/]+)\//i.exec(item.repository_url)?.[1] ?? "?";
	byOwner.set(owner, (byOwner.get(owner) ?? 0) + 1);
}
for (const [owner, count] of [...byOwner].sort((a, b) => b[1] - a[1])) {
	console.log(`  ${owner.padEnd(28)} ${count}`);
}

console.log("\n=== does pull_request.merged_at line up with is:merged? ===");
const withMergedAt = upstream.filter((i) => i.pull_request?.merged_at).length;
const upstreamClosed = upstream.filter((i) => i.state === "closed").length;
console.log(`upstream items with merged_at   : ${withMergedAt}`);
console.log(`upstream items state=closed     : ${upstreamClosed}`);
console.log(
	`=> closed-but-not-merged         : ${upstreamClosed - withMergedAt} (these must NOT be labelled "Merged")`,
);
