"use client";
import { useEffect, useState } from "react";
import { ROLES, SITE } from "../constants";
import { useToast } from "./Toast";
import { HeroTerminal } from "./HeroTerminal";
import { SlideUp } from "./ui/SlideUp";
import { FadeIn } from "./ui/FadeIn";

interface HeroProps {
  loaded: boolean;
}

export function Hero({ loaded }: HeroProps) {
  const [roleIdx, setRoleIdx] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % ROLES.length);
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
      className="flex flex-col justify-center min-h-[92vh] px-[clamp(18px,4vw,56px)] pt-[100px] pb-16 relative z-10 font-mono"
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}
      >
        {/* Left Column: Developer Information */}
        <div className="flex flex-col gap-6">
          <FadeIn>
            <span className="inline-flex items-center gap-2 text-xs text-[var(--muted)] tracking-tighter bg-[var(--bg-elevated)] border border-[var(--border)] rounded-sm px-3 py-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)] animate-pulse"
              />
              OPEN TO WORK · {SITE.location.toUpperCase()}
            </span>
          </FadeIn>

          <SlideUp delay={0.1}>
            <h1 className="text-[clamp(40px,6vw,68px)] font-bold leading-[1.05] tracking-tighter text-white">
              ANSH SINGH
            </h1>
            <div
              className="text-[clamp(16px,2.2vw,22px)] text-[var(--accent)] font-medium flex items-center gap-2 mt-2"
            >
              <span>&gt;</span>
              <span>{ROLES[roleIdx]}</span>
            </div>
          </SlideUp>

          <SlideUp delay={0.2}>
            <p className="text-[var(--muted)] text-base max-w-md leading-relaxed mb-6">
              Specializing in{" "}
              <span className="text-white font-medium">Agentic AI systems</span>{" "}
              and full-stack infrastructure. I build multi-step reasoning workflows,
              production APIs, and autonomous agents that deliver reliable results.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <a href="#projects" className="px-5 py-2 text-sm bg-[var(--accent)] text-black rounded hover:opacity-90 transition-opacity">
                [ See Work ↗ ]
              </a>
              <button onClick={handleDownload} className="px-5 py-2 text-sm border border-[var(--border)] text-[var(--muted)] rounded hover:border-[var(--accent)] transition-colors" type="button">
                [ Download CV ↓ ]
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(SITE.email);
                    toast("Email copied to clipboard");
                  } catch {
                    toast("Copy failed");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--border)] rounded text-[var(--muted)] text-[13px] hover:border-[var(--accent)] transition-colors"
              >
                <span className="text-[var(--dim)]">$</span>
                <span>email --copy</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-8 pt-4 border-t border-[var(--hairline)] text-xs text-[var(--dim)]">
              <div>
                <span className="text-white font-semibold">3+</span> PROJECTS SHIPPED
              </div>
              <div>·</div>
              <div>
                <span className="text-white font-semibold">50+</span> OSS CONTRIBS
              </div>
              <div>·</div>
              <div>
                <span className="text-white font-semibold">5K+</span> DAILY USERS
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Right Column: Terminal */}
        <div className="w-full flex justify-center">
          <FadeIn delay={0.4}>
            <HeroTerminal />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
