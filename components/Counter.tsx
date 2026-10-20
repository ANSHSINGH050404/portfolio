"use client";
import { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";

/**
 * Counts up to `target` when it scrolls into view.
 *
 * The number is rendered twice on purpose:
 *
 * - A visually hidden copy carries the real value as real text. It is what a
 *   crawler, a screen reader and anyone selecting the page text sees.
 * - The counting digits are rendered from a data attribute through CSS
 *   `content`, so the animation's intermediate values never reach text
 *   extraction. Without that, a crawler reads "0" for every stat, because
 *   the animation starts from zero.
 *
 * Only the number is duplicated — the label that follows it stays in the
 * normal flow, so the text reads "185 original repos" exactly once. The
 * trailing space in the hidden copy is what separates the two when the
 * text is concatenated.
 */
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
      {/* The trailing space separates the number from the label that follows
          it in the DOM, so extracted text reads "185 original repos". */}
      <span className="sr-only">
        {target}
        {suffix}{" "}
      </span>
      <span className="counter-digits" data-count={val} aria-hidden="true" />
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}
