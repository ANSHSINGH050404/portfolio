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
    const step = () => {
      current += Math.ceil(target / 35);
      if (current >= target) {
        setVal(target);
        return;
      }
      setVal(current);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
