"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../constants";
import { SoundToggle } from "./SoundToggle";
import { TimeOnEarth } from "./TimeOnEarth";

const LINKS = [
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Path", href: "#experience" },
  { label: "GitHub", href: "#github" },
  { label: "PRs", href: "#prs" },
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
        <a href="#about" className="nav-brand">
          Ansh
        </a>

        <div className="nav-links hide-mob">
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

        <div className="nav-actions">
          <div className="nav-utilities hide-mob">
            <TimeOnEarth audible />
            <span className="nav-divider" aria-hidden="true" />
            <SoundToggle />
            <button
              type="button"
              onClick={onOpenCommand}
              className="cmd-trigger"
              aria-label="Open command palette"
              title="Command palette (Ctrl/⌘ K)"
            >
              <kbd>⌘K</kbd>
            </button>
          </div>

          <a href={`mailto:${SITE.email}`} className="hide-mob btn-primary nav-cta">
            Get in touch
          </a>

          <button
            type="button"
            className="nav-menu-btn show-mob"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-menu-nav" aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`mobile-menu-link ${active === l.href.slice(1) ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${0.04 * i}s` : "0s" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mobile-menu-footer">
          <TimeOnEarth />
          <a
            href={`mailto:${SITE.email}`}
            onClick={() => setMenuOpen(false)}
            className="btn-primary"
          >
            Get in touch
          </a>
        </div>
      </div>
    </>
  );
}
