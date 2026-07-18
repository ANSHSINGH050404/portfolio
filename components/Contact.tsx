"use client";
import { SITE } from "../constants";
import { useToast } from "./Toast";

interface ContactProps {
  visible: boolean;
  ctaRef: React.RefObject<HTMLDivElement | null>;
}

export function Contact({ visible, ctaRef }: ContactProps) {
  const toast = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      toast("EMAIL COPIED TO CLIPBOARD ✓");
    } catch {
      toast(SITE.email);
    }
  };

  return (
    <section
      id="contact"
      className="section-pad"
      style={{
        paddingBottom: 160,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div className="section-line" />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 700,
          background: "radial-gradient(circle, #00ffe008 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "clamp(20px,5vw,80px)",
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
          right: "clamp(20px,5vw,80px)",
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
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--cyan)",
            letterSpacing: "0.18em",
            marginBottom: 24,
          }}
        >
          {"// 005 — LET'S BUILD SOMETHING"}
        </div>

        <h2
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: "0.1s",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(60px, 11vw, 130px)",
            lineHeight: 0.92,
            letterSpacing: "-0.01em",
            marginBottom: 36,
          }}
        >
          <span style={{ color: "#fff" }}>GOT AN</span>
          <br />
          <span className="outline">IDEA?</span>
        </h2>

        <p
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: "0.2s",
            fontSize: 16,
            color: "var(--dim)",
            maxWidth: 420,
            margin: "0 auto 20px",
            lineHeight: 1.9,
            fontWeight: 300,
          }}
        >
          Open to freelance projects, full-time roles, and interesting AI
          collaborations. Let&apos;s make something exceptional.
        </p>

        {/* Click-to-copy email */}
        <button
          className={`fi ${visible ? "in" : ""}`}
          data-hover
          onClick={copyEmail}
          style={{
            transitionDelay: "0.25s",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--cyan)",
            background: "transparent",
            border: "1px dashed #00ffe030",
            padding: "12px 24px",
            letterSpacing: "0.08em",
            cursor: "none",
            marginBottom: 40,
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#00ffe070";
            e.currentTarget.style.background = "#00ffe008";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#00ffe030";
            e.currentTarget.style.background = "transparent";
          }}
        >
          {SITE.email} · CLICK TO COPY
        </button>

        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: "0.3s",
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={`mailto:${SITE.email}`}
            className="btn-primary"
            data-hover
          >
            SEND A MESSAGE
          </a>
          <a
            href={SITE.socials.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            data-hover
          >
            GITHUB ↗
          </a>
          <a
            href={SITE.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            data-hover
            style={{ borderColor: "#a78bfa40", color: "var(--violet)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#a78bfa80";
              e.currentTarget.style.color = "var(--violet)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#a78bfa40";
              e.currentTarget.style.color = "var(--violet)";
            }}
          >
            LINKEDIN ↗
          </a>
        </div>
      </div>
    </section>
  );
}
