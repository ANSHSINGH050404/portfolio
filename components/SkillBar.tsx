"use client";
import { useState, useEffect } from "react";

interface SkillBarProps {
  name: string;
  pct: number;
  color: string;
  delay: number;
  visible: boolean;
}

export function SkillBar({ name, pct, delay, visible }: SkillBarProps) {
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(t);
  }, [visible, pct, delay]);

  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 14,
            letterSpacing: "-0.01em",
            color: "var(--fg)",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 13,
            color: "var(--dim)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 2,
          background: "var(--hairline)",
          borderRadius: 99,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${w}%`,
            background: "var(--fg)",
            borderRadius: 99,
            transition: "width 1s var(--ease)",
          }}
        />
      </div>
    </div>
  );
}
