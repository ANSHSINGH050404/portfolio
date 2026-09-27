"use client";
import { useEffect, useState } from "react";

interface LoaderProps {
  onDone: () => void;
}

export function Loader({ onDone }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 500);
        }, 120);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className={`loader-screen ${done ? "done" : ""}`}
      role="status"
      aria-label="Loading portfolio"
      aria-hidden={done}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: "var(--fg)",
          lineHeight: 1,
          marginBottom: 28,
        }}
      >
        Ansh
      </div>

      <div
        style={{
          width: "min(180px, 50vw)",
          height: 2,
          background: "var(--hairline)",
          position: "relative",
          overflow: "hidden",
          borderRadius: 99,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--fg)",
            transition: "width 0.05s linear",
            borderRadius: 99,
          }}
        />
      </div>
    </div>
  );
}
