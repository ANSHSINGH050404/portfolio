"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PROJECTS, SITE } from "../constants";
import { POSTS } from "../constants/posts";
import { useFocusTrap } from "../hooks/useFocusTrap";
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { muted, toggle: toggleSound } = useSound();

  useFocusTrap(overlayRef, open);

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
      {
        id: "go-blog",
        label: "Read the writing",
        hint: `${POSTS.length} posts`,
        group: "Navigate",
        keywords: "blog posts articles writing notes",
        run: () => {
          onOpenChange(false);
          window.location.href = "/blog";
        },
      },
      ...POSTS.map((post) => ({
        id: `post-${post.slug}`,
        label: post.title,
        hint: `${post.readingMinutes} min`,
        group: "Writing",
        keywords: `${post.summary} ${post.tags.join(" ")}`,
        run: () => {
          onOpenChange(false);
          window.location.href = `/blog/${post.slug}`;
        },
      })),
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

  // Reset transient state on open/close. Adjusting state during render when a
  // prop changes is the React-sanctioned alternative to a setState effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    setIndex(0);
    if (!open) setQuery("");
  }

  useEffect(() => {
    if (!open) return;
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

  // Preserve filter order while nesting each run of same-group actions in a
  // labelled group, so screen readers announce "Navigate, group, 8 items".
  const groups: { name: string; items: Action[] }[] = [];
  for (const action of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.name === action.group) last.items.push(action);
    else groups.push({ name: action.group, items: [action] });
  }

  return (
    <div
      ref={overlayRef}
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
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Search commands, projects, actions…"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded
            aria-controls="cmd-list"
            aria-autocomplete="list"
            aria-activedescendant={
              filtered[index] ? `cmd-opt-${filtered[index].id}` : undefined
            }
            aria-label="Search commands"
          />
          <kbd className="cmd-esc">ESC</kbd>
        </div>
        <div
          className="cmd-list"
          ref={listRef}
          id="cmd-list"
          role="listbox"
          aria-label="Commands"
        >
          {filtered.length === 0 && (
            <div className="cmd-empty">No matches for “{query}”</div>
          )}
          {groups.map((group) => (
            <div key={group.name} role="group" aria-label={group.name}>
              <div className="cmd-group" aria-hidden="true">
                {group.name}
              </div>
              {group.items.map((a) => {
                const i = filtered.indexOf(a);
                return (
                  <div
                    id={`cmd-opt-${a.id}`}
                    key={a.id}
                    role="option"
                    aria-selected={i === index}
                    data-cmd-idx={i}
                    className={`cmd-item ${i === index ? "active" : ""}`}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => a.run()}
                  >
                    <span>{a.label}</span>
                    {a.hint && <span className="cmd-hint">{a.hint}</span>}
                  </div>
                );
              })}
            </div>
          ))}
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
