"use client";
import { useEffect, useMemo, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { GITHUB_USER } from "../constants";
import { SpotlightCard } from "./SpotlightCard";

type GhUser = {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  name: string | null;
  created_at: string;
  html_url: string;
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

type LangStat = { name: string; count: number; pct: number; color: string };

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

const FALLBACK_COLORS = ["#00ffe0", "#ff2d78", "#a78bfa", "#f59e0b", "#38bdf8", "#4ade80"];

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json() as Promise<T>;
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function GitHubStreak() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.1);
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [u, r] = await Promise.all([
          fetchJson<GhUser>(`https://api.github.com/users/${GITHUB_USER}`),
          fetchJson<GhRepo[]>(
            `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
          ),
        ]);
        if (cancelled) return;
        setUser(u);
        setRepos(r);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const own = repos.filter((r) => !r.fork);
    const stars = own.reduce((s, r) => s + r.stargazers_count, 0);
    const forks = own.reduce((s, r) => s + r.forks_count, 0);

    const langMap = new Map<string, number>();
    for (const r of own) {
      if (!r.language) continue;
      langMap.set(r.language, (langMap.get(r.language) ?? 0) + 1);
    }
    const totalLang = [...langMap.values()].reduce((a, b) => a + b, 0) || 1;
    const languages: LangStat[] = [...langMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], i) => ({
        name,
        count,
        pct: Math.round((count / totalLang) * 100),
        color: LANG_COLORS[name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      }));

    const topRepos = [...own]
      .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.updated_at) - +new Date(a.updated_at))
      .slice(0, 4);

    const years =
      user?.created_at
        ? Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear())
        : 0;

    return {
      stars,
      forks,
      ownCount: own.length,
      languages,
      topRepos,
      years,
    };
  }, [repos, user]);

  return (
    <section id="github" className="section-pad">
      <div className="section-line" />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse, #00ffe006 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div ref={ref} style={{ position: "relative" }}>
        <div className={`fi ${visible ? "in" : ""}`} style={{ marginBottom: 52 }}>
          <div className="section-label" style={{ color: "var(--cyan)" }}>
            {"// 004 — OPEN SOURCE"}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <h2 className="section-title">
              GITHUB
              <br />
              <span className="outline">ACTIVITY</span>
            </h2>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer"
              data-hover
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--cyan)",
                border: "1px solid #00ffe030",
                padding: "8px 18px",
                textDecoration: "none",
                letterSpacing: "0.08em",
                transition: "background 0.2s, box-shadow 0.2s",
                display: "inline-block",
                borderRadius: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00ffe012";
                e.currentTarget.style.boxShadow = "0 0 20px #00ffe025";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              @{GITHUB_USER} ↗
            </a>
          </div>
        </div>

        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ transitionDelay: "0.12s" }}
        >
          {/* Profile + key metrics */}
          <SpotlightCard
            accent="#00ffe0"
            data-hover
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "28px 32px",
              marginBottom: 12,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, #00ffe0, transparent)",
                borderRadius: "12px 12px 0 0",
                zIndex: 1,
              }}
            />

            {loading && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--muted)",
                  letterSpacing: "0.1em",
                  padding: "24px 0",
                  textAlign: "center",
                }}
              >
                LOADING GITHUB DATA…
              </div>
            )}

            {error && !loading && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--magenta)",
                  letterSpacing: "0.08em",
                  padding: "24px 0",
                  textAlign: "center",
                }}
              >
                Couldn&apos;t load live stats.{" "}
                <a
                  href={`https://github.com/${GITHUB_USER}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--cyan)" }}
                >
                  Open profile ↗
                </a>
              </div>
            )}

            {user && !loading && (
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    marginBottom: 28,
                    flexWrap: "wrap",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar_url}
                    alt={user.name ?? GITHUB_USER}
                    width={56}
                    height={56}
                    style={{
                      borderRadius: "50%",
                      border: "2px solid #00ffe040",
                      boxShadow: "0 0 20px #00ffe025",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 28,
                        letterSpacing: "0.04em",
                        color: "#f1f5f9",
                        lineHeight: 1,
                      }}
                    >
                      {(user.name ?? GITHUB_USER).toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--muted)",
                        letterSpacing: "0.08em",
                        marginTop: 6,
                      }}
                    >
                      @{GITHUB_USER} · CODING SINCE{" "}
                      {new Date(user.created_at).getFullYear()}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      label: "PUBLIC REPOS",
                      value: formatNum(user.public_repos),
                      color: "#00ffe0",
                    },
                    {
                      label: "OWNED REPOS",
                      value: formatNum(stats.ownCount),
                      color: "#a78bfa",
                    },
                    {
                      label: "STARS EARNED",
                      value: formatNum(stats.stars),
                      color: "#f59e0b",
                    },
                    {
                      label: "FORKS",
                      value: formatNum(stats.forks),
                      color: "#ff2d78",
                    },
                    {
                      label: "FOLLOWERS",
                      value: formatNum(user.followers),
                      color: "#00ffe0",
                    },
                    {
                      label: "YEARS",
                      value: `${stats.years}+`,
                      color: "#a78bfa",
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      style={{
                        border: "1px solid #ffffff08",
                        borderRadius: 8,
                        padding: "16px 14px",
                        background: "#ffffff03",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 32,
                          lineHeight: 1,
                          color: m.color,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {m.value}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          color: "var(--dim)",
                          letterSpacing: "0.12em",
                          marginTop: 8,
                        }}
                      >
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SpotlightCard>

          {/* Languages + top repos */}
          <div
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <SpotlightCard
              accent="#a78bfa"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "28px 32px",
                position: "relative",
                minHeight: 220,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg, #a78bfa, transparent)",
                  borderRadius: "12px 12px 0 0",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--violet)",
                  letterSpacing: "0.18em",
                  marginBottom: 22,
                  opacity: 0.85,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                💻 TOP LANGUAGES
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                {stats.languages.length === 0 && !loading && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--dim)",
                    }}
                  >
                    No language data yet
                  </div>
                )}
                {stats.languages.map((lang) => (
                  <div key={lang.name} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "#94a3b8",
                          letterSpacing: "0.06em",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: lang.color,
                            marginRight: 8,
                            boxShadow: `0 0 8px ${lang.color}80`,
                          }}
                        />
                        {lang.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: lang.color,
                          fontWeight: 600,
                        }}
                      >
                        {lang.pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 3,
                        background: "#ffffff08",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: visible ? `${lang.pct}%` : "0%",
                          background: lang.color,
                          borderRadius: 99,
                          boxShadow: `0 0 10px ${lang.color}60`,
                          transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard
              accent="#ff2d78"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "28px 32px",
                position: "relative",
                minHeight: 220,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg, #ff2d78, transparent)",
                  borderRadius: "12px 12px 0 0",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--magenta)",
                  letterSpacing: "0.18em",
                  marginBottom: 22,
                  opacity: 0.85,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                ⭐ RECENT / TOP REPOS
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                {stats.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    data-hover
                    style={{
                      display: "block",
                      textDecoration: "none",
                      padding: "10px 0",
                      borderBottom: "1px solid #ffffff06",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "baseline",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "#e2e8f0",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {repo.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--amber)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ★ {repo.stargazers_count}
                      </span>
                    </div>
                    {repo.description && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--dim)",
                          marginTop: 4,
                          lineHeight: 1.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {repo.description}
                      </div>
                    )}
                  </a>
                ))}
                {!loading && stats.topRepos.length === 0 && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--dim)",
                    }}
                  >
                    No public repos found
                  </div>
                )}
              </div>
            </SpotlightCard>
          </div>

          {/* Contribution graph — ghchart is a simple image CDN, still works */}
          <SpotlightCard
            accent="#00ffe0"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "28px 32px",
              marginTop: 12,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, #00ffe0, transparent)",
                borderRadius: "12px 12px 0 0",
                zIndex: 1,
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--cyan)",
                letterSpacing: "0.18em",
                marginBottom: 20,
                opacity: 0.85,
                position: "relative",
                zIndex: 1,
              }}
            >
              🗓️ CONTRIBUTION GRAPH
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ghchart.rshah.org/00ffe0/${GITHUB_USER}`}
              alt={`${GITHUB_USER} contribution graph`}
              loading="lazy"
              style={{
                width: "100%",
                display: "block",
                filter: "brightness(0.95) saturate(1.2)",
                borderRadius: 4,
                position: "relative",
                zIndex: 1,
              }}
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const fallback = el.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "block";
              }}
            />
            <div
              style={{
                display: "none",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--dim)",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              Graph unavailable —{" "}
              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--cyan)" }}
              >
                view on GitHub ↗
              </a>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
