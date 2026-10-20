"use client";
import { useEffect } from "react";

/** Global hotkey listener for ⌘K / Ctrl+K. */
export function useCommandPaletteHotkey(
  open: boolean,
  onOpenChange: (v: boolean) => void,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);
}
