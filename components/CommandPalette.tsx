"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PROJECTS, SITE } from "../constants";
import { useToast } from "./Toast";
import { useSound } from "../hooks/useSound";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  keywords?: string;
  run: () => void;
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTerminal: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onOpenTerminal,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { muted, toggle: toggleSound } = useSound();

  const downloadResume = useCallback(() => {
    const link = document.createElement("a");
    link.href = SITE.resumePath;
    link.download = SITE.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      toast("Resume download started");
  }, [toast]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      toast("Email copied");
    } catch {
      toast(SITE.email);
    }
  }, [toast]);

  const go = useCallback(
    (hash: string) => {
      onOpenChange(false);
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.hash = hash;
    },
    [onOpenChange],
  );

  const actions: Action[] = useMemo(
    () => [
      {
        id: "nav-about",
        label: "Go to About",
        hint: "↑",
        group: "Navigate",
        keywords: "home hero top",
        run: () => go("#about"),
      },
      {
        id: "nav-projects",
        label: "Go to Projects",
        hint: "work",
        group: "Navigate",
        keywords: "portfolio case studies",
        run: () => go("#projects"),
      },
      {
        id: "nav-skills",
        label: "Go to Skills",
        group: "Navigate",
        run: () => go("#skills"),
      },
      {
        id: "nav-experience",
        label: "Go to Experience",
        group: "Navigate",
        keywords: "path journey",
        run: () => go("#experience"),
      },
      {
        id: "nav-github",
        label: "Go to GitHub",
        group: "Navigate",
        run: () => go("#github"),
      },
      {
        id: "nav-contact",
        label: "Go to Contact",
        group: "Navigate",
        run: () => go("#contact"),
      },
      {
        id: "copy-email",
        label: "Copy email",
        hint: SITE.email,
        group: "Actions",
        keywords: "mail hire contact",
        run: () => {
          copyEmail();
          onOpenChange(false);
        },
      },
      {
        id: "download-cv",
        label: "Download resume",
        hint: "PDF",
        group: "Actions",
        keywords: "cv resume pdf",
        run: () => {
          downloadResume();
          onOpenChange(false);
        },
      },
      {
        id: "open-github",
        label: "Open GitHub profile",
        group: "Actions",
        run: () => {
          window.open(SITE.socials.github, "_blank", "noopener,noreferrer");
          onOpenChange(false);
        },
      },
      {
        id: "open-linkedin",
        label: "Open LinkedIn",
        group: "Actions",
        run: () => {
          window.open(SITE.socials.linkedin, "_blank", "noopener,noreferrer");
          onOpenChange(false);
        },
      },
      {
        id: "mailto",
        label: "Send email",
        group: "Actions",
        run: () => {
          window.location.href = `mailto:${SITE.email}`;
          onOpenChange(false);
        },
      },
      {
        id: "toggle-sound",
        label: muted ? "Unmute click sounds" : "Mute click sounds",
        hint: muted ? "off" : "on",
        group: "Actions",
        keywords: "audio volume mute sound",
        run: () => {
          toggleSound();
          toast(muted ? "SOUND ON" : "SOUND MUTED");
          onOpenChange(false);
        },
      },
      {
        id: "open-terminal",
        label: "Open terminal",
        hint: "`",
        group: "Fun",
        keywords: "cli shell easter egg console",
        run: () => {
          onOpenChange(false);
          onOpenTerminal();
        },
      },
      ...PROJECTS.map((p) => ({
        id: `proj-${p.id}`,
        label: `Open ${p.title}`,
        hint: p.subtitle,
        group: "Projects",
        keywords: `${p.stack.join(" ")} ${p.desc}`,
        run: () => {
          window.open(p.link, "_blank", "noopener,noreferrer");
          onOpenChange(false);
        },
      })),
    ],
    [
      go,
      copyEmail,
      downloadResume,
      muted,
      toggleSound,
      toast,
      onOpenChange,
      onOpenTerminal,
    ],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => {
      const hay = `${a.label} ${a.hint ?? ""} ${a.group} ${a.keywords ?? ""}`.toLowerCase();
      return hay.includes(q) || q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [actions, query]);

  useEffect(() => {
    setIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[index]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, index, onOpenChange]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-cmd-idx="${index}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [index]);

  if (!open) return null;

  let lastGroup = "";

  return (
    <div
      className="cmd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="cmd-panel">
        <div className="cmd-input-row">
          <span className="cmd-kicker" aria-hidden>
            ⌘K
          </span>
          <input
            ref={inputRef}
            className="cmd-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, projects, actions…"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmd-esc">ESC</kbd>
        </div>
        <div className="cmd-list" ref={listRef}>
          {filtered.length === 0 && (
            <div className="cmd-empty">No matches for “{query}”</div>
          )}
          {filtered.map((a, i) => {
            const showGroup = a.group !== lastGroup;
            lastGroup = a.group;
            return (
              <div key={a.id}>
                {showGroup && <div className="cmd-group">{a.group}</div>}
                <button
                  type="button"
                  data-cmd-idx={i}
                  className={`cmd-item ${i === index ? "active" : ""}`}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => a.run()}
                >
                  <span>{a.label}</span>
                  {a.hint && <span className="cmd-hint">{a.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>
        <div className="cmd-footer">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

/** Global hotkey listener for ⌘K / Ctrl+K */
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
