"use client";
import { useReveal } from "../hooks/useReveal";
import { ResumeDownload } from "./ResumeDownload";

export function ResumeSection() {
  const [resumeRef, resumeVisible] = useReveal<HTMLDivElement>(0.1);

  return (
    <section
      id="resume"
      style={{
        padding: "0 clamp(20px,5vw,80px) 80px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div ref={resumeRef}>
        <div
          className={`fi ${resumeVisible ? "in" : ""}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--amber)",
            letterSpacing: "0.18em",
            marginBottom: 24,
          }}
        >
          {"// RESUME"}
        </div>
        <ResumeDownload />
      </div>
    </section>
  );
}
