import type { Metadata } from "next";
import Link from "next/link";

const USES = [
  {
    heading: "Editor & terminal",
    items: ["VS Code (primary)", "Cursor for agent-driven edits", "Ghostty / Windows Terminal", "zsh + starship"],
  },
  {
    heading: "Languages & frameworks",
    items: ["TypeScript", "Python", "Next.js 16 / React 19", "Node.js", "Tailwind CSS 4"],
  },
  {
    heading: "AI & agents",
    items: ["LangChain / LangGraph", "Model Context Protocol (MCP)", "OpenAI, Anthropic, Gemini", "Pinecone", "Browserbase"],
  },
  {
    heading: "Backend & data",
    items: ["PostgreSQL (Neon)", "Redis", "Drizzle ORM", "Cloudflare Workers + Durable Objects", "Docker"],
  },
  {
    heading: "Infra & hosting",
    items: ["Vercel", "Cloudflare", "GitHub Actions", "Bun"],
  },
  {
    heading: "Hardware",
    items: ["Windows workstation (primary)", "External monitor", "Mechanical keyboard"],
  },
];

export const metadata: Metadata = {
  title: "Uses",
  description: "Tools, stack and hardware Ansh Singh uses day to day.",
  alternates: { canonical: "/uses" },
};

export default function UsesPage() {
  return (
    <main
      id="main"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "140px clamp(22px,5vw,80px) 120px",
      }}
    >
      <div className="section-label">Uses</div>
      <h1
        className="section-title"
        style={{ marginBottom: 20, fontSize: "clamp(36px,6vw,64px)" }}
      >
        What I{" "}
        <span className="section-title-outline">use</span>
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
        Tools, stack and hardware. Updated when something changes.
      </p>

      <ul role="list" className="plain-list" style={{ display: "grid", gap: 32 }}>
        {USES.map((u) => (
          <li
            key={u.heading}
            style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24 }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--fg)",
                marginBottom: 12,
              }}
            >
              {u.heading}
            </h2>
            <ul role="list" className="plain-list" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {u.items.map((it) => (
                <li
                  key={it}
                  className="spill"
                  style={{ cursor: "default" }}
                >
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