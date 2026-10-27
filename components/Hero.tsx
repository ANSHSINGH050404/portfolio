"use client";
import { useEffect, useState } from "react";
import { ROLES, SITE } from "../constants";
import { useToast } from "./Toast";
import { HeroTerminal } from "./HeroTerminal";

interface HeroProps {
  loaded: boolean;
}

export function Hero({ loaded }: HeroProps) {
  const [roleIdx, setRoleIdx] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % ROLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loaded]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = SITE.resumePath;
    link.download = SITE.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="about"
      style={{
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px clamp(18px, 4vw, 56px) 64px",
        position: "relative",
        zIndex: 10,
        fontFamily: "var(--font-mono)",
      }}
    >
      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
          gap: "48px 40px",
          alignItems: "center",
        }}
      >
        {/* Left Column: Developer Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Status Badge */}
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: "12px",
                color: "var(--muted)",
                letterSpacing: "-0.01em",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "5px 12px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--status-green)",
                  display: "inline-block",
                  animation: "pdot 2s infinite",
                }}
              />
              OPEN TO WORK · {SITE.location.toUpperCase()}
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1
              style={{
                fontSize: "clamp(40px, 6vw, 68px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                marginBottom: "8px",
              }}
            >
              ANSH SINGH
            </h1>
            <div
              style={{
                fontSize: "clamp(16px, 2.2vw, 22px)",
                color: "var(--accent)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>&gt;</span>
              <span>{ROLES[roleIdx]}</span>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "var(--muted)",
              maxWidth: "520px",
              letterSpacing: "-0.01em",
            }}
          >
            Specializing in{" "}
            <span style={{ color: "#ffffff", fontWeight: 500 }}>
              Agentic AI systems
            </span>{" "}
            and full-stack infrastructure. I build multi-step reasoning workflows,
            production APIs, and autonomous agents that deliver reliable results.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <a href="#projects" className="btn-primary">
              [ See Work ↗ ]
            </a>
            <button onClick={handleDownload} className="btn-ghost" type="button">
              [ Download CV ↓ ]
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(SITE.email);
                  toast("Email copied to clipboard");
                } catch {
                  toast("Copy failed");
                }
              }}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--muted)",
                padding: "8px 14px",
                fontFamily: "inherit",
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "var(--dim)" }}>$</span>
              <span>email --copy</span>
            </button>
          </div>

          {/* Quick Metrics TUI Row */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "8px",
              paddingTop: "18px",
              borderTop: "1px solid var(--hairline)",
              fontSize: "12px",
              color: "var(--dim)",
            }}
          >
            <div>
              <span style={{ color: "#ffffff", fontWeight: 600 }}>3+</span> PROJECTS SHIPPED
            </div>
            <div>·</div>
            <div>
              <span style={{ color: "#ffffff", fontWeight: 600 }}>50+</span> OSS CONTRIBS
            </div>
            <div>·</div>
            <div>
              <span style={{ color: "#ffffff", fontWeight: 600 }}>5K+</span> DAILY USERS
            </div>
          </div>
        </div>

        {/* Right Column: Hero Terminal TUI */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <HeroTerminal />
        </div>
      </div>
    </section>
  );
}
