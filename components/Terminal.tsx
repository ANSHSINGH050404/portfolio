"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { PROJECTS, SITE, STACK_PILLS } from "../constants";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useSound } from "../hooks/useSound";

type Line = { type: "in" | "out" | "err" | "sys"; text: string };

const WELCOME: Line[] = [
  { type: "sys", text: "ansh.dev terminal v1.0 — type `help` to begin" },
  { type: "sys", text: "hint: open anytime with backtick `  or  ⌘K → Open terminal" },
];

function downloadResume() {
  const link = document.createElement("a");
  link.href = SITE.resumePath;
  link.download = SITE.resumeFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

export function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { muted, toggle: toggleSound } = useSound();

  useFocusTrap(overlayRef, open);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines, open]);

  const push = useCallback((...more: Line[]) => {
    setLines((prev) => [...prev, ...more]);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      setHistory((h) => [cmd, ...h].slice(0, 40));
      setHistIdx(-1);
      push({ type: "in", text: `guest@ansh.dev:~$ ${cmd}` });

      const [base, ...args] = cmd.split(/\s+/);
      const name = base.toLowerCase();

      switch (name) {
        case "help":
        case "?":
          push(
            { type: "out", text: "Available commands:" },
            { type: "out", text: "  help          Show this list" },
            { type: "out", text: "  whoami        Who I am" },
            { type: "out", text: "  about         Short bio" },
            { type: "out", text: "  skills        Tech stack" },
            { type: "out", text: "  projects      List projects" },
            { type: "out", text: "  open <id>     Open project (01, 02, 03)" },
            { type: "out", text: "  contact       Email + socials" },
            { type: "out", text: "  hire          Get hire-ready links" },
            { type: "out", text: "  resume        Download CV" },
            { type: "out", text: "  email         Copy email to clipboard" },
            { type: "out", text: "  github        Open GitHub" },
            { type: "out", text: "  sound         Toggle click sounds" },
            { type: "out", text: "  clear         Clear screen" },
            { type: "out", text: "  matrix        ??" },
            { type: "out", text: "  exit / close  Close terminal" },
          );
          break;
        case "whoami":
          push({
            type: "out",
            text: `${SITE.name} — Full-Stack & Agentic AI Engineer · ${SITE.location}`,
          });
          break;
        case "about":
          push(
            {
              type: "out",
              text: "Full-stack and agentic AI engineer building production AI products.",
            },
            {
              type: "out",
              text: "I ship scalable APIs, multi-step LLM workflows, and end-to-end apps.",
            },
          );
          break;
        case "skills":
        case "stack":
          push({ type: "out", text: STACK_PILLS.join(" · ") });
          break;
        case "projects":
        case "ls":
          PROJECTS.forEach((p) => {
            push({
              type: "out",
              text: `  [${p.id}] ${p.title} — ${p.subtitle}  (${p.year})`,
            });
          });
          push({ type: "sys", text: "Tip: open 01   or   open pathforge" });
          break;
        case "open": {
          const key = (args[0] ?? "").toLowerCase();
          const p = PROJECTS.find(
            (x) =>
              x.id === key ||
              x.title.toLowerCase() === key ||
              x.title.toLowerCase().includes(key),
          );
          if (!p) {
            push({
              type: "err",
              text: `Unknown project “${args[0] ?? ""}”. Try: projects`,
            });
          } else {
            push({ type: "out", text: `Opening ${p.title}…` });
            window.open(p.link, "_blank", "noopener,noreferrer");
          }
          break;
        }
        case "contact":
        case "hire":
          push(
            { type: "out", text: `email    ${SITE.email}` },
            { type: "out", text: `github   ${SITE.socials.github}` },
            { type: "out", text: `linkedin ${SITE.socials.linkedin}` },
            { type: "out", text: `location ${SITE.location}` },
            { type: "sys", text: "Status: OPEN TO WORK" },
          );
          break;
        case "resume":
        case "cv":
          downloadResume();
          push({ type: "out", text: "Resume download started." });
          break;
        case "email":
        case "copy":
          navigator.clipboard
            .writeText(SITE.email)
            .then(() => push({ type: "out", text: `Copied ${SITE.email}` }))
            .catch(() => push({ type: "out", text: SITE.email }));
          break;
        case "github":
          window.open(SITE.socials.github, "_blank", "noopener,noreferrer");
          push({ type: "out", text: "Opening GitHub…" });
          break;
        case "sound":
          toggleSound();
          push({
            type: "out",
            text: muted ? "Sound unmuted." : "Sound muted.",
          });
          break;
        case "clear":
        case "cls":
          setLines([]);
          break;
        case "matrix":
          push(
            {
              type: "out",
              text: "01001000 01101001 01110010 01100101 00100000 01101101 01100101",
            },
            { type: "sys", text: "Wake up, Neo… the stack is Next.js." },
          );
          break;
        case "sudo":
          push({ type: "err", text: "Nice try. Permission denied. (with love)" });
          break;
        case "exit":
        case "close":
        case "quit":
          onClose();
          break;
        default:
          push({
            type: "err",
            text: `command not found: ${name}. Type \`help\`.`,
          });
      }
    },
    [push, muted, toggleSound, onClose],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = input;
    setInput("");
    run(v);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput("");
      } else {
        const next = histIdx - 1;
        setHistIdx(next);
        setInput(history[next] ?? "");
      }
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="term-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="term-window">
        <div className="term-titlebar">
          <div className="term-dots">
            <button
              type="button"
              className="term-dot red"
              aria-label="Close"
              onClick={onClose}
            />
            <span className="term-dot yellow" />
            <span className="term-dot green" />
          </div>
          <span className="term-title">guest@ansh.dev — zsh</span>
          <button type="button" className="term-close-btn" onClick={onClose}>
            ESC
          </button>
        </div>
        <div
          className="term-body"
          onClick={() => inputRef.current?.focus()}
          // Command output is generated after focus lands in the input, so it
          // needs a live region for screen readers to hear the reply.
          aria-live="polite"
          aria-relevant="additions text"
        >
          {lines.map((l, i) => (
            <div key={i} className={`term-line term-${l.type}`}>
              {l.text}
            </div>
          ))}
          <form onSubmit={onSubmit} className="term-prompt">
            <span className="term-ps1">guest@ansh.dev:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="term-input"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

/** Backtick opens terminal when not typing in an input */
export function useTerminalHotkey(open: boolean, setOpen: (v: boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing =
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.isContentEditable;
      if (typing) return;
      if (e.key === "`" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
}
