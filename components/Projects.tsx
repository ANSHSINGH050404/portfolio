"use client";
import { useState } from "react";
import { PROJECTS, type Project } from "../constants";
import { SpotlightCard } from "./SpotlightCard";

interface ProjectsProps {
  visible: boolean;
  projRef: React.RefObject<HTMLDivElement | null>;
}

function PreviewMock({ project }: { project: Project }) {
  return (
    <div
      className="case-preview"
      style={{ background: project.preview.gradient }}
      aria-hidden
    >
      <div className="case-preview-chrome">
        <span />
        <span />
        <span />
        <div className="case-preview-url">{project.title.toLowerCase()}.app</div>
      </div>
      <div className="case-preview-body">
        <div
          className="case-preview-hero"
          style={{ borderColor: `${project.accent}40` }}
        >
          <div
            className="case-preview-badge"
            style={{
              color: project.accent,
              borderColor: `${project.accent}50`,
              background: `${project.accent}12`,
            }}
          >
            {project.preview.label}
          </div>
          <div className="case-preview-lines">
            <div style={{ width: "72%", background: `${project.accent}55` }} />
            <div style={{ width: "48%", background: "#ffffff18" }} />
            <div style={{ width: "60%", background: "#ffffff10" }} />
          </div>
        </div>
        <div className="case-preview-grid">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="case-preview-card"
              style={{
                borderColor: `${project.accent}${i === 0 ? "40" : "18"}`,
                background: i === 0 ? `${project.accent}10` : "#ffffff06",
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="case-preview-glow"
        style={{ background: `radial-gradient(circle, ${project.accent}33, transparent 70%)` }}
      />
    </div>
  );
}

function CaseStudyCard({
  project,
  visible,
  delay,
  featured,
}: {
  project: Project;
  visible: boolean;
  delay: string;
  featured?: boolean;
}) {
  const [expanded, setExpanded] = useState(featured ?? false);

  return (
    <SpotlightCard
      accent={project.accent}
      data-hover
      className={`fi ${visible ? "in" : ""} case-card ${featured ? "case-featured" : ""}`}
      style={{
        transitionDelay: delay,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${project.accent}, transparent)`,
          borderRadius: "12px 12px 0 0",
          zIndex: 2,
        }}
      />

      <div className={`case-layout ${featured ? "featured" : ""}`}>
        <div className="case-media">
          <PreviewMock project={project} />
        </div>

        <div className="case-content">
          <div className="case-meta">
            {featured && (
              <span
                className="case-tag"
                style={{
                  color: project.accent,
                  borderColor: `${project.accent}40`,
                  background: `${project.accent}10`,
                }}
              >
                FEATURED
              </span>
            )}
            <span className="case-year">
              {project.year} · {project.metric}
            </span>
          </div>

          <h3 className="case-title" style={{ fontSize: featured ? "clamp(36px, 5vw, 56px)" : 32 }}>
            {project.title}
          </h3>
          <div className="case-sub">{project.subtitle}</div>
          <p className="case-desc">{project.desc}</p>

          {/* Metric chips */}
          <div className="case-metrics">
            {project.metrics.map((m) => (
              <div key={m.label} className="case-metric">
                <div className="case-metric-val" style={{ color: project.accent }}>
                  {m.value}
                </div>
                <div className="case-metric-label">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="case-stack">
            {project.stack.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: project.accent,
                  background: `${project.accent}10`,
                  border: `1px solid ${project.accent}28`,
                  padding: "3px 10px",
                  letterSpacing: "0.06em",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Expandable case study */}
          <button
            type="button"
            className="case-expand"
            data-hover
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            style={{ color: project.accent, borderColor: `${project.accent}35` }}
          >
            {expanded ? "HIDE CASE STUDY −" : "VIEW CASE STUDY +"}
          </button>

          {expanded && (
            <div className="case-study-body">
              <div className="case-block">
                <div className="case-block-label" style={{ color: project.accent }}>
                  01 · PROBLEM
                </div>
                <p>{project.problem}</p>
              </div>
              <div className="case-block">
                <div className="case-block-label" style={{ color: project.accent }}>
                  02 · APPROACH
                </div>
                <p>{project.approach}</p>
              </div>
              <div className="case-block">
                <div className="case-block-label" style={{ color: project.accent }}>
                  03 · RESULT
                </div>
                <p>{project.result}</p>
              </div>
            </div>
          )}

          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="case-link"
            data-hover
            style={{ color: project.accent }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: project.accent,
                boxShadow: `0 0 8px ${project.accent}`,
                display: "inline-block",
              }}
            />
            VIEW LIVE PROJECT ↗
          </a>
        </div>
      </div>

      <div className="pcard-num case-num">{project.id}</div>
    </SpotlightCard>
  );
}

export function Projects({ visible, projRef }: ProjectsProps) {
  const featured = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
  const rest = PROJECTS.filter((p) => p.id !== featured.id);

  return (
    <section id="projects" className="section-pad">
      <div className="section-line" />
      <div ref={projRef}>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 56,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div className="section-label" style={{ color: "var(--cyan)" }}>
              {"// 001 — SELECTED WORK"}
            </div>
            <h2 className="section-title">
              FEATURED
              <br />
              <span className="outline">PROJECTS</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 320,
              color: "var(--dim)",
              fontSize: 14,
              lineHeight: 1.85,
              fontWeight: 300,
            }}
          >
            Case studies from zero → production. Problem, approach, result —
            and a live link for each.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <CaseStudyCard
          project={featured}
          visible={visible}
          delay="0.12s"
          featured
        />
        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {rest.map((p, i) => (
            <CaseStudyCard
              key={p.id}
              project={p}
              visible={visible}
              delay={`${0.2 + i * 0.1}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
