"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../constants";
import { SoundToggle } from "./SoundToggle";

const LINKS = [
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
    const ids = ["about", ...LINKS.map((l) => l.href.slice(1))];
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

  return (
    <>
      <nav ref={navRef} className="site-nav">
        <a
          href="#about"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            textDecoration: "none",
          }}
        >
          Ansh
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

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SoundToggle />
          <button
            type="button"
            onClick={onOpenCommand}
            className="hide-mob cmd-trigger"
            aria-label="Open command palette"
            title="Command palette (Ctrl/⌘ K)"
          >
            ⌘K
          </button>
          <a
            href={`mailto:${SITE.email}`}
            className="hide-mob btn-primary"
            style={{ padding: "7px 16px", fontSize: 13 }}
          >
            Get in touch
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
                width: 18,
                height: 1.5,
                background: "var(--fg)",
                transition: "transform 0.3s var(--ease)",
                transform: menuOpen
                  ? "translateY(7.5px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "var(--fg)",
                transition: "opacity 0.3s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "var(--fg)",
                transition: "transform 0.3s var(--ease)",
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
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: active === l.href.slice(1) ? "var(--accent)" : "var(--fg)",
              textDecoration: "none",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.4s ${0.04 * i}s, transform 0.4s ${0.04 * i}s, color 0.2s`,
            }}
          >
            {l.label}
          </a>
        ))}
        <a
          href={`mailto:${SITE.email}`}
          onClick={() => setMenuOpen(false)}
          className="btn-primary"
          style={{ marginTop: 20 }}
        >
          Get in touch
        </a>
      </div>
    </>
  );
}
