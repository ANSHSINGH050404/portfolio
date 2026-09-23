"use client";
import { useEffect } from "react";
import { useSound } from "./useSound";

export function useGlobalClickSound() {
  const { playClick } = useSound();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Elements with their own dedicated cue skip the generic droplet
      if (target.closest("[data-sfx-cue]")) return;
      if (target.closest("a, button, [data-hover]")) {
        playClick();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [playClick]);
}
