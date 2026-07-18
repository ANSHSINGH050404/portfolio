"use client";
import { useSound } from "./useSound";

/** @deprecated Prefer useSound().playClick — kept for compatibility */
export function useClickSound() {
  const { playClick } = useSound();
  return playClick;
}
