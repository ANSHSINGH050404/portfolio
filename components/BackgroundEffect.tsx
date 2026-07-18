"use client";

/**
 * Lightweight atmosphere only.
 * Full-viewport SVG feTurbulence was a major scroll jank source — removed.
 */
export function BackgroundEffect() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        // soft top vignette + faint grain via CSS (no SVG filter)
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, transparent 30%, #030306 100%),
          radial-gradient(circle at 20% 80%, #00ffe005 0%, transparent 40%),
          radial-gradient(circle at 80% 20%, #ff2d7805 0%, transparent 35%)
        `,
        opacity: 0.9,
        contain: "strict",
      }}
    />
  );
}
