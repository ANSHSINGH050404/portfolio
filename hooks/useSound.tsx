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
import {
  attachUnlockListeners,
  playCue as rawPlayCue,
  playSound,
  type SoundName,
} from "../lib/sfx";

const STORAGE_KEY = "ansh-portfolio-sound";
const CLICK_VOLUME = 0.35;
const TICK_VOLUME = 0.35;

type SoundCtx = {
  muted: boolean;
  toggle: () => void;
  setMuted: (v: boolean) => void;
  playClick: () => void;
  playTick: () => void;
  /** Play a bank sound by name (raw Web Audio engine). */
  playSfx: (name: SoundName, opts?: { volume?: number }) => void;
  /** Play a UI-intent cue ("rewind", "glitch", "select", …). */
  playCue: (cue: string, opts?: { volume?: number }) => void;
};

const SoundContext = createContext<SoundCtx | null>(null);

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

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
    attachUnlockListeners();
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
    if (readMuted()) return;
    play("droplet", { volume: CLICK_VOLUME });
  }, [hydrated]);

  const playTick = useCallback(() => {
    if (!hydrated) return;
    if (readMuted()) return;
    play("tick", { volume: TICK_VOLUME });
  }, [hydrated]);

  const playSfx = useCallback(
    (name: SoundName, opts?: { volume?: number }) => {
      if (!hydrated || readMuted()) return;
      playSound(name, opts);
    },
    [hydrated],
  );

  const playCue = useCallback(
    (cue: string, opts?: { volume?: number }) => {
      if (!hydrated || readMuted()) return;
      rawPlayCue(cue, opts);
    },
    [hydrated],
  );

  const value = useMemo(
    () => ({
      muted,
      toggle,
      setMuted,
      playClick,
      playTick,
      playSfx,
      playCue,
    }),
    [muted, toggle, setMuted, playClick, playTick, playSfx, playCue],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

const noopSfx = () => {};
const noopCue = () => {};

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return {
      muted: true,
      toggle: noopSfx,
      setMuted: noopSfx,
      playClick: noopSfx,
      playTick: noopSfx,
      playSfx: noopSfx,
      playCue: noopCue,
    };
  }
  return ctx;
}
