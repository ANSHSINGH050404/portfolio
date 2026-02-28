"use client";
import { useState, useEffect } from "react";

// Components
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";
import { GitHubStreak } from "../components/GitHubStreak";
import { ResumeSection } from "../components/ResumeSection";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import dynamic from "next/dynamic";
import { MagneticCursor } from "../components/MagneticCursor";

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

// Hooks
import { useReveal } from "../hooks/useReveal";
import { useGlobalClickSound } from "../hooks/useGlobalClickSound";

export default function Portfolio() {
  useGlobalClickSound();
  const [loaded, setLoaded] = useState(false);
  const [skillsRef, skillsVisible] = useReveal<HTMLDivElement>(0.05);
  const [projRef, projVisible] = useReveal<HTMLDivElement>(0.05);
  const [ctaRef, ctaVisible] = useReveal<HTMLDivElement>(0.1);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);

  return (
    <div style={{ cursor: "none" }}>
      <ParticleCanvas />
      <MagneticCursor />
      <BackgroundEffect />

      <Navbar />
      <Hero loaded={loaded} />
      <Marquee />
      <Projects visible={projVisible} projRef={projRef} />
      <Skills visible={skillsVisible} skillsRef={skillsRef} />
      <GitHubStreak />
      <ResumeSection />
      <Contact visible={ctaVisible} ctaRef={ctaRef} />
      <Footer />
    </div>
  );
}
