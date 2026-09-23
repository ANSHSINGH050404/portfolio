"use client";
import { SkillBar } from "./SkillBar";
import { VhsBurst } from "./VhsBurst";
import { SKILLS, STACK_PILLS, SITE } from "../constants";

interface SkillsProps {
  visible: boolean;
  skillsRef: React.RefObject<HTMLDivElement | null>;
}

export function Skills({ visible, skillsRef }: SkillsProps) {
  return (
    <section
      id="skills"
      className="section-pad"
      style={{ background: "var(--bg)" }}
    >
      <div className="section-line" />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 400,
          background: "none",
          pointerEvents: "none",
        }}
      />
      <div ref={skillsRef} style={{ position: "relative" }}>
        <VhsBurst trigger={visible} />
        <div className={`fi ${visible ? "in" : ""}`} style={{ marginBottom: 64 }}>
          <div className="section-label">Capabilities</div>
          <h2 className="section-title">
            Skills
            <br />
            <span className="outline">and tools</span>
          </h2>
        </div>

        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px 80px",
          }}
        >
          <div
            className={`fi ${visible ? "in" : ""}`}
            style={{ transitionDelay: "0.2s" }}
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
            style={{ transitionDelay: "0.4s" }}
          >
            <div
              style={{
                fontSize: 13,
                color: "var(--dim)",
                letterSpacing: "-0.01em",
                marginBottom: 18,
              }}
            >
              Also work with
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 48,
              }}
            >
              {STACK_PILLS.map((t) => (
                <span key={t} className="spill" data-hover>
                  {t}
                </span>
              ))}
            </div>

            <div
              style={{
                borderLeft: "1px solid var(--hairline)",
                paddingLeft: 24,
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  color: "var(--muted)",
                  lineHeight: 1.5,
                  fontWeight: 400,
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
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  ["GitHub", "var(--accent)", SITE.socials.github],
                  ["Email", "var(--accent)", SITE.socials.email],
                  ["LinkedIn", "var(--accent)", SITE.socials.linkedin],
                ].map(([name, c, href]) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    data-hover
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: c,
                      textDecoration: "none",
                      letterSpacing: "0.08em",
                      borderBottom: `1px solid ${c}35`,
                      paddingBottom: 3,
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = c)
                    }
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
