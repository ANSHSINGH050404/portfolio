"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../constants";

const LINKS = [
  { label: "[01. work]", href: "#projects" },
  { label: "[02. skills]", href: "#skills" },
  { label: "[03. path]", href: "#experience" },
  { label: "[04. contact]", href: "#contact" },
];

interface NavbarProps {
  onOpenCommand?: () => void;
}

export function Navbar({ onOpenCommand }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
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

  // Move focus into the menu when it opens so keyboard users land on a link.
  useEffect(() => {
    if (!menuOpen) return;
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
  }, [menuOpen]);

  // Escape closes the menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setMenuOpen(false);
      menuBtnRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <nav ref={navRef} className="site-nav" aria-label="Primary">
        <a href="#about" className="nav-brand">
          <span style={{ color: "var(--accent)" }}>&gt;</span> {SITE.host} <span style={{ fontSize: 11, color: "var(--dim)" }}>[v2.4]</span>
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
            Contact
          </a>

          <button
            ref={menuBtnRef}
            type="button"
            className="nav-menu-btn show-mob"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
        // Keeps every link out of the tab order while the menu is closed —
        // aria-hidden alone still leaves them focusable.
        inert={!menuOpen}
      >
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
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
          <a
            href={`mailto:${SITE.email}`}
            onClick={() => setMenuOpen(false)}
            className="btn-primary"
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
