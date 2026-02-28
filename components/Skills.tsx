"use client";
import { SkillBar } from "./SkillBar";
import { SKILLS, STACK_PILLS, GITHUB_USER } from "../constants";

interface SkillsProps {
  visible: boolean;
  skillsRef: React.RefObject<HTMLDivElement | null>;
}

export function Skills({ visible, skillsRef }: SkillsProps) {
  return (
    <section
      id="skills"
      style={{
        padding: "120px clamp(24px,5vw,80px)",
        background: "#030306",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg,transparent,#ffffff05,transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 400,
          background: "radial-gradient(ellipse,#7c3aed06 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div ref={skillsRef} style={{ position: "relative" }}>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ marginBottom: 64 }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: "#ff2d78",
              letterSpacing: ".18em",
              marginBottom: 16,
            }}
          >
            {"// 002 — CAPABILITIES"}
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
            SKILLS &<br />
            <span
              style={{
                WebkitTextStroke: "1px #ffffff20",
                color: "transparent",
              }}
            >
              EXPERTISE
            </span>
          </h2>
        </div>
        <div
          className="two-col"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px 80px" }}
        >
          <div
            className={`fi ${visible ? "in" : ""}`}
            style={{ transitionDelay: ".2s" }}
          >
            {SKILLS.map((s, i) => (
              <SkillBar
                key={s.name}
                {...s}
                delay={i * 90 + 250}
                visible={visible}
              />
            ))}
          </div>
          <div
            className={`fi ${visible ? "in" : ""}`}
            style={{ transitionDelay: ".4s" }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 9,
                color: "#334155",
                letterSpacing: ".18em",
                marginBottom: 18,
              }}
            >
              ALSO WORK WITH
            </div>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 52 }}
            >
              {STACK_PILLS.map((t) => (
                <span key={t} className="spill">
                  {t}
                </span>
              ))}
            </div>
            <div style={{ borderLeft: "1px solid #00ffe025", paddingLeft: 24 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#334155",
                  lineHeight: 1.95,
                  fontWeight: 300,
                  marginBottom: 28,
                }}
              >
                Final-year CS student at{" "}
                <span style={{ color: "#94a3b8" }}>SRMS CETR, Bareilly</span>{" "}
                specializing in Agentic AI and backend systems. Built auth
                microservices serving{" "}
                <span style={{ color: "#94a3b8" }}>5,000+ daily users</span> and
                reduced DB load by 60% with Redis caching.
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                {[
                  ["GitHub", "#00ffe0", `https://github.com/${GITHUB_USER}`],
                  ["Email", "#ff2d78", "mailto:anshsinghapa@gmail.com"],
                  ["LinkedIn", "#7c3aed", "#"],
                ].map(([name, c, href]) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10,
                      color: c,
                      textDecoration: "none",
                      letterSpacing: ".08em",
                      borderBottom: `1px solid ${c}35`,
                      paddingBottom: 3,
                      transition: "border-color .2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = c)}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = `${c}35`)
                    }
                  >
                    {name} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
