"use client";
import { GITHUB_USER } from "../constants";

interface ContactProps {
  visible: boolean;
  ctaRef: React.RefObject<HTMLDivElement | null>;
}

export function Contact({ visible, ctaRef }: ContactProps) {
  return (
    <section
      id="contact"
      style={{
        padding: "80px clamp(24px,5vw,80px) 160px",
        position: "relative",
        zIndex: 10,
        textAlign: "center",
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
          background: "linear-gradient(90deg,transparent,#ffffff05,transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 700,
          background: "radial-gradient(circle,#00ffe007 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "clamp(24px,5vw,80px)",
          width: 36,
          height: 36,
          borderTop: "1px solid #00ffe030",
          borderLeft: "1px solid #00ffe030",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: "clamp(24px,5vw,80px)",
          width: 36,
          height: 36,
          borderBottom: "1px solid #ff2d7830",
          borderRight: "1px solid #ff2d7830",
        }}
      />
      <div ref={ctaRef}>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            color: "#00ffe0",
            letterSpacing: ".18em",
            marginBottom: 24,
          }}
        >
          {"// 005 — LET'S BUILD SOMETHING"}
        </div>
        <h2
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: ".1s",
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(60px,11vw,130px)",
            lineHeight: 0.92,
            letterSpacing: "-.01em",
            marginBottom: 36,
          }}
        >
          <span style={{ color: "#fff" }}>GOT AN</span>
          <br />
          <span
            style={{ WebkitTextStroke: "1px #ffffff20", color: "transparent" }}
          >
            IDEA?
          </span>
        </h2>
        <p
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: ".2s",
            fontSize: 15,
            color: "#334155",
            maxWidth: 400,
            margin: "0 auto 52px",
            lineHeight: 1.9,
            fontWeight: 300,
          }}
        >
          Open to freelance projects, full-time roles, and interesting AI
          collaborations. Let&apos;s make something exceptional.
        </p>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: ".3s",
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="mailto:anshsinghapa@gmail.com"
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              letterSpacing: ".07em",
              color: "#050508",
              background: "#00ffe0",
              padding: "16px 40px",
              textDecoration: "none",
              fontWeight: 700,
              transition: "box-shadow .25s,transform .15s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 60px #00ffe065";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            SEND A MESSAGE
          </a>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              letterSpacing: ".07em",
              color: "#e2e8f0",
              border: "1px solid #ffffff18",
              padding: "16px 40px",
              textDecoration: "none",
              transition: "border-color .25s,color .25s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ff2d7870";
              e.currentTarget.style.color = "#ff2d78";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ffffff18";
              e.currentTarget.style.color = "#e2e8f0";
            }}
          >
            GITHUB ↗
          </a>
        </div>
      </div>
    </section>
  );
}
