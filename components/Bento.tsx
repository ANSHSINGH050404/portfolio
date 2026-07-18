"use client";
import { BENTO } from "../constants";
import { useReveal } from "../hooks/useReveal";
import { SpotlightCard } from "./SpotlightCard";

export function Bento() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.08);

  return (
    <section
      id="about-more"
      className="section-pad"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <div ref={ref}>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ marginBottom: 40 }}
        >
          <div className="section-label" style={{ color: "var(--cyan)" }}>
            {"// WHAT I DO"}
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            BUILT FOR <span className="outline">IMPACT</span>
          </h2>
        </div>

        <div className="bento-grid">
          {BENTO.map((card, i) => (
            <SpotlightCard
              key={card.id}
              accent={card.accent}
              data-hover
              className={`bento-${card.span} fi ${visible ? "in" : ""}`}
              style={{
                transitionDelay: `${0.1 + i * 0.08}s`,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: card.span === "lg" ? "36px 32px" : "28px 24px",
                minHeight: card.span === "lg" ? 220 : 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: card.accent,
                  boxShadow: `0 0 14px ${card.accent}`,
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: card.span === "lg" ? 36 : 24,
                  letterSpacing: "0.04em",
                  color: "#f1f5f9",
                  marginBottom: 10,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {card.title}
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--dim)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  maxWidth: card.span === "lg" ? 360 : "none",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {card.desc}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
