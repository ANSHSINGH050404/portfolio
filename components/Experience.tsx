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
          <div className="section-label">Journey</div>
          <h2 className="section-title">
            Experience
            <br />
            <span className="outline">and path</span>
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
              <div className="timeline-dot" />
              <div
                style={{
                  fontSize: 13,
                  color: "var(--dim)",
                  letterSpacing: "-0.01em",
                  marginBottom: 8,
                }}
              >
                {item.period}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: "var(--fg)",
                  lineHeight: 1.1,
                  marginBottom: 4,
                }}
              >
                {item.role}
              </h3>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  letterSpacing: "-0.01em",
                  marginBottom: 14,
                  opacity: 0.85,
                }}
              >
                {item.org}
              </div>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--muted)",
                  lineHeight: 1.47,
                  fontWeight: 400,
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
