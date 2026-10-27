"use client";
import { useEffect, useState } from "react";
import { SlotTitle } from "./SlotTitle";
import { HeadlineSmoke } from "./HeadlineSmoke";
import { ROLES, SITE } from "../constants";
import { useToast } from "./Toast";

interface HeroProps {
  loaded: boolean;
}

export function Hero({ loaded }: HeroProps) {
  const [display, setDisplay] = useState(ROLES[0]);
  const toast = useToast();

  useEffect(() => {
    if (!loaded) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % ROLES.length;
      setDisplay(ROLES[idx]);
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px clamp(22px,5vw,80px) 88px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="pulse-layer" aria-hidden="true">
        <span className="pulse-ring-el" />
        <span className="pulse-ring-el pulse-ring-el-2" />
      </div>
      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{ transitionDelay: "0.06s", marginBottom: 28 }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--muted)",
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#30d158",
            }}
          />
          Available — {SITE.location}
        </span>
      </div>

      <div className="hero-title-wrap" style={{ position: "relative", marginBottom: 20 }}>
        <SlotTitle loaded={loaded} />
        <HeadlineSmoke enabled={loaded} />
        {/* Interaction hint for the slot reels. Lives outside the h1 so the
            heading's text content stays exactly the name. */}
        <span
          className="slot-hint"
          aria-hidden="true"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          Click a letter to spin · double-click to replay
        </span>
      </div>

      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{
          transitionDelay: "0.24s",
          marginBottom: 28,
          minHeight: 28,
        }}
      >
        <span
          style={{
            fontSize: 19,
            color: "var(--muted)",
            letterSpacing: "-0.022em",
            fontWeight: 400,
          }}
        >
          {display}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 64,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          className={`fi ${loaded ? "in" : ""}`}
          style={{ transitionDelay: "0.3s", maxWidth: 480 }}
        >
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.42,
              color: "var(--muted)",
              marginBottom: 32,
              fontWeight: 400,
              letterSpacing: "-0.022em",
            }}
          >
            Full-stack and agentic AI. I ship APIs, multi-step LLM workflows,
            and products that hold up in production.
          </p>
          <div
            className="hero-btns"
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <a href="#projects" className="btn-primary">
              See the work
            </a>
            <button onClick={handleDownload} className="btn-ghost" type="button">
              Download CV
            </button>
          </div>
          <div
            style={{
              marginTop: 18,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--muted)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "8px 14px",
            }}
          >
            <span style={{ color: "var(--dim)" }}>$</span>
            <span>email --copy</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(SITE.email);
                  toast("Email copied");
                } catch {
                  toast("Copy failed");
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
                padding: 0,
              }}
              aria-label="Copy email address"
            >
              copy
            </button>
          </div>
        </div>

        <div
          className={`fi ${loaded ? "in" : ""}`}
          style={{ transitionDelay: "0.4s", maxWidth: 360 }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.5,
              color: "var(--muted)",
              letterSpacing: "-0.01em",
            }}
          >
            The numbers that matter — repos, upstream PRs, languages, years —
            live in the band below, pulled live from GitHub.
          </p>
        </div>
      </div>
    </section>
  );
}
