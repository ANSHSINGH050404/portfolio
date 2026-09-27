"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
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

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readMuted(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Absent means "never chosen" — default to muted so sound is opt-in.
    return stored !== "0";
  } catch {
    return true;
  }
}

function getSnapshot(): boolean {
  return readMuted();
}

/** Matches the first-visit default so hydration doesn't flip the flag. */
function getServerSnapshot(): boolean {
  return true;
}

function persistMuted(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

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

export function SoundProvider({ children }: { children: ReactNode }) {
  const muted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    attachUnlockListeners();
  }, []);

  useEffect(() => {
    setEnabled(!muted);
  }, [muted]);

  const setMuted = useCallback((value: boolean) => {
    persistMuted(value);
    emit();
  }, []);

  const toggle = useCallback(() => {
    persistMuted(!readMuted());
    emit();
  }, []);

  const playClick = useCallback(() => {
    if (muted) return;
    play("droplet", { volume: CLICK_VOLUME });
  }, [muted]);

  const playTick = useCallback(() => {
    if (muted) return;
    play("tick", { volume: TICK_VOLUME });
  }, [muted]);

  const playSfx = useCallback(
    (name: SoundName, opts?: { volume?: number }) => {
      if (muted) return;
      playSound(name, opts);
    },
    [muted],
  );

  const playCue = useCallback(
    (cue: string, opts?: { volume?: number }) => {
      if (muted) return;
      rawPlayCue(cue, opts);
    },
    [muted],
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
