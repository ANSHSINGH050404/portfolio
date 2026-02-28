"use client";
import { useEffect } from "react";
import { useClickSound } from "./useClickSound";

export function useGlobalClickSound() {
  const playClick = useClickSound();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-hover]")) {
        playClick();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [playClick]);
}
