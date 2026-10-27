"use client";
import { Counter } from "./Counter";
import { STAT_LABELS } from "../constants";
import { useStats } from "../hooks/useStats";
import { useReveal } from "../hooks/useReveal";

/**
 * OpenCode-style "by the numbers" band. Pulls the verified GitHub stats out
 * of the hero so they get the room they deserve, with oversized numerals.
 */
export function StatsBand() {
  const stats = useStats();
  const [ref, visible] = useReveal<HTMLDivElement>(0.15);

  return (
    <section
      id="stats"
      aria-label="By the numbers"
      style={{
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
        padding: "72px clamp(22px,5vw,80px)",
        background: "var(--bg-elevated)",
      }}
    >
      <div
        ref={ref}
        className={`fi ${visible ? "in" : ""}`}
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div className="section-label">By the numbers</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Verified, not{" "}
              <span className="section-title-outline">asserted</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 360,
              color: "var(--muted)",
              fontSize: 15,
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
            }}
          >
            Every figure below is pulled live from the GitHub API at request
            time. Nothing is typed by hand.
          </p>
        </div>

        <ul
          role="list"
          className="plain-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
          }}
        >
          {STAT_LABELS.map(({ key, label, sub }, i) => (
            <li
              key={key}
              className={`fi ${visible ? "in" : ""}`}
              style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(48px, 6vw, 80px)",
                  fontWeight: 600,
                  lineHeight: 1,
                  color: "var(--fg)",
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <Counter target={stats[key]} />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--dim)",
                  letterSpacing: "-0.01em",
                  marginTop: 12,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
              {sub && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    marginTop: 4,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span style={{ color: "var(--fg)" }}>{stats[sub.key]}</span>{" "}
                  {sub.label}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}