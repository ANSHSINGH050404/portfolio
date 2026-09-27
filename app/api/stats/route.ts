import { NextResponse } from "next/server";

import { STATS_FALLBACK, type Stats } from "../../../constants";

const GITHUB_USER = "ANSHSINGH050404";
const API = "https://api.github.com";

/** Hourly — one burst of 6 upstream calls instead of per-visitor fetches. */
export const revalidate = 3600;

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${GITHUB_USER}-portfolio`,
};

async function gh<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: GH_HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return (await res.json()) as T;
}

type GhUser = { created_at: string };
type GhRepo = { fork: boolean; language: string | null };
type GhSearchItem = { repository_url: string };

async function fetchStats(): Promise<Stats> {
  const ownPrefix = `${API}/repos/${GITHUB_USER}/`;

  const [user, page1, page2, page3, prs1, prs2] = await Promise.all([
    gh<GhUser>(`${API}/users/${GITHUB_USER}`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=1`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=2`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=3`),
    gh<{ items: GhSearchItem[] }>(
      `${API}/search/issues?q=author:${GITHUB_USER}+type:pr&per_page=100&page=1`,
    ),
    gh<{ items: GhSearchItem[] }>(
      `${API}/search/issues?q=author:${GITHUB_USER}+type:pr&per_page=100&page=2`,
    ),
  ]);

  const own = [...page1, ...page2, ...page3].filter((r) => !r.fork);
  const languages = new Set(own.map((r) => r.language).filter(Boolean));
  const upstream = [...prs1.items, ...prs2.items].filter(
    (item) => !item.repository_url.startsWith(ownPrefix),
  );

  const years = Math.max(
    1,
    new Date().getFullYear() - new Date(user.created_at).getFullYear(),
  );

  return {
    originalRepos: own.length,
    upstreamPrs: upstream.length,
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
