"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../constants";
import { SoundToggle } from "./SoundToggle";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Path", href: "#experience" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  onOpenCommand?: () => void;
}

export function Navbar({ onOpenCommand }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeRef = useRef(active);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Class toggle only — no React re-render on scroll
    let scrolled = false;
    const onScroll = () => {
      const next = window.scrollY > 40;
      if (next === scrolled) return;
      scrolled = next;
      nav.classList.toggle("nav-scrolled", next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.target.id !== activeRef.current) {
            activeRef.current = e.target.id;
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = SITE.resumePath;
    link.download = SITE.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <nav ref={navRef} className="site-nav">
        <a
          href="#about"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            letterSpacing: "0.14em",
            color: "#fff",
            textDecoration: "none",
          }}
          data-hover
        >
          ANSH<span style={{ color: "var(--cyan)" }}>.</span>DEV
        </a>

        <div style={{ display: "flex", gap: 28 }} className="hide-mob">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`nl ${active === l.href.slice(1) ? "active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <SoundToggle />
          <button
            type="button"
            onClick={onOpenCommand}
            className="hide-mob cmd-trigger"
            data-hover
            aria-label="Open command palette"
            title="Command palette (Ctrl/⌘ K)"
          >
            <span>⌘K</span>
          </button>
          <button
            onClick={handleDownload}
            className="hide-mob"
            data-hover
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--amber)",
              border: "1px solid #f59e0b35",
              padding: "7px 14px",
              background: "transparent",
              letterSpacing: "0.06em",
              cursor: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f59e0b12";
              e.currentTarget.style.boxShadow = "0 0 20px #f59e0b25";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            RESUME
          </button>
          <a
            href={`mailto:${SITE.email}`}
            className="hide-mob"
            data-hover
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--cyan)",
              border: "1px solid #00ffe035",
              padding: "8px 18px",
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00ffe012";
              e.currentTarget.style.boxShadow = "0 0 24px #00ffe025";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            HIRE ME →
          </a>

          <button
            className="show-mob"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              width: 40,
              height: 40,
              display: "none",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              zIndex: 510,
            }}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: menuOpen ? "var(--magenta)" : "var(--cyan)",
                transition: "transform 0.3s, background 0.3s",
                transform: menuOpen
                  ? "translateY(7.5px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "var(--cyan)",
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: menuOpen ? "var(--magenta)" : "var(--cyan)",
                transition: "transform 0.3s, background 0.3s",
                transform: menuOpen
                  ? "translateY(-7.5px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 42,
              letterSpacing: "0.08em",
              color: active === l.href.slice(1) ? "var(--cyan)" : "#fff",
              textDecoration: "none",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.4s ${0.05 * i}s, transform 0.4s ${0.05 * i}s, color 0.2s`,
            }}
          >
            {l.label}
          </a>
        ))}
        <a
          href={`mailto:${SITE.email}`}
          onClick={() => setMenuOpen(false)}
          className="btn-primary"
          style={{ marginTop: 20, cursor: "pointer" }}
        >
          HIRE ME →
        </a>
      </div>
    </>
  );
}
