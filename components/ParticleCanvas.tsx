"use client";
import { useEffect, useRef } from "react";

/**
 * Lightweight ambient particles. Key perf choices:
 * - fewer dots, no O(n²) link graph
 * - half-res canvas (CSS-scaled up)
 * - pauses while scrolling / tab hidden
 */
export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip heavy canvas on touch / reduced motion
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) {
      canvas.style.display = "none";
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const SCALE = 0.5; // half-res → ~4× fewer pixels
    let w = 0;
    let h = 0;
    let running = true;
    let scrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let raf = 0;

    const resize = () => {
      w = Math.floor(window.innerWidth * SCALE);
      h = Math.floor(window.innerHeight * SCALE);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };
    resize();

    const N = 28;
    const colors = ["#00ffe066", "#ff2d7833", "#a78bfa44"];
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.5,
      color: colors[(Math.random() * 3) | 0],
    }));

    const onResize = () => resize();
    const onScroll = () => {
      scrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrolling = false;
      }, 150);
    };
    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running && !raf) raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    let last = 0;
    const TARGET_MS = 1000 / 30; // cap ~30fps — plenty for ambient bg

    const draw = (now: number) => {
      raf = 0;
      if (!running) return;

      // Skip frames while user is scrolling (biggest jank source)
      if (scrolling) {
        raf = requestAnimationFrame(draw);
        return;
      }

      if (now - last < TARGET_MS) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < N; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        contain: "strict",
        willChange: "contents",
      }}
    />
  );
}
