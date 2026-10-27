import type { Metadata } from "next";
import Link from "next/link";

import { SITE } from "../../constants";

export const metadata: Metadata = {
  title: "Now",
  description: "What Ansh Singh is building right now.",
  alternates: { canonical: "/now" },
};

const NOW = [
  {
    heading: "Shipping",
    body: "Iterating on Browseflow — the AI browser workflow builder. Focus this month: observer nodes, conditional branching, and session replay polish.",
  },
  {
    heading: "Exploring",
    body: "MCP servers and tool-using agents. Omni Search MCP is live; next is a deeper research-agent loop with structured mind maps.",
  },
  {
    heading: "Writing",
    body: "Technical notes on realtime systems and agent design. Latest: 'One authoritative state per room' on the TypeRace rebuild.",
  },
  {
    heading: "Learning",
    body: "Cloudflare Durable Objects edge cases, and eval harnesses for agentic flows.",
  },
];

export default function NowPage() {
  return (
    <main
      id="main"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "140px clamp(22px,5vw,80px) 120px",
      }}
    >
      <div className="section-label">Now</div>
      <h1
        className="section-title"
        style={{ marginBottom: 20, fontSize: "clamp(36px,6vw,64px)" }}
      >
        What I&apos;m{" "}
        <span className="section-title-outline">doing now</span>
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
        A snapshot of current focus. Updated when it changes — inspired by the
        /now page convention.
      </p>

      <ul role="list" className="plain-list" style={{ display: "grid", gap: 32 }}>
        {NOW.map((n) => (
          <li
            key={n.heading}
            style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24 }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--fg)",
                marginBottom: 8,
              }}
            >
              {n.heading}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.5 }}>
              {n.body}
            </p>
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
        <a
          href={`mailto:${SITE.email}`}
          className="btn-primary"
          data-hover
        >
          Get in touch
        </a>
      </div>
    </main>
  );
}