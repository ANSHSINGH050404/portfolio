"use client";
import { useEffect, useState } from "react";
import { Counter } from "./Counter";
import { ROLES, SITE, STATS } from "../constants";

interface HeroProps {
  loaded: boolean;
}

export function Hero({ loaded }: HeroProps) {
  const [display, setDisplay] = useState(ROLES[0]);
  const [scrambling, setScrambling] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    let idx = 0;
    let scrambleTimer: ReturnType<typeof setInterval> | null = null;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789░▒▓█/<#>";

    const runScramble = () => {
      const next = (idx + 1) % ROLES.length;
      const target = ROLES[next];
      setScrambling(true);
      let frame = 0;
      const maxFrames = 12;
      if (scrambleTimer) clearInterval(scrambleTimer);
      scrambleTimer = setInterval(() => {
        frame++;
        if (frame >= maxFrames) {
          if (scrambleTimer) clearInterval(scrambleTimer);
          scrambleTimer = null;
          setDisplay(target);
          idx = next;
          setScrambling(false);
          return;
        }
        setDisplay(
          target
            .split("")
            .map((c, i) =>
              i < (frame / maxFrames) * target.length
                ? c
                : chars[Math.floor(Math.random() * chars.length)],
            )
            .join(""),
        );
      }, 40);
    };

    const interval = setInterval(runScramble, 3200);
    return () => {
      clearInterval(interval);
      if (scrambleTimer) clearInterval(scrambleTimer);
    };
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
        padding: "110px clamp(20px,5vw,80px) 80px",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "15%",
          right: "8%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, #00ffe012 0%, transparent 70%)",
          animation: "orb-drift 18s ease-in-out infinite",
          pointerEvents: "none",
          filter: "blur(2px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff2d780c 0%, transparent 70%)",
          animation: "orb-drift 22s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      <div
        className="hide-mob"
        style={{
          position: "absolute",
          right: 36,
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "#ffffff14",
          letterSpacing: "0.22em",
          whiteSpace: "nowrap",
        }}
      >
        FULL · STACK · AGENTIC AI · 2025
      </div>

      {/* Corner marks */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: "clamp(20px,5vw,80px)",
          width: 40,
          height: 40,
          borderTop: "1px solid #00ffe040",
          borderLeft: "1px solid #00ffe040",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 50,
          right: "clamp(20px,5vw,80px)",
          width: 40,
          height: 40,
          borderBottom: "1px solid #ff2d7840",
          borderRight: "1px solid #ff2d7840",
        }}
      />

      {/* Status badge */}
      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{ transitionDelay: "0.1s", marginBottom: 32 }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--cyan)",
            letterSpacing: "0.12em",
            border: "1px solid #00ffe028",
            padding: "8px 18px",
            background: "#00ffe006",
            borderRadius: 2,
          }}
        >
          <span style={{ position: "relative", width: 8, height: 8 }}>
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "var(--cyan)",
                animation: "pulse-ring 2s infinite",
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "var(--cyan)",
              }}
            />
          </span>
          OPEN TO WORK · {SITE.location.toUpperCase()}
        </span>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 28 }}>
        {["ANSH", "SINGH"].map((word, wi) => (
          <div key={word} className="hl">
            <span
              className={loaded ? "show" : ""}
              style={{
                transitionDelay: `${wi * 0.14 + 0.2}s`,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(72px, 13vw, 160px)",
                lineHeight: 0.88,
                letterSpacing: "-0.01em",
                display: "block",
                color: wi === 1 ? "transparent" : "#fff",
                WebkitTextStroke: wi === 1 ? "1.5px #ffffff20" : "none",
              }}
            >
              {wi === 0 ? (
                <span
                  className="glitch"
                  data-text={word}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    color: "#fff",
                    WebkitTextStroke: "none",
                  }}
                >
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Rotating role */}
      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{
          transitionDelay: "0.45s",
          marginBottom: 28,
          minHeight: 28,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(13px, 2vw, 16px)",
            color: scrambling ? "var(--magenta)" : "var(--cyan)",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
        >
          <span style={{ color: "var(--dim)", marginRight: 10 }}>&gt;</span>
          {display}
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: "1em",
              background: "var(--cyan)",
              marginLeft: 4,
              verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }}
          />
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 56,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          className={`fi ${loaded ? "in" : ""}`}
          style={{ transitionDelay: "0.55s", maxWidth: 500 }}
        >
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.9,
              color: "var(--dim)",
              marginBottom: 36,
              fontWeight: 300,
            }}
          >
            Final-year CS student &{" "}
            <span style={{ color: "#cbd5e1", fontWeight: 500 }}>
              Full-Stack Developer
            </span>{" "}
            specializing in{" "}
            <span style={{ color: "#cbd5e1", fontWeight: 500 }}>
              Agentic AI systems
            </span>
            . I build scalable APIs, multi-step LLM workflows, and
            production-ready products end-to-end.
          </p>
          <div
            className="hero-btns"
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <a href="#projects" className="btn-primary" data-hover>
              SEE MY WORK
              <span aria-hidden>→</span>
            </a>
            <button
              onClick={handleDownload}
              className="btn-ghost"
              data-hover
              style={{ color: "var(--amber)", borderColor: "#f59e0b40" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f59e0b80";
                e.currentTarget.style.boxShadow = "0 0 30px #f59e0b25";
                e.currentTarget.style.color = "var(--amber)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f59e0b40";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              DOWNLOAD CV
            </button>
          </div>
        </div>

        <div
          className={`fi ${loaded ? "in" : ""}`}
          style={{
            transitionDelay: "0.7s",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "28px 40px",
            marginTop: 4,
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  lineHeight: 1,
                  color: "#f1f5f9",
                  letterSpacing: "-0.01em",
                }}
              >
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--dim)",
                  letterSpacing: "0.12em",
                  marginTop: 6,
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{
          transitionDelay: "0.95s",
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "#ffffff18",
            letterSpacing: "0.18em",
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 48,
            background: "linear-gradient(var(--cyan), transparent)",
            animation: "sline 1.6s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
