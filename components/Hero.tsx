"use client";
import { Counter } from "./Counter";

interface HeroProps {
  loaded: boolean;
}

export function Hero({ loaded }: HeroProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Resume-feb@11.pdf";
    link.download = "Ansh-Kumar-Singh-Resume.pdf";
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
        padding: "100px clamp(24px,5vw,80px) 60px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        className="hide-mob"
        style={{
          position: "absolute",
          right: 36,
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
          color: "#ffffff18",
          letterSpacing: ".2em",
        }}
      >
        FULL · STACK · AGENTIC AI · 2024
      </div>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: "clamp(24px,5vw,80px)",
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
          right: "clamp(24px,5vw,80px)",
          width: 40,
          height: 40,
          borderBottom: "1px solid #ff2d7840",
          borderRight: "1px solid #ff2d7840",
        }}
      />

      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{ transitionDelay: ".1s", marginBottom: 36 }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            color: "#00ffe0",
            letterSpacing: ".12em",
            border: "1px solid #00ffe028",
            padding: "7px 16px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00ffe0",
              animation: "pdot 2s infinite",
            }}
          />
          OPEN TO WORK · BAREILLY, INDIA
        </span>
      </div>

      <div style={{ marginBottom: 32 }}>
        {["ANSHs", "ANSH","SINGH"].map((word, wi) => (
          <div key={word} className="hl">
            <span
              className={loaded ? "show" : ""}
              style={{
                transitionDelay: `${wi * 0.14 + 0.2}s`,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(72px,12vw,156px)",
                lineHeight: 0.9,
                letterSpacing: "-.01em",
                display: "block",
                color: wi === 1 ? "transparent" : "#fff",
                WebkitTextStroke: wi === 1 ? "1px #ffffff22" : "none",
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

      <div
        style={{
          display: "flex",
          gap: 60,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          className={`fi ${loaded ? "in" : ""}`}
          style={{ transitionDelay: ".55s", maxWidth: 480 }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.9,
              color: "#475569",
              marginBottom: 40,
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
            production-ready AI applications end-to-end.
          </p>
          <div
            className="hero-btns"
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <a
              href="#projects"
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 12,
                letterSpacing: ".07em",
                color: "#050508",
                background: "#00ffe0",
                padding: "14px 32px",
                textDecoration: "none",
                fontWeight: 700,
                transition: "box-shadow .25s,transform .15s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 50px #00ffe060";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              SEE MY WORK
            </a>
            <button
              onClick={handleDownload}
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 12,
                letterSpacing: ".07em",
                color: "#f59e0b",
                border: "1px solid #f59e0b40",
                padding: "14px 32px",
                background: "transparent",
                cursor: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 600,
                transition: "border-color .25s,box-shadow .25s,transform .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f59e0b80";
                e.currentTarget.style.boxShadow = "0 0 30px #f59e0b25";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f59e0b40";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
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
            transitionDelay: ".7s",
            display: "flex",
            gap: 44,
            marginTop: 6,
          }}
        >
          {[
            ["30", "+", "PROJECTS"],
            ["50", "+", "OSS CONTRIBS"],
            ["500", "+", "USERS ON SITE"],
          ].map(([n, suf, label]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 54,
                  lineHeight: 1,
                  color: "#f1f5f9",
                  letterSpacing: "-.01em",
                }}
              >
                {n === "5K" ? (
                  "5K+"
                ) : (
                  <Counter target={parseInt(n)} suffix={suf} />
                )}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 9,
                  color: "#334155",
                  letterSpacing: ".14em",
                  marginTop: 6,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`fi ${loaded ? "in" : ""}`}
        style={{
          transitionDelay: ".95s",
          position: "absolute",
          bottom: 40,
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
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9,
            color: "#ffffff18",
            letterSpacing: ".18em",
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 52,
            background: "linear-gradient(#00ffe0,transparent)",
            animation: "sline 1.6s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
