import { NextResponse } from "next/server";

import { GITHUB_USER, STATS_FALLBACK, type Stats } from "../../../constants";

const API = "https://api.github.com";

/** Hourly — one burst of upstream calls instead of per-visitor fetches. */
export const revalidate = 3600;

/**
 * A token lifts the unauthenticated rate limit from 60/hr to 5,000/hr and
 * removes the cold-start penalty of a throttled response. It stays server
 * side: never prefix this with NEXT_PUBLIC_.
 */
const GH_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${GITHUB_USER}-portfolio`,
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function gh<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: GH_HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return (await res.json()) as T;
}

type GhUser = { created_at: string };
type GhRepo = { name: string; full_name: string; fork: boolean; language: string | null };
type GhSearchPage = { total_count: number; items: unknown[] };

async function fetchStats(): Promise<Stats> {
  const [user, page1, page2, page3, prSearch, mergedSearch] = await Promise.all([
    gh<GhUser>(`${API}/users/${GITHUB_USER}`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=1`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=2`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=3`),
    gh<GhSearchPage>(
      `${API}/search/issues?q=author:${GITHUB_USER}+type:pr+-user:${GITHUB_USER}&per_page=1`,
    ),
    gh<GhSearchPage>(
      `${API}/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged+-user:${GITHUB_USER}&per_page=1`,
    ),
  ]);

  const repos = [...page1, ...page2, ...page3];
  const own = repos.filter((r) => !r.fork);
  const languages = new Set(own.map((r) => r.language).filter(Boolean));

  const years = Math.max(
    1,
    new Date().getFullYear() - new Date(user.created_at).getFullYear(),
  );

  return {
    originalRepos: own.length,
    // The `-user:` qualifier restricts the search to repositories the author
    // does not own, so these counts describe upstream work only.
    upstreamPrs: prSearch.total_count,
    mergedPrs: mergedSearch.total_count,
    languages: languages.size,
    years,
  };
}

export async function GET() {
  let stats = STATS_FALLBACK;
  try {
    stats = await fetchStats();
  } catch {
    // Rate-limited or offline: serve the last verified snapshot.
  }

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
