"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSound } from "../hooks/useSound";

/**
 * Slot-machine SVG/HTML title — reels of glyphs with a motion-blur crossfade,
 * adapted from the odometer title on anoma.ly/notes/opencode-reloaded.
 * Click a letter to re-spin it; double-click the name to replay.
 */

const EXTRAS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&*+=?";

function poolFor(ch: string): string[] {
  if (ch === " ") return [" "];
  const out = [ch];
  const seed = ch.charCodeAt(0);
  for (let i = 0; out.length < 12 && i < 40; i++) {
    const g = EXTRAS[(seed * 7 + i * 13 + (i * i) * 3) % EXTRAS.length];
    if (!out.includes(g)) out.push(g);
  }
  return out;
}

/**
 * The reel has to be tall enough to cover the whole scroll distance.
 *
 * `spinCell` scrolls `turns * pool.length` rows plus the offset needed to
 * land on the target glyph. The original strip held exactly one pool (12
 * rows) while the animation scrolled up to ~107 rows, so it ran off the end
 * of its own content and the title rendered blank once the intro finished.
 *
 * The strip is periodic (the pool repeated), so the strip can be reset to any
 * equivalent offset without the rendered content changing.
 */
const SPIN_TURNS_MAX = 8;
const REEL_REPEATS = SPIN_TURNS_MAX + 3;

type Cell = {
  pool: string[];
  /** The full reel text: the pool repeated, one glyph per line. */
  reel: string;
  pos: number;
  from: number;
  to: number;
  startAt: number;
  duration: number;
  spinning: boolean;
};

/** The reel text for a pool: the pool repeated so the scroll never ends. */
function reelFor(pool: string[]): string {
  const line = pool.join("\n");
  return Array.from({ length: REEL_REPEATS }, () => line).join("\n");
}

const INITIAL_MS = 1250;
const CLICK_MS = 700;
const EASE = (t: number) => 1 - Math.pow(1 - t, 4); // easeOutQuart

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface SlotTitleProps {
  loaded: boolean;
}

