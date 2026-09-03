"use client";
import { useEffect, useState } from "react";
import { Counter } from "./Counter";
import { ROLES, SITE, STATS } from "../constants";

interface HeroProps {
  loaded: boolean;
}

export function Hero({ loaded }: HeroProps) {
  const [display, setDisplay] = useState(ROLES[0]);

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

      <div style={{ marginBottom: 20 }}>
        {["Ansh", "Singh"].map((word, wi) => (
          <div key={word} className="hl">
            <span
              className={loaded ? "show" : ""}
              style={{
                transitionDelay: `${wi * 0.1 + 0.12}s`,
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display)",
                fontWeight: 600,
                lineHeight: 1.02,
                letterSpacing: "-0.045em",
                display: "block",
                color: wi === 1 ? "var(--muted)" : "var(--fg)",
              }}
            >
              {word}
            </span>
          </div>
        ))}
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
          {STATS.map((s) => (
            <div key={s.label}>
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
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--dim)",
                  letterSpacing: "-0.01em",
                  marginTop: 8,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
