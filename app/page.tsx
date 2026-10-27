"use client";
import { useState, lazy, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";
import { Experience } from "../components/Experience";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ScrollProgress";
import { ToastProvider } from "../components/Toast";
import { useCommandPaletteHotkey } from "../hooks/useCommandPaletteHotkey";
import { useTerminalHotkey } from "../hooks/useTerminalHotkey";
import { useReveal } from "../hooks/useReveal";

/**
 * Terminal and Command Palette are loaded lazily on demand.
 */
const CommandPalette = lazy(() =>
  import("../components/CommandPalette").then((mod) => ({
    default: mod.CommandPalette,
  })),
);

const Terminal = lazy(() =>
  import("../components/Terminal").then((mod) => ({ default: mod.Terminal })),
);

const BackgroundEffect = dynamic(
  () =>
    import("../components/BackgroundEffect").then(
      (mod) => mod.BackgroundEffect,
    ),
  { ssr: false },
);

function PortfolioInner() {
  const [loaded, setLoaded] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [skillsRef, skillsVisible] = useReveal<HTMLDivElement>(0.05);
  const [projRef, projVisible] = useReveal<HTMLDivElement>(0.05);
  const [ctaRef, ctaVisible] = useReveal<HTMLDivElement>(0.1);

  useCommandPaletteHotkey(cmdOpen, setCmdOpen);
  useTerminalHotkey(termOpen, setTermOpen);

  useEffect(() => {
    // Instant mount with smooth entrance
    const timer = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div>
        <ScrollProgress />
        <BackgroundEffect />

        <header>
          <Navbar onOpenCommand={() => setCmdOpen(true)} />
        </header>

        <main id="main">
          <Hero loaded={loaded} />
          <Projects visible={projVisible} projRef={projRef} />
          <Skills visible={skillsVisible} skillsRef={skillsRef} />
          <Experience />
          <Contact visible={ctaVisible} ctaRef={ctaRef} />
        </main>

        <Footer />

        {/* Desktop hint chip */}
        <div className="hotkey-hint hide-mob" aria-hidden>
          <kbd>⌘K</kbd> commands · <kbd>`</kbd> terminal
        </div>
      </div>

      {/* Rendered only once opened */}
      {cmdOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            open={cmdOpen}
            onOpenChange={setCmdOpen}
            onOpenTerminal={() => setTermOpen(true)}
          />
        </Suspense>
      )}
      {termOpen && (
        <Suspense fallback={null}>
          <Terminal open={termOpen} onClose={() => setTermOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

export default function Portfolio() {
  return (
    <ToastProvider>
      <PortfolioInner />
    </ToastProvider>
  );
}
