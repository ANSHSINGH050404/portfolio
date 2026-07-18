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

const STORAGE_KEY = "ansh-portfolio-sound";

type SoundCtx = {
  muted: boolean;
  toggle: () => void;
  setMuted: (v: boolean) => void;
  playClick: () => void;
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

  const playClick = useCallback(() => {
    if (!hydrated) return;
    let isMuted = muted;
    try {
      isMuted = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* use state */
    }
    if (isMuted) return;
    const audio = new Audio("/click1.wav");
    audio.volume = 0.35;
    audio.play().catch(() => {});
  }, [muted, hydrated]);

  const value = useMemo(
    () => ({ muted, toggle, setMuted, playClick }),
    [muted, toggle, setMuted, playClick],
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
    };
  }
  return ctx;
}
