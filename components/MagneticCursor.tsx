"use client";
import { useEffect, useRef } from "react";

export function MagneticCursor() {
  const bigRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const big = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const animate = () => {
      big.current.x += (pos.current.x - big.current.x) * 0.1;
      big.current.y += (pos.current.y - big.current.y) * 0.1;
      if (bigRef.current) {
        bigRef.current.style.left = big.current.x + "px";
        bigRef.current.style.top = big.current.y + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + "px";
        dotRef.current.style.top = pos.current.y + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHover = target.closest("a,button,[data-hover]");
      if (bigRef.current) {
        bigRef.current.style.transform = `translate(-50%,-50%) scale(${
          isHover ? 2.8 : 1
        })`;
        bigRef.current.style.opacity = isHover ? "0.3" : "1";
        bigRef.current.style.borderColor = isHover ? "#ff2d78" : "#00ffe088";
      }
    };
    window.addEventListener("mouseover", over);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      <div
        ref={bigRef}
        style={{
          position: "fixed",
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1.5px solid #00ffe088",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 9999,
          transition:
            "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s, border-color .3s",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#00ffe0",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: "0 0 8px #00ffe0",
        }}
      />
    </>
  );
}
