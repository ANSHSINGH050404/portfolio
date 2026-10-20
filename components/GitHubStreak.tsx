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

/** Only the fields /api/github still returns after it aggregates server-side. */
type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  updated_at: string;
};

type LangStat = { name: string; count: number; pct: number; color: string };

type GithubData = {
  user: GhUser;
  totals: { stars: number; forks: number; ownCount: number; years: number };
  languages: LangStat[];
  topRepos: GhRepo[];
};

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function GitHubStreak() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.1);
  const [data, setData] = useState<GithubData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Pre-aggregated and cached for an hour — the old client path pulled
        // every repo page (1.6 MB) straight from api.github.com.
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error(`api ${res.status}`);
        const json = (await res.json()) as GithubData & { ok?: boolean };
        if (cancelled) return;
        if (json.ok === false) throw new Error("unavailable");
        setData(json);
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

  const user = data?.user ?? null;

  const stats = useMemo(
    () => ({
      stars: data?.totals.stars ?? 0,
      forks: data?.totals.forks ?? 0,
      ownCount: data?.totals.ownCount ?? 0,
      languages: data?.languages ?? [],
      topRepos: data?.topRepos ?? [],
      years: data?.totals.years ?? 0,
    }),
    [data],
  );

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
          background: "none",
          pointerEvents: "none",
        }}
      />

      <div ref={ref} style={{ position: "relative" }}>
        <div className={`fi ${visible ? "in" : ""}`} style={{ marginBottom: 52 }}>
          <div className="section-label">Open source</div>
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
              GitHub
              <br />{" "}
              <span className="section-title-outline">activity</span>
            </h2>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              style={{ padding: "8px 16px", fontSize: 13 }}
            >
              @{GITHUB_USER}
            </a>
          </div>
        </div>

        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ transitionDelay: "0.12s" }}
        >
          {/* Profile + key metrics */}
          <SpotlightCard
            accent="var(--accent)"
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
                background: "var(--hairline)",
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
                Loading GitHub…
              </div>
            )}

            {error && !loading && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--muted)",
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
                      border: "1px solid var(--hairline)",
                      boxShadow: "none",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                        color: "var(--fg)",
                        lineHeight: 1,
                      }}
                    >
                      {(user.name ?? GITHUB_USER)}
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
                      @{GITHUB_USER} · since{" "}
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
                      label: "Repos",
                      value: formatNum(user.public_repos),
                      color: "var(--fg)",
                    },
                    {
                      label: "Owned",
                      value: formatNum(stats.ownCount),
                      color: "var(--fg)",
                    },
                    {
                      label: "Stars",
                      value: formatNum(stats.stars),
                      color: "var(--fg)",
                    },
                    {
                      label: "Forks",
                      value: formatNum(stats.forks),
                      color: "var(--fg)",
                    },
                    {
                      label: "Followers",
                      value: formatNum(user.followers),
                      color: "var(--fg)",
                    },
                    {
                      label: "Years",
                      value: `${stats.years}+`,
                      color: "var(--fg)",
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
              accent="var(--accent)"
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
                background: "var(--hairline)",
                  borderRadius: "12px 12px 0 0",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--muted)",
                  letterSpacing: "0.18em",
                  marginBottom: 22,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Languages
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
              accent="var(--accent)"
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
                background: "var(--hairline)",
                  borderRadius: "12px 12px 0 0",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--muted)",
                  letterSpacing: "0.18em",
                  marginBottom: 22,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Repositories
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
            accent="var(--accent)"
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
                background: "var(--hairline)",
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
                position: "relative",
                zIndex: 1,
              }}
            >
              Contributions
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ghchart.rshah.org/2997ff/${GITHUB_USER}`}
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
