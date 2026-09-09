"use client";

import { useEffect, useState } from "react";
import {
  formatTimeOnEarth,
  formatTimeOnEarthAria,
  getTimeOnEarth,
  type TimeOnEarthParts,
} from "../lib/timeOnEarth";
import { useSound } from "../hooks/useSound";

let lastTickAt = 0;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function TimeOnEarth({ audible = false }: { audible?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [parts, setParts] = useState<TimeOnEarthParts | null>(null);
  const { playTick } = useSound();

  useEffect(() => {
    const update = () => {
      setParts(getTimeOnEarth());
      if (!audible || reducedMotion) return;
      if (typeof document !== "undefined" && document.hidden) return;
      const now = Date.now();
      if (now - lastTickAt < 900) return;
      lastTickAt = now;
      playTick();
    };

    update();
    const interval = window.setInterval(
      update,
      reducedMotion ? 60_000 : 1_000,
    );

    return () => window.clearInterval(interval);
  }, [reducedMotion, audible, playTick]);

  if (!parts) return null;

  const ariaLabel = formatTimeOnEarthAria(parts);
  const full = formatTimeOnEarth(parts, reducedMotion ? "static" : "full");
  const compact = formatTimeOnEarth(parts, "compact");

  return (
    <div
      className="time-on-earth"
      role="timer"
      aria-live={reducedMotion ? "off" : "polite"}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <span className="time-on-earth-label" aria-hidden="true">
        on Earth
      </span>
      <span className="time-on-earth-full" aria-hidden="true">
        {full}
      </span>
      <span className="time-on-earth-compact" aria-hidden="true">
        {compact}
      </span>
    </div>
  );
}
