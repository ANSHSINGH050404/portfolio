"use client";
import { useEffect, useRef } from "react";

/**
 * Canvas smoke rising from the hero name, with pointer-driven heat.
 * Mount inside a positioned wrapper; listens for pointer heat via the
 * custom property `--pointer-x` / `--heat` set by SlotTitle's parent,
 * and tracks pointer directly on its offsetParent.
 */

interface HeadlineSmokeProps {
  enabled: boolean;
}

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
};

export function HeadlineSmoke({ enabled }: HeadlineSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let heat = 0; // 0..1 pointer heat
    let targetHeat = 0;
    let pointerX = 0.5;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      // half-res buffer for perf, CSS stretches
      canvas.width = Math.floor(w * 0.5);
      canvas.height = Math.floor(h * 0.5);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = e.clientY - rect.top;
      if (x < -0.1 || x > 1.1 || y < -20 || y > rect.height + 40) {
        targetHeat = 0;
        return;
      }
      pointerX = Math.max(0, Math.min(1, x));
      targetHeat = 1;
      parent.style.setProperty("--pointer-x", String(pointerX));
    };
    const onLeave = () => {
      targetHeat = 0;
    };

    parent.addEventListener("pointermove", onMove, { passive: true });
    parent.addEventListener("pointerleave", onLeave, { passive: true });
    parent.addEventListener("pointercancel", onLeave, { passive: true });

    const particles: P[] = [];
    let last = performance.now();
    let spawnAcc = 0;
    let raf2 = 0;
    let inView = true;

    const spawn = () => {
      const baseX = pointerX * w;
      const spread = 18 + heat * 46;
      particles.push({
        x: baseX + (Math.random() - 0.5) * spread,
        y: h * 0.72 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.35 + Math.random() * 0.55 + heat * 0.5),
        life: 0,
        maxLife: 1400 + Math.random() * 1400,
        r: 4 + Math.random() * 7 + heat * 5,
      });
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(48, now - last);
      last = now;

      if (!running || !inView) return;

      heat += (targetHeat - heat) * 0.08;

      // ambient emission once enabled; heat boosts rate
      if (enabledRef.current) {
        spawnAcc += dt * (0.012 + heat * 0.05);
        while (spawnAcc >= 1) {
          spawnAcc -= 1;
          if (particles.length < 90) spawn();
        }
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life / p.maxLife;
        p.x += p.vx * (dt / 16) + Math.sin((p.life + i * 40) * 0.004) * 0.25;
        p.y += p.vy * (dt / 16);
        p.vy *= 0.995;

        const alpha = (1 - t) * (0.1 + heat * 0.16) * Math.min(1, t * 6);
        const radius = p.r * (1 + t * 1.8);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        g.addColorStop(0, `rgba(180, 190, 205, ${alpha})`);
        g.addColorStop(0.55, `rgba(120, 130, 150, ${alpha * 0.45})`);
        g.addColorStop(1, "rgba(41, 151, 255, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        last = performance.now();
        cancelAnimationFrame(raf2);
        raf2 = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf2);
        raf2 = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && running && !raf && !raf2) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );
    io.observe(parent);

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      parent.removeEventListener("pointercancel", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="headline-smoke"
      aria-hidden="true"
    />
  );
}
