import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Colophon",
  description: "How this portfolio site is built.",
  alternates: { canonical: "/colophon" },
};

const FACTS = [
  { label: "Framework", value: "Next.js 16 (App Router) · React 19" },
  { label: "Language", value: "TypeScript (strict)" },
  { label: "Styling", value: "Tailwind CSS 4 + CSS variables" },
  { label: "Fonts", value: "Geist Sans & Geist Mono" },
  { label: "Hosting", value: "Vercel" },
  { label: "Analytics", value: "Databuddy (optional, env-gated)" },
  { label: "Data", value: "GitHub API, cached server-side, revalidated hourly" },
  { label: "Source", value: "Open source on GitHub (link in footer)" },
];

export default function ColophonPage() {
  return (
    <main
      id="main"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "140px clamp(22px,5vw,80px) 120px",
      }}
    >
      <div className="section-label">Colophon</div>
      <h1
        className="section-title"
        style={{ marginBottom: 20, fontSize: "clamp(36px,6vw,64px)" }}
      >
        How this site is{" "}
        <span className="section-title-outline">built</span>
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
        The stack, the principles, and the boring details. The full reasoning
        lives in the blog post &quot;Structured data beats prose when the reader is
        a model&quot;.
      </p>

      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "16px 24px",
          borderTop: "1px solid var(--hairline)",
          paddingTop: 24,
        }}
      >
        {FACTS.map((f) => (
          <div key={f.label} style={{ display: "contents" }}>
            <dt
              style={{
                color: "var(--dim)",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {f.label}
            </dt>
            <dd
              style={{
                color: "var(--fg)",
                fontSize: 15,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

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
        <Link href="/blog/structured-data-beats-prose-for-agents" className="btn-ghost" data-hover>
          Read the post
        </Link>
      </div>
    </main>
  );
}