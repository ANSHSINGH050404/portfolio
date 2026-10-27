"use client";
import { useReveal } from "../hooks/useReveal";

const PRINCIPLES = [
  { title: "Ship in weeks", desc: "Idea → MVP → users in weeks, not quarters." },
  { title: "Verified, not asserted", desc: "Metrics come from APIs at request time. No typed-by-hand claims." },
  { title: "One source of truth", desc: "One constant per URL, one formula per score, one writer per room." },
  { title: "Open by default", desc: "The code, the writing, and the numbers are all public." },
];

export function Principles() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.1);

  return (
    <section
      id="principles"
      style={{
        borderTop: "1px solid var(--hairline)",
        padding: "56px clamp(22px,5vw,80px)",
      }}
    >
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ marginBottom: 28 }}
        >
          <div className="section-label">How I work</div>
        </div>
        <ul
          role="list"
          className="plain-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.title}
              className={`fi ${visible ? "in" : ""}`}
              style={{ transitionDelay: `${0.08 + i * 0.06}s` }}
            >
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--fg)",
                  letterSpacing: "-0.02em",
                  marginBottom: 6,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  lineHeight: 1.5,
                  letterSpacing: "-0.01em",
                }}
              >
                {p.desc}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}