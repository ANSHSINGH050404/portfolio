import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What changed on this site, and when.",
  alternates: { canonical: "/changelog" },
};

const RELEASES = [
  {
    version: "v1.4",
    date: "2026-10-20",
    items: [
      "Refreshed stats fallbacks to match live GitHub numbers.",
      "Pinned GitHub queries to public data only.",
      "Added an end-to-end verification script.",
    ],
  },
  {
    version: "v1.3",
    date: "2026-10-20",
    items: [
      "CI: lint, typecheck, build and an accessibility gate on every PR.",
      "Terminal: stats, JSON output (whoami/resume) and blog commands.",
      "Writing: three technical posts on realtime, agents and structured data.",
    ],
  },
  {
    version: "v1.2",
    date: "2026-10-20",
    items: [
      "Project cards show verified facts (repo, language, last push, live status) instead of asserted metrics.",
      "Person JSON-LD schema and llms.txt for crawlers.",
      "Progressive enhancement: content readable without JavaScript.",
    ],
  },
  {
    version: "v1.1",
    date: "2026-10-20",
    items: [
      "Bundle: deferred on-demand UI, dropped dead code, GITHUB_TOKEN support.",
      "Interactive terminal and command palette.",
      "Stats and PR wall corrected to reflect real merge state.",
    ],
  },
  {
    version: "v1.0",
    date: "2026-10-20",
    items: [
      "Initial portfolio: hero, projects, skills, experience, GitHub activity, contact.",
      "Slot-machine title with crawler-visible text.",
      "Canonical URL derived from a single SITE constant.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main
      id="main"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "140px clamp(22px,5vw,80px) 120px",
      }}
    >
      <div className="section-label">Changelog</div>
      <h1
        className="section-title"
        style={{ marginBottom: 20, fontSize: "clamp(36px,6vw,64px)" }}
      >
        What{" "}
        <span className="section-title-outline">changed</span>
      </h1>
      <p
        style={{
          color: "var(--muted)",
          fontSize: 18,
          lineHeight: 1.5,
          maxWidth: 560,
          marginBottom: 64,
        }}
      >
        A running log of site changes. Derived from the commit history.
      </p>

      <ul role="list" className="plain-list" style={{ display: "grid", gap: 40 }}>
        {RELEASES.map((r) => (
          <li
            key={r.version}
            style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24 }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "baseline",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--accent)",
                }}
              >
                {r.version}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--dim)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {r.date}
              </span>
            </div>
            <ul
              role="list"
              className="plain-list"
              style={{ display: "grid", gap: 6, paddingLeft: 0 }}
            >
              {r.items.map((it) => (
                <li
                  key={it}
                  style={{
                    color: "var(--muted)",
                    fontSize: 15,
                    lineHeight: 1.5,
                    paddingLeft: 16,
                    position: "relative",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 10,
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "var(--accent)",
                    }}
                  />
                  {it}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: 72,
          paddingTop: 32,
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <Link href="/" className="btn-ghost" data-hover>
          ← Back to the portfolio
        </Link>
      </div>
    </main>
  );
}