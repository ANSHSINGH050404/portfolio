"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Bento } from "../components/Bento";
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";
import { Experience } from "../components/Experience";
import { GitHubStreak } from "../components/GitHubStreak";
import { ResumeSection } from "../components/ResumeSection";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Loader } from "../components/Loader";
import { ScrollProgress } from "../components/ScrollProgress";
import { ToastProvider } from "../components/Toast";
import { MagneticCursor } from "../components/MagneticCursor";
import {
  CommandPalette,
  useCommandPaletteHotkey,
} from "../components/CommandPalette";
import { Terminal, useTerminalHotkey } from "../components/Terminal";
import { SoundProvider } from "../hooks/useSound";

const ParticleCanvas = dynamic(
  () =>
    import("../components/ParticleCanvas").then((mod) => mod.ParticleCanvas),
  { ssr: false },
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

  const onLoaderDone = useCallback(() => {
    setBooted(true);
    requestAnimationFrame(() => {
      setTimeout(() => setLoaded(true), 80);
    });
  }, []);

  return (
    <>
      {!booted && <Loader onDone={onLoaderDone} />}

      <div className="custom-cursor-root" style={{ cursor: "none" }}>
        <ScrollProgress />
        <ParticleCanvas />
        <MagneticCursor />
        <BackgroundEffect />

        <Navbar onOpenCommand={() => setCmdOpen(true)} />
        <Hero loaded={loaded} />
        <Marquee />
        <Bento />
        <Projects visible={projVisible} projRef={projRef} />
        <Skills visible={skillsVisible} skillsRef={skillsRef} />
        <Experience />
        <GitHubStreak />
        <ResumeSection />
        <Contact visible={ctaVisible} ctaRef={ctaRef} />
        <Footer />

        {/* Desktop hint chip */}
        <div className="hotkey-hint hide-mob" aria-hidden>
          <kbd>⌘K</kbd> commands · <kbd>`</kbd> terminal
        </div>
      </div>

      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onOpenTerminal={() => setTermOpen(true)}
      />
      <Terminal open={termOpen} onClose={() => setTermOpen(false)} />
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
