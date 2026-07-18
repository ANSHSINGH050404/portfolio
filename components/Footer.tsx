"use client";
import { SITE } from "../constants";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #ffffff08",
        padding: "28px clamp(20px,5vw,80px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        zIndex: 10,
        position: "relative",
        background: "#020205",
      }}
    >
      <a
        href="#about"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          letterSpacing: "0.14em",
          color: "#ffffff20",
          textDecoration: "none",
        }}
        data-hover
      >
        ANSH<span style={{ color: "#00ffe030" }}>.</span>DEV
      </a>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "#ffffff14",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        DESIGNED & BUILT FROM SCRATCH — {new Date().getFullYear()}
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {[
          ["GH", SITE.socials.github],
          ["LI", SITE.socials.linkedin],
          ["@", SITE.socials.email],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer"
            data-hover
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "#ffffff20",
              textDecoration: "none",
              letterSpacing: "0.1em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff20")}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
