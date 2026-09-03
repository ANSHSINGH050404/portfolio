"use client";
import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { SITE } from "../constants";
import { SpotlightCard } from "./SpotlightCard";

export function ResumeDownload() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.1);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const link = document.createElement("a");
    link.href = SITE.resumePath;
    link.download = SITE.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div
      ref={ref}
      className={`fi ${visible ? "in" : ""}`}
      style={{ transitionDelay: "0.1s" }}
    >
      <SpotlightCard
        accent="var(--accent)"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "36px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: 10 }}>
            Resume
          </div>
          <h3
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "var(--fg)",
              letterSpacing: "-0.03em",
              marginBottom: 6,
            }}
          >
            {SITE.name}
          </h3>
          <p
            style={{
              fontSize: 15,
              color: "var(--muted)",
              letterSpacing: "-0.01em",
            }}
          >
            Full-stack & agentic AI
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={SITE.socials.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ padding: "11px 20px", fontSize: 14 }}
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-primary"
          >
            {downloading ? "Downloading…" : "Download CV"}
          </button>
        </div>
      </SpotlightCard>
    </div>
  );
}
