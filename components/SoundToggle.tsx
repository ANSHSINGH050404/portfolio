"use client";
import { useSound } from "../hooks/useSound";

export function SoundToggle() {
  const { muted, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      data-hover
      aria-label={muted ? "Unmute click sounds" : "Mute click sounds"}
      title={muted ? "Sound off" : "Sound on"}
      className="sound-toggle"
    >
      {muted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      )}
      <span className="hide-mob" style={{ fontSize: 10, letterSpacing: "0.08em" }}>
        {muted ? "Off" : "Sound"}
      </span>
    </button>
  );
}
