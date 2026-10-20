import { NextResponse } from "next/server";

import { GITHUB_USER, PROJECTS } from "../../../constants";

/**
 * One cached fan-out over the GitHub API for everything below the fold
 * (the streak panel and the PR wall). Replaces three client-side calls that
 * shipped 1.6 MB of raw repo JSON to every visitor and burned the
 * unauthenticated 60 req/h rate limit per IP.
 */
export const revalidate = 3600;

const API = "https://api.github.com";

/**
 * A token lifts the unauthenticated rate limit from 60 req/hr to 5,000/hr
 * and removes the cold-start stall of a throttled response. It stays server
 * side: never prefix this with NEXT_PUBLIC_.
 */
const GH_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${GITHUB_USER}-portfolio`,
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Vue: "#41b883",
  SCSS: "#c6538c",
};

const FALLBACK_COLORS = [
  "#2997ff",
  "#86868b",
  "#6e6e73",
  "#424245",
  "#1d1d1f",
  "#f5f5f7",
];

async function gh<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: GH_HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return (await res.json()) as T;
}

type GhUser = {
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GhRepo = {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  description: string | null;
  updated_at: string;
};

type GhPRItem = {
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  repository_url: string;
  updated_at: string;
  /** The search API exposes the merge timestamp on the pull_request sub-object. */
  pull_request?: { merged_at?: string | null } | null;
};

export type GhLangStat = {
  name: string;
  count: number;
  pct: number;
  color: string;
};

export type GhTopRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  updated_at: string;
};

/**
 * Facts about the repository behind a project, so the card can show what is
 * verifiable rather than what sounds good.
 */
export type GhProjectRepo = {
  /** Project id in `constants`. */
  id: string;
  /** Repository name, or null when the project has no public source. */
  repo: string | null;
  html_url: string | null;
  language: string | null;
  stars: number;
  /** ISO date of the last push, or null when there is no repository. */
  pushedAt: string | null;
  /** Whether the project's live deployment answered. */
  live: boolean;
  /** Status code the live deployment returned. */
  liveStatus: number | null;
};

/**
 * Whether a project's live deployment is actually serving. Checked from the
 * server so the card can say "live" only when it is true.
 */
async function checkLive(url: string): Promise<{ live: boolean; status: number | null }> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": `${GITHUB_USER}-portfolio` },
    });
    return { live: res.ok, status: res.status };
  } catch {
    return { live: false, status: null };
  }
}

async function buildProjectRepos(): Promise<GhProjectRepo[]> {
  const projects = PROJECTS;
  if (projects.length === 0) return [];

  const results = await Promise.all(
    projects.map(async (project) => {
      // The repository is optional: a project with no public source still has
      // a deployment whose status can be checked.
      const repoName = project.repo;
      const [repo, live] = await Promise.all([
        repoName
          ? gh<{
              html_url: string;
              language: string | null;
              stargazers_count: number;
              pushed_at: string;
            }>(`${API}/repos/${GITHUB_USER}/${repoName}`).catch(() => null)
          : Promise.resolve(null),
        checkLive(project.link),
      ]);

      return {
        id: project.id,
        repo: repoName ?? null,
        html_url: repo?.html_url ?? null,
        language: repo?.language ?? null,
        stars: repo?.stargazers_count ?? 0,
        pushedAt: repo?.pushed_at ?? null,
        live: live.live,
        liveStatus: live.status,
      } satisfies GhProjectRepo;
    }),
  );

  return results;
}

export type GhPrCard = {
  id: string;
  repo: string;
  number: number;
  title: string;
  /** `merged` and `closed` are distinct outcomes; `open` means still in review. */
  state: "open" | "merged" | "closed";
  url: string;
  updatedAt: string;
};

export type GithubPayload = {
  ok: true;
  user: GhUser;
  totals: { stars: number; forks: number; ownCount: number; years: number };
  languages: GhLangStat[];
  topRepos: GhTopRepo[];
  prs: GhPrCard[];
  prTotal: number;
  /** Authored PRs that were actually merged into someone else's repository. */
  prMergedTotal: number;
  projectRepos: GhProjectRepo[];
};

async function build(): Promise<GithubPayload> {
  // `-user:` restricts results to repositories the author does not own, which
  // is what this wall claims to showcase. Filtering the returned items by
  // owner client-side cannot produce an accurate total, because the search
  // API's total_count counts own-repo PRs too.
  //
  // `is:public` is the important one. A request authenticated with a token
  // belonging to the author can see pull requests from their own private
  // repositories, which would publish private work on a public page. Every
  // query below is pinned to public data so that stays impossible.
  const [user, page1, page2, page3, prSearch, mergedSearch] = await Promise.all([
    gh<GhUser>(`${API}/users/${GITHUB_USER}`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=1&sort=updated&type=public`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=2&sort=updated&type=public`),
    gh<GhRepo[]>(`${API}/users/${GITHUB_USER}/repos?per_page=100&page=3&sort=updated&type=public`),
    gh<{ total_count: number; items: GhPRItem[] }>(
      `${API}/search/issues?q=author:${GITHUB_USER}+type:pr+-user:${GITHUB_USER}+is:public&per_page=50&sort=updated&order=desc`,
    ),
    gh<{ total_count: number }>(
      `${API}/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged+-user:${GITHUB_USER}+is:public&per_page=1`,
    ),
  ]);

  const own = [...page1, ...page2, ...page3].filter((r) => !r.fork);

  const stars = own.reduce((s, r) => s + r.stargazers_count, 0);
  const forks = own.reduce((s, r) => s + r.forks_count, 0);

  const langMap = new Map<string, number>();
  for (const r of own) {
    if (!r.language) continue;
    langMap.set(r.language, (langMap.get(r.language) ?? 0) + 1);
  }
  const totalLang = [...langMap.values()].reduce((a, b) => a + b, 0) || 1;
  const languages: GhLangStat[] = [...langMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count], i) => ({
      name,
      count,
      pct: Math.round((count / totalLang) * 100),
      color: LANG_COLORS[name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    }));

  const topRepos: GhTopRepo[] = [...own]
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        +new Date(b.updated_at) - +new Date(a.updated_at),
    )
    .slice(0, 4)
    .map((r) => ({
      name: r.name,
      html_url: r.html_url,
      description: r.description,
      stargazers_count: r.stargazers_count,
      updated_at: r.updated_at,
    }));

  // The `-user:` qualifier above already excludes the author's own repos and
  // forks. Keep the client-side check as a guard: the search API does not
  // guarantee the owner segment casing matches the username.
  const selfOwner = GITHUB_USER.toLowerCase();
  const upstreamItems = prSearch.items.filter((item) => {
    const owner = /\/repos\/([^/]+)\//i.exec(item.repository_url)?.[1] ?? "";
    return owner.toLowerCase() !== selfOwner;
  });

  const prs: GhPrCard[] = upstreamItems.map((item) => ({
    id: `${item.repository_url}#${item.number}`,
    repo: item.repository_url.replace(`${API}/repos/`, ""),
    number: item.number,
    title: item.title,
    state:
      item.state === "open"
        ? "open"
        : item.pull_request?.merged_at
          ? "merged"
          : "closed",
    url: item.html_url,
    updatedAt: item.updated_at,
  }));

  const years = Math.max(
    1,
    new Date().getFullYear() - new Date(user.created_at).getFullYear(),
  );

  const projectRepos = await buildProjectRepos();

  return {
    ok: true,
    // Projected — GitHub's user object is ~4 KB of fields nothing renders.
    user: {
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
    },
    totals: { stars, forks, ownCount: own.length, years },
    languages,
    topRepos,
    prs,
    prTotal: prSearch.total_count,
    prMergedTotal: mergedSearch.total_count,
    projectRepos,
  };
}

const CACHE = {
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET() {
  try {
    return NextResponse.json(await build(), { headers: CACHE });
  } catch {
    // Rate-limited or offline: say so without caching the failure for an hour.
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: { ...CACHE, "Cache-Control": "no-store" } },
    );
  }
}
