"use client";
import { useEffect, useRef, useState } from "react";

export function MagneticCursor() {
  const bigRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const rafRef = useRef(0);
  const active = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      const cx = current.current.x;
      const cy = current.current.y;
      const tx = target.current.x;
      const ty = target.current.y;

      current.current.x += (tx - cx) * 0.18;
      current.current.y += (ty - cy) * 0.18;

      const big = bigRef.current;
      const dot = dotRef.current;
      if (big) {
        big.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      }

      // Stop RAF when settled (no perpetual loop while idle/scrolling)
      const dx = Math.abs(tx - current.current.x);
      const dy = Math.abs(ty - current.current.y);
      if (dx > 0.1 || dy > 0.1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        active.current = false;
        rafRef.current = 0;
      }
    };

    const kick = () => {
      if (!active.current) {
        active.current = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      kick();
    };

    let hoverEl: Element | null = null;
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("a,button,[data-hover]");
      if (t === hoverEl) return;
      hoverEl = t;
      const big = bigRef.current;
      if (!big) return;
      if (t) {
        big.style.width = "72px";
        big.style.height = "72px";
        big.style.opacity = "0.35";
        big.style.borderColor = "#ff2d78";
      } else {
        big.style.width = "34px";
        big.style.height = "34px";
        big.style.opacity = "1";
        big.style.borderColor = "#00ffe088";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="magnetic-cursor" aria-hidden>
      <div
        ref={bigRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1.5px solid #00ffe088",
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "opacity 0.25s, border-color 0.25s, width 0.3s, height 0.3s",
          willChange: "transform",
          contain: "layout style",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#00ffe0",
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: "0 0 8px #00ffe0",
          willChange: "transform",
          contain: "layout style",
        }}
      />
    </div>
  );
}
