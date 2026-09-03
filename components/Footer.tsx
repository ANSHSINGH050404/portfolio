"use client";
import { SITE } from "../constants";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--hairline)",
        padding: "24px clamp(22px,5vw,80px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        zIndex: 10,
        position: "relative",
        background: "var(--bg)",
      }}
    >
      <a
        href="#about"
        style={{
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--muted)",
          textDecoration: "none",
        }}
      >
        Ansh
      </a>

      <div
        style={{
          fontSize: 13,
          color: "var(--dim)",
          letterSpacing: "-0.01em",
          textAlign: "center",
        }}
      >
        Designed and built by Ansh · {new Date().getFullYear()}
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {[
          ["GitHub", SITE.socials.github],
          ["LinkedIn", SITE.socials.linkedin],
          ["Email", SITE.socials.email],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer"
            style={{
              fontSize: 13,
              color: "var(--muted)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              transition: "color var(--duration) var(--ease)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
