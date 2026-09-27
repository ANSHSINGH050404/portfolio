"use client";
import { useEffect, useMemo, useState } from "react";
import { GITHUB_USER } from "../constants";
import { useReveal } from "../hooks/useReveal";

type GhPRItem = {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  repository_url: string;
  updated_at: string;
  body?: string | null;
};

export type PRCard = {
  id: string;
  repo: string;
  number: number;
  title: string;
  state: "open" | "closed";
  url: string;
  updatedAt: string;
};

/** Real PRs by the author — shown while live data loads or if the API rate-limits. */
const FALLBACK_PRS: PRCard[] = [
  {
    id: "cal.diy-30045",
    repo: "calcom/cal.diy",
    number: 30045,
    title: "perf(app-store): deduplicate location options with Set",
    state: "open",
    url: "https://github.com/calcom/cal.diy/pull/30045",
    updatedAt: "2026-08-20T00:00:00Z",
  },
  {
    id: "cal.diy-30046",
    repo: "calcom/cal.diy",
    number: 30046,
    title: "fix(bookings): scope payment lookup to seat for multi-seat bookings",
    state: "open",
    url: "https://github.com/calcom/cal.diy/pull/30046",
    updatedAt: "2026-08-20T00:00:00Z",
  },
  {
    id: "firecrawl-4074",
    repo: "firecrawl/firecrawl",
    number: 4074,
    title: "feat(go-sdk): add Profile, robots crawl flags, and search options",
    state: "open",
    url: "https://github.com/firecrawl/firecrawl/pull/4074",
    updatedAt: "2026-08-12T00:00:00Z",
  },
  {
    id: "novu-12555",
    repo: "novuhq/novu",
    number: 12555,
    title: "fix(providers): classify FCM unregistered tokens as invalid",
    state: "closed",
    url: "https://github.com/novuhq/novu/pull/12555",
    updatedAt: "2026-07-30T00:00:00Z",
  },
  {
    id: "novu-12465",
    repo: "novuhq/novu",
    number: 12465,
    title: "fix(dashboard): enable browser autofill on self-hosted auth forms",
    state: "closed",
    url: "https://github.com/novuhq/novu/pull/12465",
    updatedAt: "2026-07-24T00:00:00Z",
  },
  {
    id: "tbe-1086",
    repo: "The-Boring-Education/TBE-Web",
    number: 1086,
    title: "fix(mdx): null-safe YouTube embeds and responsive aspect-ratio",
    state: "closed",
    url: "https://github.com/The-Boring-Education/TBE-Web/pull/1086",
    updatedAt: "2026-07-18T00:00:00Z",
  },
  {
    id: "tbe-1185",
    repo: "The-Boring-Education/TBE-Web",
    number: 1185,
    title: "fix(api): protect subscription creation",
    state: "closed",
    url: "https://github.com/The-Boring-Education/TBE-Web/pull/1185",
    updatedAt: "2026-07-10T00:00:00Z",
  },
  {
    id: "tbe-1188",
    repo: "The-Boring-Education/TBE-Web",
    number: 1188,
    title: "fix(api): retry enrollment for successful payments",
    state: "closed",
    url: "https://github.com/The-Boring-Education/TBE-Web/pull/1188",
    updatedAt: "2026-07-08T00:00:00Z",
  },
];

function toCard(item: GhPRItem): PRCard {
  return {
    id: `${item.repository_url}#${item.number}`,
    repo: item.repository_url.replace("https://api.github.com/repos/", ""),
    number: item.number,
    title: item.title,
    state: item.state,
    url: item.html_url,
    updatedAt: item.updated_at,
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PRBadge({ state }: { state: PRCard["state"] }) {
  const open = state === "open";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: open ? "#28c840" : "var(--muted)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: open ? "#28c840" : "#6e6e73",
          boxShadow: open ? "0 0 8px #28c84080" : "none",
          flexShrink: 0,
        }}
      />
      {open ? "Open" : "Merged / Closed"}
    </span>
  );
}

function PRMarqueeCard({ pr }: { pr: PRCard }) {
  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noreferrer"
      data-hover
      className="pr-card"
      aria-label={`${pr.repo} pull request ${pr.number}: ${pr.title}`}
    >
      <div className="pr-card-top">
        <span className="pr-card-repo">{pr.repo}</span>
        <span className="pr-card-num">#{pr.number}</span>
      </div>
      <div className="pr-card-title">{pr.title}</div>
      <div className="pr-card-foot">
        <PRBadge state={pr.state} />
        <span className="pr-card-date">{formatDate(pr.updatedAt)}</span>
      </div>
    </a>
  );
}

function MarqueeRow({
  prs,
  reverse,
  label,
}: {
  prs: PRCard[];
  reverse?: boolean;
  label: string;
}) {
  const doubled = [...prs, ...prs];
  return (
    <div className="pr-marquee" role="list" aria-label={label}>
      <div className={`pr-track${reverse ? " reverse" : ""}`}>
        {doubled.map((pr, i) => (
          <div
            key={`${pr.id}-${i}`}
            role="listitem"
            aria-hidden={i >= prs.length}
            // The doubled copy is visual-only for the seamless loop; without
            // this its links stay in the tab order behind an aria-hidden node.
            inert={i >= prs.length}
            style={{ flexShrink: 0 }}
          >
            <PRMarqueeCard pr={pr} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PRWall() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.08);
  const [prs, setPrs] = useState<PRCard[]>(FALLBACK_PRS);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/search/issues?q=author:${GITHUB_USER}+type:pr&per_page=30&sort=updated&order=desc`,
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const items = (data.items ?? []) as GhPRItem[];
        if (items.length > 0) setPrs(items.map(toCard));
        if (typeof data.total_count === "number") setTotal(data.total_count);
      } catch {
        // Keep fallback PRs — section still renders offline / rate-limited.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [rowA, rowB] = useMemo(() => {
    const mid = Math.max(1, Math.ceil(prs.length / 2));
    return [prs.slice(0, mid), prs.slice(mid)];
  }, [prs]);

  return (
    <section id="prs" className="section-pad" aria-label="Pull requests">
      <div className="section-line" />
      <div ref={ref}>
        <div className={`fi ${visible ? "in" : ""}`} style={{ marginBottom: 40 }}>
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
              Pull requests
              <br />
              <span className="outline">shipped upstream</span>
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                  letterSpacing: "0.08em",
                }}
              >
                {loading ? "loading…" : `${total ?? prs.length}+ PRs authored`}
              </span>
              <a
                href={`https://github.com/pulls?q=author:${GITHUB_USER}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
                style={{ padding: "8px 16px", fontSize: 13 }}
              >
                View all ↗
              </a>
            </div>
          </div>
          <p
            style={{
              maxWidth: 560,
              color: "var(--muted)",
              fontSize: 16,
              lineHeight: 1.55,
              marginTop: 16,
            }}
          >
            Real fixes and features merged into projects I don&apos;t own —
            hover to pause, click any card to review the PR on GitHub.
          </p>
        </div>

        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: "0.12s",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginLeft: "calc(clamp(22px, 5vw, 80px) * -1)",
            marginRight: "calc(clamp(22px, 5vw, 80px) * -1)",
          }}
        >
          <MarqueeRow prs={rowA} label="Recently updated pull requests, row one" />
          {rowB.length > 0 && (
            <MarqueeRow prs={rowB} reverse label="Recently updated pull requests, row two" />
          )}
        </div>
      </div>
    </section>
  );
}
