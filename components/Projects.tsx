"use client";
import { useState } from "react";
import Image from "next/image";

import { PROJECTS, type Project } from "../constants";
import { SpotlightCard } from "./SpotlightCard";
import { VhsBurst } from "./VhsBurst";
import { FlashlightPhrase } from "./FlashlightPhrase";

interface ProjectsProps {
  visible: boolean;
  projRef: React.RefObject<HTMLDivElement | null>;
}

function PreviewMock({ project }: { project: Project }) {
  const { image, label, gradient } = project.preview;

  if (image) {
    return (
      <div className="case-preview" style={{ background: gradient }}>
        <Image
          src={image}
          alt={`${project.title} — ${project.subtitle}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="case-preview-img"
        />
      </div>
    );
  }

  return (
    <div
      className="case-preview"
      style={{ background: gradient }}
      aria-hidden
    >
      <div className="case-preview-chrome">
        <span />
        <span />
        <span />
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
            {label}
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
  const caseId = `case-${project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  return (
    <SpotlightCard
      accent={project.accent}
      data-hover
      className={`fi ${visible ? "in" : ""} case-card ${featured ? "case-featured" : ""}`}
      style={{
        transitionDelay: delay,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
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
          height: 1,
          background: "var(--hairline)",
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
                Featured
              </span>
            )}
            <span className="case-year">
              {project.year} · {project.metric}
            </span>
          </div>

          <h3 className="case-title" style={{ fontSize: featured ? "clamp(28px, 4vw, 44px)" : 26 }}>
            {project.title}
          </h3>
          <div className="case-sub">{project.subtitle}</div>
          <p className="case-desc">{project.desc}</p>

          {/* Metric chips */}
          <ul className="case-metrics plain-list" role="list">
            {project.metrics.map((m) => (
              <li key={m.label} className="case-metric">
                <div className="case-metric-val" style={{ color: project.accent }}>
                  {m.value}
                </div>
                <div className="case-metric-label">{m.label}</div>
              </li>
            ))}
          </ul>

          <div className="case-stack">
            {project.stack.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--hairline)",
                  padding: "4px 10px",
                  letterSpacing: "-0.01em",
                  borderRadius: 999,
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
            aria-controls={caseId}
            style={{ color: project.accent, borderColor: `${project.accent}35` }}
          >
            {expanded ? "Hide case study" : "View case study"}
          </button>

          {/* Kept in the DOM while collapsed so aria-controls always resolves;
              `hidden` collapses it without display overrides. */}
          <div className="case-study-body" id={caseId} hidden={!expanded}>
            <div className="case-block">
              <div className="case-block-label" style={{ color: project.accent }}>
                Problem
              </div>
              <p>{project.problem}</p>
            </div>
            <div className="case-block">
              <div className="case-block-label" style={{ color: project.accent }}>
                Approach
              </div>
              <p>{project.approach}</p>
            </div>
            <div className="case-block">
              <div className="case-block-label" style={{ color: project.accent }}>
                Result
              </div>
              <p>{project.result}</p>
            </div>
          </div>

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
                boxShadow: "none",
                display: "inline-block",
              }}
            />
            View live
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
      <div ref={projRef} style={{ position: "relative" }}>
        <VhsBurst trigger={visible} />
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
            <div className="section-label">Selected work</div>
            <h2 className="section-title">
              Featured
              <br />
              <span className="outline">projects</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 320,
              color: "var(--muted)",
              fontSize: 17,
              lineHeight: 1.47,
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Case studies from zero to production. Problem, approach, result
            <FlashlightPhrase
              title="How these case studies read"
              note="Every project below follows the same arc: the problem worth solving, the approach taken, and the measured result — always with a live link so you can try the real thing."
            >
              {" — "}
            </FlashlightPhrase>{" "}
            and a live link.
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
