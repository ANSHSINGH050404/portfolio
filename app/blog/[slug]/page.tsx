import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { POSTS, getPost } from "../../../constants/posts";
import { SITE } from "../../../constants";
import { parseBody, renderInline } from "../../../lib/markdown";
export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${SITE.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const blocks = parseBody(post.body);

  return (
    <main
      id="main"
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "140px clamp(22px,5vw,80px) 120px",
      }}
    >
      <article>
        <Link
          href="/blog"
          data-hover
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--dim)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 28,
          }}
        >
          ← All writing
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px,5vw,52px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--fg)",
            marginBottom: 18,
          }}
        >
          {post.title}
        </h1>

        <p
          style={{
            color: "var(--muted)",
            fontSize: 18,
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          {post.summary}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            paddingBottom: 32,
            marginBottom: 40,
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--dim)",
            }}
          >
            {formatDate(post.date)}
          </span>
          <span style={{ color: "var(--dim)", fontSize: 12 }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--dim)",
            }}
          >
            {post.readingMinutes} min read
          </span>
          <ul
            role="list"
            className="plain-list"
            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            {post.tags.map((tag) => (
              <li key={tag} className="spill" style={{ cursor: "default" }}>
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="post-body">
          {blocks.map((block, i) => {
            if (block.kind === "h2") {
              return (
                <h2
                  key={i}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.2,
                    color: "var(--fg)",
                    marginTop: 48,
                    marginBottom: 16,
                  }}
                  dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                />
              );
            }
            if (block.kind === "code") {
              return (
                <pre
                  key={i}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "18px 20px",
                    overflowX: "auto",
                    marginTop: 24,
                    marginBottom: 24,
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--muted)",
                  }}
                >
                  <code>{block.text}</code>
                </pre>
              );
            }
            if (block.kind === "ul") {
              return (
                <ul
                  key={i}
                  role="list"
                  className="plain-list"
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    paddingLeft: 22,
                    listStyle: "disc",
                    color: "var(--muted)",
                    fontSize: 17,
                    lineHeight: 1.6,
                  }}
                >
                  {block.items.map((item, j) => (
                    <li key={j} style={{ marginBottom: 8 }}>
                      <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p
                key={i}
                style={{
                  color: "var(--muted)",
                  fontSize: 17,
                  lineHeight: 1.62,
                  marginTop: 20,
                  marginBottom: 20,
                }}
                dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
              />
            );
          })}
        </div>
      </article>

      <div
        style={{
          marginTop: 72,
          paddingTop: 32,
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link href="/" className="btn-ghost" data-hover>
          ← Back to the portfolio
        </Link>
        <Link href="/blog" className="btn-ghost" data-hover>
          All writing
        </Link>
      </div>
    </main>
  );
}
