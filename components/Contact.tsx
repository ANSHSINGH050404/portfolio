"use client";
import { track } from "@databuddy/sdk";
import { SITE } from "../constants";
import { useToast } from "./Toast";

interface ContactProps {
  visible: boolean;
  ctaRef: React.RefObject<HTMLDivElement | null>;
}

export function Contact({ visible, ctaRef }: ContactProps) {
  const toast = useToast();

  const copyEmail = async () => {
    track("email_copied", { location: "contact" });
    try {
      await navigator.clipboard.writeText(SITE.email);
      toast("Email copied");
    } catch {
      toast(SITE.email);
    }
  };

  return (
    <section
      id="contact"
      className="section-pad"
      style={{
        paddingBottom: 140,
        textAlign: "center",
      }}
    >
      <div className="section-line" />

      <div ref={ctaRef}>
        <div
          className={`fi ${visible ? "in" : ""} section-label`}
          style={{ marginBottom: 16 }}
        >
          Let&apos;s work
        </div>

        <h2
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: "0.08s",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.045em",
            marginBottom: 20,
            color: "var(--fg)",
          }}
        >
          Got an idea?
        </h2>

        <p
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: "0.16s",
            fontSize: 19,
            color: "var(--muted)",
            maxWidth: 420,
            margin: "0 auto 28px",
            lineHeight: 1.42,
            letterSpacing: "-0.022em",
          }}
        >
          Freelance, full-time, or a sharp AI collaboration. Short emails welcome.
        </p>

        <button
          className={`fi ${visible ? "in" : ""}`}
          type="button"
          onClick={copyEmail}
          aria-label={`Copy ${SITE.email} to clipboard`}
          style={{
            transitionDelay: "0.2s",
            fontSize: 15,
            color: "var(--accent)",
            background: "transparent",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-pill)",
            padding: "10px 20px",
            letterSpacing: "-0.01em",
            cursor: "pointer",
            marginBottom: 32,
          }}
        >
          {SITE.email}
        </button>

        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{
            transitionDelay: "0.24s",
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={`mailto:${SITE.email}`}
            className="btn-primary"
            onClick={() => track("contact_initiated", { method: "email" })}
          >
            Send a message
          </a>
          <a
            href={SITE.socials.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            onClick={() => track("contact_initiated", { method: "github" })}
          >
            GitHub
          </a>
          <a
            href={SITE.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            onClick={() => track("contact_initiated", { method: "linkedin" })}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
