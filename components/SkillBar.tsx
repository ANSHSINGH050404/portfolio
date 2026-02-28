"use client";
import { useState, useEffect } from "react";

interface SkillBarProps {
  name: string;
  pct: number;
  color: string;
  delay: number;
  visible: boolean;
}

export function SkillBar({ name, pct, color, delay, visible }: SkillBarProps) {
  const [w, setW] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setW(pct);
      let current = 0;
      const step = () => {
        current += 2;
        if (current >= pct) {
          setDisplayPct(pct);
          return;
        }
        setDisplayPct(current);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, pct, delay]);

  return (
    <div style={{ marginBottom: 26 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".08em",
            color: "#94a3b8",
            textTransform: "uppercase",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 10,
            color,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {displayPct}%
        </span>
      </div>
      <div
        style={{
          height: 1,
          background: "#ffffff08",
          borderRadius: 99,
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${w}%`,
            background: `linear-gradient(90deg,${color},${color}80)`,
            borderRadius: 99,
            transition: "width 1.3s cubic-bezier(.4,0,.2,1)",
            boxShadow: `0 0 12px ${color}80`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -3,
              top: "50%",
              transform: "translateY(-50%)",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 14px ${color}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
