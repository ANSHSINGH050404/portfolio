"use client";
import { useEffect, useState } from "react";
import { SITE } from "../constants";

export function Footer() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.totals?.stars != null) setStars(d.totals.stars);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
        zIndex: 401,
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
        Designed and built by Ansh · {new Date().getFullYear()} ·{" "}
        <a
          href={SITE.socials.github}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--muted)", textDecoration: "none" }}
        >
          Source
          {stars != null ? ` · ${stars}★` : ""}
        </a>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        {[
          ["GitHub", SITE.socials.github],
          ["LinkedIn", SITE.socials.linkedin],
          ["Email", SITE.socials.email],
          ["Now", "/now"],
          ["Uses", "/uses"],
          ["Changelog", "/changelog"],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            target={
              href.startsWith("mailto") || href.startsWith("/")
                ? undefined
                : "_blank"
            }
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