"use client";

/** Quiet vignette. No color orbs. */
export function BackgroundEffect() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(41,151,255,0.07) 0%, transparent 55%)",
        contain: "strict",
      }}
    />
  );
}
