"use client";
import { useEffect, useState } from "react";
import { Counter } from "./Counter";
import { SlotTitle } from "./SlotTitle";
import { HeadlineSmoke } from "./HeadlineSmoke";
import { ROLES, SITE, STAT_LABELS } from "../constants";
import { useStats } from "../hooks/useStats";

interface HeroProps {
  loaded: boolean;
}

export function Hero({ loaded }: HeroProps) {
  const [display, setDisplay] = useState(ROLES[0]);
  const stats = useStats();

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
        style={{ transitionDelay: "0.08s", marginBottom: 28 }}
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
      </div>

      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{
          transitionDelay: "0.38s",
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
          style={{ transitionDelay: "0.48s", maxWidth: 480 }}
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
        </div>

        <div
          className={`fi ${loaded ? "in" : ""}`}
          style={{
            transitionDelay: "0.58s",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "28px 48px",
            marginTop: 4,
          }}
        >
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 600,
                  lineHeight: 1,
                  color: "var(--fg)",
                  letterSpacing: "-0.04em",
                }}
              >
                <Counter target={stats[key]} />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--dim)",
                  letterSpacing: "-0.01em",
                  marginTop: 8,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
