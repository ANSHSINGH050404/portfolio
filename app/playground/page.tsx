import Link from "next/link";
import { GITHUB_USER, PROJECTS } from "../../constants";

export const metadata = {
  title: "Playground",
};

export default function PlaygroundPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-display)",
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "var(--fg)",
          marginBottom: 48,
        }}
      >
        Playground
      </h1>

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 400,
          color: "var(--fg)",
          marginBottom: 24,
        }}
      >
        Selected
      </h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {PROJECTS.map((p) => (
          <li
            key={p.id}
            style={{
              padding: "24px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--fg)",
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                }}
              >
                {p.title}
              </a>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {p.stack.join(" · ")}
              </span>
            </div>
            <p
              style={{
                fontSize: "var(--text-body)",
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            >
              {p.desc}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--accent)",
                  textDecoration: "none",
                }}
              >
                Live ↗
              </a>
              {p.repo && (
                <a
                  href={`https://github.com/${GITHUB_USER}/${p.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--muted)",
                    textDecoration: "none",
                  }}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 64,
          paddingTop: 24,
          borderTop: "1px solid var(--border)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-caption)",
          color: "var(--dim)",
        }}
      >
        <span>© 2026 ansh</span>
        <Link href="/" style={{ color: "var(--dim)", textDecoration: "none" }}>
          Top
        </Link>
      </footer>
    </main>
  );
}
