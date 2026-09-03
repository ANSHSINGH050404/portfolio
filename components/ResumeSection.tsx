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
      <div ref={resumeRef} className={`fi ${resumeVisible ? "in" : ""}`}>
        <ResumeDownload />
      </div>
    </section>
  );
}
