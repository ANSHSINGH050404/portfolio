"use client";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useSound } from "../hooks/useSound";

/**
 * Em-dash with a flashlight/spotlight dialog — click the dash and a radial
 * aperture irises open around the click point, revealing a small note.
 * Adapted from the em-dash-aperture / em-dash-ignite treatment on anoma.ly.
 */
interface FlashlightPhraseProps {
  /** The trigger text (the em-dash). */
  children: string;
  /** Dialog heading */
  title: string;
  /** Dialog body */
  note: string;
}

export function FlashlightPhrase({
  children,
  title,
  note,
}: FlashlightPhraseProps) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const noteId = useId();
  const { playCue } = useSound();

  useFocusTrap(dialogRef, open);

  const openAt = useCallback(
    (clientX?: number, clientY?: number) => {
      if (clientX !== undefined && clientY !== undefined) {
        const r = dialogRef.current?.getBoundingClientRect();
        if (r) {
          setOrigin({
            x: ((clientX - r.left) / r.width) * 100,
            y: ((clientY - r.top) / r.height) * 100,
          });
        } else {
          const t = triggerRef.current?.getBoundingClientRect();
          if (t) {
            const sx = t.left + t.width / 2;
            const sy = t.top + t.height / 2;
            // rough viewport-relative guess until dialog mounts
            setOrigin({
              x: (sx / window.innerWidth) * 100,
              y: (sy / window.innerHeight) * 100,
            });
          }
        }
      }
      setOpen(true);
      playCue("adjust", { volume: 0.7 });
    },
    [playCue],
  );

  const close = useCallback(() => {
    setOpen(false);
    playCue("collapse", { volume: 0.6 });
    triggerRef.current?.focus();
  }, [playCue]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener("keydown", onKey, true);
    // move focus into dialog
    const id = requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey, true);
      cancelAnimationFrame(id);
    };
  }, [open, close]);

  // Recompute origin once the dialog element exists
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const t = triggerRef.current?.getBoundingClientRect();
    const d = dialogRef.current.getBoundingClientRect();
    if (t) {
      setOrigin({
        x: ((t.left + t.width / 2 - d.left) / d.width) * 100,
        y: ((t.top + t.height / 2 - d.top) / d.height) * 100,
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="em-dash-trigger"
        data-hover
        data-sfx-cue
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${children} — show note about ${title}`}
        onClick={(e) => openAt(e.clientX, e.clientY)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openAt();
          }
        }}
      >
        {children}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="em-dash-scrim"
            onClick={close}
            role="presentation"
          >
            <div
              ref={dialogRef}
              className="em-dash-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={noteId}
              tabIndex={-1}
              style={
                {
                  "--origin-x": `${origin.x}%`,
                  "--origin-y": `${origin.y}%`,
                } as CSSProperties
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="em-dash-dialog-inner">
                <div className="em-dash-dialog-label">{title}</div>
                <p id={noteId} className="em-dash-dialog-note">
                  {note}
                </p>
                <button
                  type="button"
                  className="em-dash-close"
                  data-hover
                  onClick={close}
                >
                  Close
                </button>
              </div>
            </div>
            <span id={titleId} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              {title}
            </span>
          </div>,
          document.body,
        )}
    </>
  );
}
