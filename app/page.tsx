"use client";
import { useState, useCallback, useSyncExternalStore, lazy, Suspense } from "react";
import dynamic from "next/dynamic";

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { StatsBand } from "../components/StatsBand";
import { Marquee } from "../components/Marquee";
import { Bento } from "../components/Bento";
import { Principles } from "../components/Principles";
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";
import { Experience } from "../components/Experience";
import { GitHubStreak } from "../components/GitHubStreak";
import { PRWall } from "../components/PRWall";
import { ResumeSection } from "../components/ResumeSection";
import { Contact } from "../components/Contact";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";
import { Loader } from "../components/Loader";
import { ScrollProgress } from "../components/ScrollProgress";
import { ToastProvider } from "../components/Toast";
import { useCommandPaletteHotkey } from "../hooks/useCommandPaletteHotkey";
import { useTerminalHotkey } from "../hooks/useTerminalHotkey";
import { SoundProvider } from "../hooks/useSound";

/**
 * The terminal and the command palette are only ever opened on demand, so
 * their code should not sit in the initial bundle.
 *
 * `next/dynamic` does not help here: in a client component it still emits a
 * preload for the chunk, so the code is fetched during the initial load
 * anyway. `React.lazy` defers the import until the component first renders,
 * which for these two is the first time they are opened.
 *
 * The hotkey hooks live in separate modules for the same reason — importing
 * them from the component files would pull those components straight back
 * into the initial chunk.
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

import { useReveal } from "../hooks/useReveal";
import { useGlobalClickSound } from "../hooks/useGlobalClickSound";

const INTRO_KEY = "ansh-intro-seen";

// Read outside render so the server snapshot (always false) matches the
// prerendered HTML, while a returning visitor skips the intro right after
// hydration — no flash of a second-and-a-half loader.
const subscribeIntro = () => () => {};
const readIntro = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
};
const serverIntro = () => false;

function PortfolioInner() {
  useGlobalClickSound();
  const [booted, setBooted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [skillsRef, skillsVisible] = useReveal<HTMLDivElement>(0.05);
  const [projRef, projVisible] = useReveal<HTMLDivElement>(0.05);
  const [ctaRef, ctaVisible] = useReveal<HTMLDivElement>(0.1);

  useCommandPaletteHotkey(cmdOpen, setCmdOpen);
  useTerminalHotkey(termOpen, setTermOpen);

  // Returning visitors have already sat through the intro once — skip it.
  const introSeen = useSyncExternalStore(subscribeIntro, readIntro, serverIntro);

  const onLoaderDone = useCallback(() => {
    setBooted(true);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Non-fatal — the intro will simply play again next time.
    }
    requestAnimationFrame(() => {
      setTimeout(() => setLoaded(true), 80);
    });
  }, []);

  const showLoader = !introSeen && !booted;
  const reveal = introSeen || loaded;

  return (
    <>
      {/* Without JavaScript the loader never dismisses and every `.fi` reveal
          stays at opacity 0, so the page renders as a black screen. These
          rules undo both, so the content is readable and crawlable. */}
      <noscript>
        <style>{`
          .loader-screen { display: none !important; }
          .fi { opacity: 1 !important; transform: none !important; }
          .slot-title { opacity: 1 !important; }
        `}</style>
      </noscript>

      {showLoader && <Loader onDone={onLoaderDone} />}

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
          <Hero loaded={reveal} />
          <StatsBand />
          <Marquee />
          <Bento />
          <Principles />
          <Projects visible={projVisible} projRef={projRef} />
          <Skills visible={skillsVisible} skillsRef={skillsRef} />
          <Experience />
          <GitHubStreak />
          <PRWall />
          <FAQ />
          <ResumeSection />
          <Contact visible={ctaVisible} ctaRef={ctaRef} />
        </main>

        <Footer />

        {/* Desktop hint chip */}
        <div className="hotkey-hint hide-mob" aria-hidden>
          <kbd>⌘K</kbd> commands · <kbd>`</kbd> terminal
        </div>
      </div>

      {/* Rendered only once opened, so the chunk loads on first use rather
          than during the initial page load. */}
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
    <SoundProvider>
      <ToastProvider>
        <PortfolioInner />
      </ToastProvider>
    </SoundProvider>
  );
}
