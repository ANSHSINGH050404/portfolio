"use client";
import { EXPERIENCE } from "../constants";
import { useReveal } from "../hooks/useReveal";

export function Experience() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.08);

  return (
    <section id="experience" className="section-pad">
      <div className="section-line" />
      <div ref={ref}>
        <div className={`fi ${visible ? "in" : ""}`} style={{ marginBottom: 64 }}>
          <div className="section-label" style={{ color: "var(--violet)" }}>
            {"// 003 — JOURNEY"}
          </div>
          <h2 className="section-title">
            EXPERIENCE
            <br />
            <span className="outline">& PATH</span>
          </h2>
        </div>

        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ transitionDelay: "0.15s", maxWidth: 720 }}
        >
          {EXPERIENCE.map((item, i) => (
            <div
              key={item.role + item.org}
              className="timeline-item"
              style={{
                transitionDelay: `${0.2 + i * 0.1}s`,
              }}
            >
              <div className="timeline-dot" style={{
                background: i === 0 ? "var(--cyan)" : i === 1 ? "var(--magenta)" : "var(--violet)",
                boxShadow: `0 0 12px ${i === 0 ? "var(--cyan)" : i === 1 ? "var(--magenta)" : "var(--violet)"}`,
              }} />
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--muted)",
                  letterSpacing: "0.14em",
                  marginBottom: 8,
                }}
              >
                {item.period}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  letterSpacing: "0.04em",
                  color: "#f1f5f9",
                  lineHeight: 1.1,
                  marginBottom: 4,
                }}
              >
                {item.role}
              </h3>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--cyan)",
                  letterSpacing: "0.06em",
                  marginBottom: 14,
                  opacity: 0.85,
                }}
              >
                {item.org}
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--dim)",
                  lineHeight: 1.85,
                  fontWeight: 300,
                  marginBottom: 16,
                  maxWidth: 560,
                }}
              >
                {item.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {item.tags.map((t) => (
                  <span key={t} className="spill" style={{ cursor: "default" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