export function SlotTitle({ loaded }: SlotTitleProps) {
  const words = useMemo(() => ["Ansh", "Singh"], []);
  const letters = useMemo(
    () => words.flatMap((w, wi) => w.split("").map((ch) => ({ ch, wi, key: `${wi}-${ch}-${w.indexOf(ch)}` }))),
    [words],
  );
  // unique keys per position
  const keys = useMemo(() => {
    const out: string[] = [];
    words.forEach((w, wi) => w.split("").forEach((_, li) => out.push(`${wi}:${li}`)));
    return out;
  }, [words]);

  const { playCue } = useSound();
  const [reduced] = useState(prefersReducedMotion);

  const cellRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stripRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const blurStripRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sharpRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const blurRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cellsRef = useRef<Cell[]>([]);
  const cellHRef = useRef(0);
  const rafRef = useRef(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build initial cells once
  if (cellsRef.current.length !== keys.length) {
    cellsRef.current = keys.map((_, i) => {
      const ch = letters[i]?.ch ?? " ";
      const pool = poolFor(ch);
      return {
        pool,
        reel: reelFor(pool),
        pos: 0,
        from: 0,
        to: 0,
        startAt: 0,
        duration: 0,
        spinning: false,
      };
    });
  }

  const measure = useCallback(() => {
    const el = cellRefs.current.find(Boolean);
    if (el) cellHRef.current = el.clientHeight;
  }, []);

  const applyFrame = useCallback(() => {
    const h = cellHRef.current || 1;
    for (let i = 0; i < cellsRef.current.length; i++) {
      const cell = cellsRef.current[i];
      // The reel repeats the pool, so the visible row is pos % pool length.
      const row = Math.round(cell.pos) % cell.pool.length;
      const y = `translateY(${-row * h}px)`;
      const strip = stripRefs.current[i];
      const blurStrip = blurStripRefs.current[i];
      if (strip) strip.style.transform = y;
      if (blurStrip) blurStrip.style.transform = y;
      const sharp = sharpRefs.current[i];
      const blur = blurRefs.current[i];
      if (sharp) sharp.style.opacity = "1";
      if (blur) blur.style.opacity = "0";
    }
  }, []);

  const spinCell = useCallback(
    (i: number, turns: number, durationMs: number, delayMs = 0) => {
      const cell = cellsRef.current[i];
      if (!cell) return;
      const len = cell.pool.length;
      const now = performance.now() + delayMs;
      // The reel repeats the pool, so any offset that is a multiple of the
      // pool length renders identically. Normalising the start keeps the
      // scroll inside the reel no matter how many times it is re-spun.
      const start = Math.round(cell.pos) % len;
      const mod = (((0 - start) % len) + len) % len; // land on pool[0] = target
      cell.from = start;
      cell.to = start + turns * len + mod;
      cell.startAt = now;
      cell.duration = durationMs;
      cell.spinning = true;
      if (cell.to === cell.from) cell.spinning = false;
    },
    [],
  );

  const spinAll = useCallback(
    (initial: boolean) => {
      if (reduced) return;
      measure();
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      const names = ["Ansh", "Singh"];
      let idx = 0;
      names.forEach((word, wi) => {
        word.split("").forEach((_, li) => {
          const delay = initial ? wi * 220 + li * 70 : li * 40 + wi * 120;
          const turns = initial ? 4 + ((idx * 3) % 5) : 2 + (idx % 3);
          spinCell(idx, turns, initial ? INITIAL_MS : CLICK_MS, delay);
          idx++;
        });
      });
      if (initial) playCue("rewind", { volume: 0.9 });
      else playCue("scan", { volume: 0.8 });
      settleTimerRef.current = setTimeout(
        () => playCue("ready", { volume: 0.7 }),
        initial ? INITIAL_MS + 600 : CLICK_MS + 400,
      );
    },
    [measure, playCue, reduced, spinCell],
  );

  const spinLetter = useCallback(
    (i: number) => {
      if (reduced) return;
      measure();
      spinCell(i, 2 + (i % 2), CLICK_MS, 0);
      playCue("select", { volume: 0.8 });
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(
        () => playCue("ready", { volume: 0.55 }),
        CLICK_MS + 100,
      );
    },
    [measure, playCue, reduced, spinCell],
  );

  // rAF loop
  useEffect(() => {
    if (reduced) return;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = Math.max(1, now - prev);
      prev = now;
      let anySpinning = false;

      for (let i = 0; i < cellsRef.current.length; i++) {
        const cell = cellsRef.current[i];
        if (!cell.spinning) continue;
        anySpinning = true;

        const t = (now - cell.startAt) / cell.duration;
        const h = cellHRef.current || 1;
        // The strip repeats the pool, so the visible row is pos % pool length.
        // Without this the transform scrolls past the end of the strip and
        // the title renders blank.
        const row = (p: number) => Math.round(p) % cell.pool.length;
        const y = `translateY(${-row(cell.pos) * h}px)`;
        const strip = stripRefs.current[i];
        const blurStrip = blurStripRefs.current[i];
        if (strip) strip.style.transform = y;
        if (blurStrip) blurStrip.style.transform = y;

        if (t < 0) continue; // delayed start
        if (t >= 1) {
          cell.pos = cell.to;
          cell.spinning = false;
          const doneY = `translateY(${-row(cell.pos) * h}px)`;
          if (strip) strip.style.transform = doneY;
          if (blurStrip) blurStrip.style.transform = doneY;
          const sharp = sharpRefs.current[i];
          const blur = blurRefs.current[i];
          if (sharp) sharp.style.opacity = "1";
          if (blur) blur.style.opacity = "0";
          continue;
        }

        const prevPos = cell.pos;
        cell.pos = cell.from + (cell.to - cell.from) * EASE(t);
        const vel = Math.abs(cell.pos - prevPos) / (dt / 16.67); // glyphs per frame
        const blurAmt = Math.min(1, Math.max(0, (vel - 0.35) / 2.2));

        const movingY = `translateY(${-row(cell.pos) * h}px)`;
        if (strip) strip.style.transform = movingY;
        if (blurStrip) blurStrip.style.transform = movingY;
        const sharp = sharpRefs.current[i];
        const blur = blurRefs.current[i];
        if (sharp) sharp.style.opacity = String(1 - blurAmt);
        if (blur) blur.style.opacity = String(blurAmt);
      }

      if (!anySpinning) {
        // idle: ensure crisp
        applyFrame();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, applyFrame]);

  // Kick initial spin when hero finishes loading
  useEffect(() => {
    if (!loaded || reduced) return;
    const id = setTimeout(() => spinAll(true), 150);
    return () => clearTimeout(id);
  }, [loaded, reduced, spinAll]);

  // Measure on mount/resize
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    for (const el of cellRefs.current) if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [measure, reduced]);

  const onDoubleClick = () => spinAll(false);

  if (reduced) {
    // Static, accessible rendering
    return (
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-display)",
          fontWeight: 600,
          lineHeight: 1.02,
          letterSpacing: "-0.045em",
          margin: 0,
        }}
      >
        <span style={{ display: "block", color: "var(--fg)" }}>Ansh</span>
        <span style={{ display: "block", color: "var(--muted)" }}>Singh</span>
      </h1>
    );
  }

  let idx = -1;
  return (
    <h1
      className="slot-title"
      onDoubleClick={onDoubleClick}
      style={{
        margin: 0,
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-display)",
        fontWeight: 600,
        lineHeight: 1.02,
        letterSpacing: "-0.045em",
        opacity: loaded ? 1 : 0,
        transition: "opacity 400ms var(--ease)",
      }}
    >
      {/* The real heading text. The reels below are decorative, so this is the
          only text a crawler or text extractor sees for the h1 — without it
          the page's most important heading read as 24 KB of random glyphs. */}
      <span className="sr-only">Ansh Singh</span>

      <span
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <svg width="0" height="0" aria-hidden="true">
          <defs>
            <filter id="slot-motion-blur" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="0 3.4" />
            </filter>
          </defs>
        </svg>
      </span>

      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span
            key={word}
            style={{
              display: "block",
              color: wi === 1 ? "var(--muted)" : "var(--fg)",
            }}
          >
            {word.split("").map((ch) => {
              idx += 1;
              const myIdx = idx;
              const reel = cellsRef.current[myIdx]?.reel ?? ch;
              if (ch === " ") {
                return (
                  <span key={keys[myIdx]} style={{ display: "inline-block", width: "0.3em" }}>
                    {" "}
                  </span>
                );
              }
              return (
                <span
                  key={keys[myIdx]}
                  ref={(el) => {
                    cellRefs.current[myIdx] = el;
                  }}
                  className="slot-cell"
                  role="presentation"
                  onClick={() => spinLetter(myIdx)}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    height: "1.18em",
                    verticalAlign: "top",
                    overflow: "hidden",
                    cursor: "pointer",
                    minWidth: "0.62em",
                    userSelect: "none",
                  }}
                >
                  {/* sharp layer */}
                  <span
                    ref={(el) => {
                      sharpRefs.current[myIdx] = el;
                    }}
                    style={{
                      display: "block",
                      opacity: 1,
                      willChange: "transform, opacity",
                    }}
                  >
                    <span
                      ref={(el) => {
                        stripRefs.current[myIdx] = el;
                      }}
                      className="slot-strip"
                      data-reel={reel}
                    />
                  </span>

                  {/* motion-blur layer (duplicate, offset-synced via same strip index) */}
                  <span
                    ref={(el) => {
                      blurRefs.current[myIdx] = el;
                    }}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "block",
                      opacity: 0,
                      filter: "url(#slot-motion-blur)",
                      pointerEvents: "none",
                      willChange: "opacity",
                    }}
                  >
                    <span
                      ref={(el) => {
                        blurStripRefs.current[myIdx] = el;
                      }}
                      className="slot-strip"
                      data-reel={reel}
                    />
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}