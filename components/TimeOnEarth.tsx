"use client";

import { useEffect, useState } from "react";
import {
  formatTimeOnEarth,
  formatTimeOnEarthAria,
  getTimeOnEarth,
  type TimeOnEarthParts,
} from "../lib/timeOnEarth";

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

export function TimeOnEarth() {
  const reducedMotion = useReducedMotion();
  const [parts, setParts] = useState<TimeOnEarthParts | null>(null);

  useEffect(() => {
    const update = () => setParts(getTimeOnEarth());

    update();
    const interval = window.setInterval(
      update,
      reducedMotion ? 60_000 : 1_000,
    );

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

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
