"use client";
import { useSound } from "../hooks/useSound";

export function SoundToggle() {
  const { muted, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      data-hover
      aria-label={muted ? "Enable sound effects" : "Disable sound effects"}
      title={muted ? "Sound effects off" : "Sound effects on"}
      className="sound-toggle"
    >
      {muted ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      )}
    </button>
  );
}
