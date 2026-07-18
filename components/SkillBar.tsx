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
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#94a3b8",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 11,
            color,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {displayPct}%
        </span>
      </div>
      <div
        style={{
          height: 2,
          background: "#ffffff08",
          borderRadius: 99,
          position: "relative",
          overflow: "visible",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${w}%`,
            background: `linear-gradient(90deg, ${color}, ${color}90)`,
            borderRadius: 99,
            transition: "width 1.3s cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow: `0 0 16px ${color}70`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 16px ${color}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
