"use client";
import { useReveal } from "../hooks/useReveal";
import { ResumeDownload } from "./ResumeDownload";

export function ResumeSection() {
  const [resumeRef, resumeVisible] = useReveal<HTMLDivElement>(0.1);

  return (
    <section
      id="resume"
      style={{
        padding: "0 clamp(24px,5vw,80px) 80px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div ref={resumeRef}>
        <div
          className={`fi ${resumeVisible ? "in" : ""}`}
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            color: "#f59e0b",
            letterSpacing: ".18em",
            marginBottom: 24,
          }}
        >
          {"// 004 — CURRICULUM VITAE"}
        </div>
        <ResumeDownload />
      </div>
    </section>
  );
}
