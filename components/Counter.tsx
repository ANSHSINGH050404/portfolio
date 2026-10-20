"use client";
import { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";

export function Counter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useReveal<HTMLSpanElement>();

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    let raf = 0;
    const step = () => {
      current += Math.ceil(target / 35);
      if (current >= target) {
        setVal(target);
        return;
      }
      setVal(current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Without this the previous animation keeps running when `target`
    // changes (fallback -> live stats) and overwrites the newer value with a
    // stale one — the hero rendered 104 while the API returned 122.
    return () => cancelAnimationFrame(raf);
  }, [visible, target]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
