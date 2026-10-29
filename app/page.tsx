"use client";
import { useState, lazy, Suspense } from "react";


import { Navbar } from "../components/Navbar";

import { ScrollProgress } from "../components/ScrollProgress";
import { ToastProvider } from "../components/Toast";
import { SoundToggle } from "../components/SoundToggle";
import { GitHubStreak } from "../components/GitHubStreak";
import { PRWall } from "../components/PRWall";
import { ResumeDownload } from "../components/ResumeDownload";
import { useCommandPaletteHotkey } from "../hooks/useCommandPaletteHotkey";
import { useTerminalHotkey } from "../hooks/useTerminalHotkey";
import { SITE, PROJECTS } from "../constants";

const CommandPalette = lazy(() =>
  import("../components/CommandPalette").then((mod) => ({
    default: mod.CommandPalette,
  })),
);

const Terminal = lazy(() =>
  import("../components/Terminal").then((mod) => ({ default: mod.Terminal })),
);

function PortfolioInner() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);

  useCommandPaletteHotkey(cmdOpen, setCmdOpen);
  useTerminalHotkey(termOpen, setTermOpen);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div>
        <ScrollProgress />

        <header>
          <Navbar onOpenCommand={() => setCmdOpen(true)} />
        </header>

        <main id="main">
          <div className="page-shell">
            <div className="construction-frame">
              <div className="construction-rail left" aria-hidden />
              <div className="construction-rail right" aria-hidden />
              <div className="construction-break top" aria-hidden />

              <div style={{ paddingTop: 32 }}>
                <div
                  className="avatar"
                  aria-hidden
                  style={{
                    display: "grid",
                    placeItems: "center",
                    background: "var(--bg-elevated)",
                    color: "var(--fg)",
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                  }}
                >
                  {SITE.shortName.charAt(0)}
                </div>

                <h1 className="greeting">Hello, नमस्ते</h1>

                <div className="thoughts">
                  <p>
                    I&apos;m{" "}
                    <button
                      type="button"
                      className="identity"
                      aria-label="Reveal my name"
                    >
                      {SITE.shortName.toLowerCase()}
                    </button>
                    , a full-stack &amp; agentic AI engineer driven mostly by
                    curiosity and an unreasonable attention to detail.
                  </p>
                  <p>
                    Currently shipping AI products by day, and a builder outside
                    work hours.
                  </p>
                  <p>
                    Explore my{" "}
                    <a className="playground-link" href="/playground">
                      Playground
                    </a>
                  </p>
                </div>
              </div>

              <div className="construction-break" aria-hidden />

              <section aria-labelledby="highlights-heading">
                <h2 id="highlights-heading" className="section-heading">
                  Selected Work
                </h2>
                <ul className="project-list">
                  {PROJECTS.map((p) => (
                    <li key={p.id} className="project-row">
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        data-hover
                      >
                        {p.title}
                      </a>
                      <time dateTime={p.year}>{p.year}</time>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="construction-break" aria-hidden />

              <PRWall />

              <div className="construction-break" aria-hidden />

              <GitHubStreak />

              <div className="construction-break" aria-hidden />

              <ResumeDownload />

              <footer className="site-footer">
                <span>© 2026 {SITE.shortName}</span>
                <a href="#main">Top</a>
              </footer>
            </div>
          </div>

          <div className="socials-dock" aria-label="Social links">
            <a href={SITE.socials.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={SITE.socials.twitter} target="_blank" rel="noreferrer">
              X
            </a>
            <a href={`mailto:${SITE.email}`}>Email</a>
            <SoundToggle />
          </div>

          <div className="hold-hint" aria-hidden>
            Hold to download
          </div>
        </main>

      </div>

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
