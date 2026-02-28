"use client";
import { PROJECTS } from "../constants";

interface ProjectsProps {
  visible: boolean;
  projRef: React.RefObject<HTMLDivElement | null>;
}

export function Projects({ visible, projRef }: ProjectsProps) {
  return (
    <section
      id="projects"
      style={{ padding: "120px clamp(24px,5vw,80px)", position: "relative", zIndex: 10 }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg,transparent,#ffffff06,transparent)",
        }}
      />
      <div ref={projRef}>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
                color: "#00ffe0",
                letterSpacing: ".18em",
                marginBottom: 16,
              }}
            >
              {"// 001 — SELECTED WORK"}
            </div>
            <h2
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(48px,7vw,88px)",
                lineHeight: 0.95,
                color: "#fff",
                letterSpacing: ".02em",
              }}
            >
              FEATURED
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px #ffffff20",
                  color: "transparent",
                }}
              >
                PROJECTS
              </span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 300,
              color: "#334155",
              fontSize: 14,
              lineHeight: 1.85,
              fontWeight: 300,
            }}
          >
            Real-world AI-powered products designed, built, and shipped from zero
            to production.
          </p>
        </div>
      </div>

      <div
        className="three-col"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 1,
          background: "#ffffff05",
          border: "1px solid #ffffff05",
        }}
      >
        {PROJECTS.map((p, i) => (
          <a
            key={p.id}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className={`pcard fi ${visible ? "in" : ""}`}
            style={{
              transitionDelay: `${i * 0.12 + 0.2}s`,
              padding: "36px 32px",
              textDecoration: "none",
              display: "block",
            }}
            data-hover
          >
            <div className="pcard-num">{p.id}</div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg,${p.accent},transparent)`,
              }}
            />
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 9,
                color: p.accent,
                letterSpacing: ".18em",
                marginBottom: 20,
                opacity: 0.7,
              }}
            >
              {p.year}
            </div>
            <h3
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 38,
                letterSpacing: ".03em",
                color: "#f1f5f9",
                marginBottom: 6,
                lineHeight: 1,
              }}
            >
              {p.title}
            </h3>
            <div
              style={{
                fontSize: 11,
                color: "#334155",
                marginBottom: 20,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {p.subtitle}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.85,
                marginBottom: 28,
                fontWeight: 300,
              }}
            >
              {p.desc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
              {p.stack.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 9,
                    color: p.accent,
                    background: `${p.accent}10`,
                    border: `1px solid ${p.accent}28`,
                    padding: "3px 10px",
                    letterSpacing: ".06em",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
                color: p.accent,
                letterSpacing: ".1em",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 1,
                  background: p.accent,
                  boxShadow: `0 0 8px ${p.accent}`,
                }}
              />
              VIEW PROJECT
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
