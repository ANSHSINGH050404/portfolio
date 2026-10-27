"use client";
import { FAQ as FAQ_ITEMS } from "../constants";
import { useReveal } from "../hooks/useReveal";

export function FAQ() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="faq" className="section-pad">
      <div className="section-line" />
      <div ref={ref} style={{ position: "relative" }}>
        <div className={`fi ${visible ? "in" : ""}`} style={{ marginBottom: 40 }}>
          <div className="section-label">FAQ</div>
          <h2 className="section-title">
            Questions people{" "}
            <span className="section-title-outline">actually ask</span>
          </h2>
        </div>

        <div
          style={{
            maxWidth: 820,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={item.q}
              className={`fi ${visible ? "in" : ""}`}
              style={{
                transitionDelay: `${0.08 + i * 0.05}s`,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0 20px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  padding: "18px 0",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--fg)",
                  letterSpacing: "-0.01em",
                  listStyle: "none",
                }}
              >
                {item.q}
              </summary>
              <p
                style={{
                  paddingBottom: 18,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--muted)",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}