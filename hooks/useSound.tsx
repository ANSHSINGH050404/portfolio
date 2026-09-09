"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { play, setEnabled } from "cuelume";

const STORAGE_KEY = "ansh-portfolio-sound";
const CLICK_VOLUME = 0.35;
const TICK_VOLUME = 0.35;

type SoundCtx = {
  muted: boolean;
  toggle: () => void;
  setMuted: (v: boolean) => void;
  playClick: () => void;
  playTick: () => void;
};

const SoundContext = createContext<SoundCtx | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setMutedState(true);
      else if (stored === "0") setMutedState(false);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setMuted = useCallback((v: boolean) => {
    setMutedState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setEnabled(!muted);
  }, [muted, hydrated]);

  const playClick = useCallback(() => {
    if (!hydrated) return;
    let isMuted = muted;
    try {
      isMuted = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* use state */
    }
    if (isMuted) return;
    play("droplet", { volume: CLICK_VOLUME });
  }, [muted, hydrated]);

  const playTick = useCallback(() => {
    if (!hydrated) return;
    let isMuted = muted;
    try {
      isMuted = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* use state */
    }
    if (isMuted) return;
    play("tick", { volume: TICK_VOLUME });
  }, [muted, hydrated]);

  const value = useMemo(
    () => ({ muted, toggle, setMuted, playClick, playTick }),
    [muted, toggle, setMuted, playClick, playTick],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return {
      muted: true,
      toggle: () => {},
      setMuted: () => {},
      playClick: () => {},
      playTick: () => {},
    };
  }
  return ctx;
}
