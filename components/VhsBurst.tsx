"use client";
import { useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";

/**
 * Short VHS static/tear burst on a canvas, fired when `trigger` flips true.
 * Adapted from the vhs-rewind-interference canvases on anoma.ly.
 * Runs entirely imperatively (no setState) to satisfy react-hooks rules.
 */
interface VhsBurstProps {
  trigger: boolean;
  durationMs?: number;
}

export function VhsBurst({ trigger, durationMs = 520 }: VhsBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);
  const { playCue } = useSound();

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    firedRef.current = true;
    playCue("glitch", { volume: 0.55 });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * 0.5));
      canvas.height = Math.max(1, Math.floor(rect.height * 0.5));
    };
    resize();

    const finish = () => {
      running = false;
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.opacity = "0";
    };

    const draw = (now: number) => {
      if (!running) return;
      const t = (now - start) / durationMs;

      if (t >= 1) {
        finish();
        return;
      }

      // envelope: quick in, jittery hold, fade out
      const env =
        t < 0.12 ? t / 0.12 : t > 0.7 ? Math.max(0, (1 - t) / 0.3) : 1;
      canvas.style.opacity = String(env);

      const w = canvas.width;
      const h = canvas.height;

      const img = ctx.createImageData(w, h);
      const d = img.data;
      const density = 0.14 + env * 0.22;
      for (let i = 0; i < d.length; i += 4) {
        if (Math.random() < density) {
          const v = 180 + Math.random() * 75;
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
          d[i + 3] = Math.floor((0.25 + Math.random() * 0.55) * env * 255);
        }
      }
      ctx.putImageData(img, 0, 0);

      // horizontal tear bands
      const bands = 2 + Math.floor(Math.random() * 4);
      for (let b = 0; b < bands; b++) {
        const by = Math.floor(Math.random() * h);
        const bh = 1 + Math.floor(Math.random() * Math.min(6, h - by));
        const shift = Math.floor((Math.random() - 0.5) * 24);
        try {
          const slice = ctx.getImageData(0, by, w, bh);
          ctx.putImageData(slice, shift, by);
        } catch {
          /* skip band */
        }
        ctx.fillStyle = `rgba(41, 151, 255, ${0.08 * env})`;
        ctx.fillRect(0, by, w, bh);
      }

      if (document.visibilityState !== "visible") {
        raf = requestAnimationFrame(draw);
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    const onVis = () => {
      if (document.visibilityState !== "visible") {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running && canvas.style.opacity !== "0") {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [trigger, durationMs, playCue]);

  return (
    <canvas
      ref={canvasRef}
      className="vhs-burst"
      style={{ opacity: 0 }}
      aria-hidden="true"
    />
  );
}
