"use client";
import { useEffect, useState } from "react";

interface LoaderProps {
  onDone: () => void;
}

export function Loader({ onDone }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1600;
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 0.3) setPhase(0);
      else if (t < 0.65) setPhase(1);
      else setPhase(2);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 700);
        }, 200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const labels = ["INITIALIZING", "LOADING SYSTEMS", "ENTERING"];

  return (
    <div className={`loader-screen ${done ? "done" : ""}`} aria-hidden={done}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, #00ffe008 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.28em",
          color: "var(--cyan)",
          marginBottom: 28,
          opacity: 0.8,
        }}
      >
        {labels[phase]}
        <span style={{ animation: "blink 0.8s step-end infinite" }}>_</span>
      </div>

      <div
        className="glitch"
        data-text="ANSH.DEV"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 12vw, 96px)",
          letterSpacing: "0.12em",
          color: "#fff",
          lineHeight: 1,
          marginBottom: 40,
        }}
      >
        ANSH.DEV
      </div>

      <div
        style={{
          width: "min(280px, 70vw)",
          height: 2,
          background: "#ffffff0a",
          position: "relative",
          overflow: "hidden",
          borderRadius: 99,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--cyan), var(--magenta))",
            boxShadow: "0 0 20px #00ffe060",
            transition: "width 0.05s linear",
            borderRadius: 99,
          }}
        />
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "#475569",
          marginTop: 16,
          letterSpacing: "0.2em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(progress).padStart(3, "0")}%
      </div>
    </div>
  );
}
