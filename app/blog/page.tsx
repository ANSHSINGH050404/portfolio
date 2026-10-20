import type { Metadata } from "next";
import Link from "next/link";

import { POSTS } from "../../constants/posts";
import { SITE } from "../../constants";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on realtime systems, agentic AI and browser automation — written from building the projects on this site.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Writing · Ansh Singh",
    description:
      "Notes on realtime systems, agentic AI and browser automation — written from building the projects on this site.",
    url: `${SITE.url}/blog`,
    type: "website",
  },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  return (
    <main
      id="main"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "140px clamp(22px,5vw,80px) 120px",
      }}
    >
      <div className="section-label">Writing</div>
      <h1
        className="section-title"
        style={{ marginBottom: 20, fontSize: "clamp(36px,6vw,64px)" }}
      >
        Notes from
        <br />{" "}
        <span className="section-title-outline">building it</span>
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
        Three write-ups on the problems that actually came up while building
        the projects on this site — what broke, and what fixed it.
      </p>

      <ul role="list" className="plain-list" style={{ display: "grid", gap: 28 }}>
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              data-hover
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                borderTop: "1px solid var(--hairline)",
                paddingTop: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "var(--dim)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  color: "var(--fg)",
                  marginBottom: 10,
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 16,
                  lineHeight: 1.5,
                  marginBottom: 14,
                }}
              >
                {post.summary}
              </p>
              <ul role="list" className="plain-list" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="spill"
                    style={{ cursor: "default" }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Link>
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
