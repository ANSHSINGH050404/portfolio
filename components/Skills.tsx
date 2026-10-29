"use client";
import { SkillBar } from "./SkillBar";
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
        <div className={`fi ${visible ? "in" : ""}`} style={{ marginBottom: 64 }}>
          <div className="section-label">{"// 02. CAPABILITIES"}</div>
          <h2 className="section-title">
            Skills
            <br />{" "}
            <span className="section-title-outline">&amp; tooling</span>
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
            <ul className="plain-list" role="list">
              {SKILLS.map((s, i) => (
                <li key={s.name}>
                  <SkillBar
                    {...s}
                    delay={i * 90 + 250}
                    visible={visible}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`fi ${visible ? "in" : ""}`}
            style={{ transitionDelay: "0.4s" }}
          >
            <div
              style={{
                fontSize: 12,
                color: "var(--dim)",
                letterSpacing: "-0.01em",
                marginBottom: 16,
                fontFamily: "var(--font-mono)",
              }}
            >
              {"// EXTENDED_STACK"}
            </div>
            <ul
              role="list"
              className="plain-list"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 48,
              }}
            >
              {STACK_PILLS.map((t) => (
                <li key={t} className="spill" data-hover>
                  [{t}]
                </li>
              ))}
            </ul>

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
                Computer Science at{" "}
                <span style={{ color: "#94a3b8" }}>SRMS CETR, Bareilly</span>,
                focused on agentic AI and backend systems. I ship the whole
                loop — schema, API, agent, UI — and keep it running in
                production.
              </p>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  ["GitHub", "var(--accent)", SITE.socials.github],
                  ["Email", "var(--accent)", SITE.socials.email],
                  ["X / Twitter", "var(--accent)", SITE.socials.twitter],
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
