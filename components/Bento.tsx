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
      <div ref={ref} style={{ position: "relative" }}>
        <div className="pulse-layer pulse-layer-bento" aria-hidden="true">
          <span className="pulse-ring-el" />
        </div>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ marginBottom: 40 }}
        >
          <div className="section-label">What I do</div>
          <h2 className="section-title">
            Built for <span className="outline">impact</span>
          </h2>
        </div>

        <div className="bento-grid">
          {BENTO.map((card, i) => (
            <SpotlightCard
              key={card.id}
              accent="var(--accent)"
              data-hover
              className={`bento-${card.span} fi ${visible ? "in" : ""}`}
              style={{
                transitionDelay: `${0.1 + i * 0.08}s`,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
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
                  background: "var(--accent)",
                  boxShadow: "none",
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: card.span === "lg" ? 36 : 24,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: "var(--fg)",
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
                  color: "var(--muted)",
                  lineHeight: 1.47,
                  fontWeight: 400,
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
