"use client";
import { useState, useEffect } from "react";
import { SITE, PROJECTS } from "../constants";
import { useToast } from "./Toast";

type CommandTab = "overview" | "agent-workflow" | "projects" | "stack" | "contact";

export function HeroTerminal() {
  const [activeTab, setActiveTab] = useState<CommandTab>("overview");
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const toast = useToast();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      toast("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Copy failed");
    }
  };

  useEffect(() => {
    // Quick typing simulation for the command header
    let current = 0;
    const target = `ansh --${activeTab}`;
    setDisplayedText("");
    const timer = setInterval(() => {
      current++;
      setDisplayedText(target.slice(0, current));
      if (current >= target.length) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [activeTab]);

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        lineHeight: 1.6,
        boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
        width: "100%",
        maxWidth: "680px",
      }}
    >
      {/* Terminal Title Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          background: "rgba(0,0,0,0.25)",
          borderBottom: "1px solid var(--hairline)",
          fontSize: "11px",
          color: "var(--muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f", display: "inline-block" }} />
          <span style={{ marginLeft: 8, color: "var(--fg)", fontWeight: 500 }}>
            ansh@dev: ~/portfolio
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "11px" }}>
          <span style={{ color: "var(--status-green)" }}>●</span>
          <span>AGENT: READY</span>
        </div>
      </div>

      {/* Interactive Command Tabs Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: "10px 14px",
          background: "rgba(0,0,0,0.12)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <span style={{ color: "var(--dim)", marginRight: 4, display: "flex", alignItems: "center" }}>
          $
        </span>
        {(
          [
            { id: "overview", label: "--overview" },
            { id: "agent-workflow", label: "--agent-workflow" },
            { id: "projects", label: "--projects" },
            { id: "stack", label: "--stack" },
            { id: "contact", label: "--contact" },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: "inherit",
                fontSize: "12px",
                padding: "3px 9px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid",
                borderColor: isActive ? "var(--accent)" : "var(--hairline)",
                background: isActive ? "var(--accent-soft)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--muted)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              [{tab.label}]
            </button>
          );
        })}
        <button
          type="button"
          onClick={handleCopyEmail}
          style={{
            fontFamily: "inherit",
            fontSize: "12px",
            padding: "3px 9px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--hairline)",
            background: copied ? "rgba(34, 197, 94, 0.15)" : "transparent",
            color: copied ? "var(--status-green)" : "var(--status-amber)",
            cursor: "pointer",
            marginLeft: "auto",
            transition: "all 0.15s ease",
          }}
          title="Click to copy email address"
        >
          {copied ? "[✓ email copied]" : "[--copy-email]"}
        </button>
      </div>

      {/* Terminal Viewport */}
      <div
        style={{
          padding: "16px 18px",
          minHeight: "260px",
          color: "var(--fg)",
          overflowX: "auto",
        }}
      >
        <div style={{ color: "var(--muted)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "var(--accent)" }}>&gt;</span>
          <span>{displayedText}</span>
          <span style={{ display: "inline-block", width: 7, height: 14, background: "var(--accent)", animation: "pdot 1.2s infinite" }} />
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: "var(--status-green)", fontWeight: 600 }}>
              [SYSTEM_STATUS: ONLINE]
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>identity: </span>
              <span style={{ color: "#fff", fontWeight: 500 }}>{SITE.name}</span>
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>role:     </span>
              <span style={{ color: "var(--accent)" }}>Full-Stack &amp; Agentic AI Engineer</span>
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>focus:    </span>
              <span>Autonomous Agents · Multi-Step LLMs · MCP Protocols · Robust Backends</span>
            </div>
            <div>
              <span style={{ color: "var(--dim)" }}>location: </span>
              <span>{SITE.location}</span>
            </div>
            <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-sm)" }}>
              <span style={{ color: "var(--status-green)" }}>● </span>
              <span style={{ color: "var(--muted)" }}>Currently open to full-time roles &amp; high-impact AI engineering contracts.</span>
            </div>
          </div>
        )}

        {/* Tab 2: Agent Workflow */}
        {activeTab === "agent-workflow" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "12px" }}>
            <div style={{ color: "var(--accent)", fontWeight: 600 }}>
              {"// ARCHITECTURE: AGENTIC AI EXECUTION PIPELINE"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              <div>
                <span style={{ color: "var(--status-blue)", fontWeight: 600 }}>[01. INTENT]   </span>
                <span>User Goal &amp; Task Decomposition via Reasoning LLMs</span>
              </div>
              <div>
                <span style={{ color: "var(--status-amber)", fontWeight: 600 }}>[02. PLANNER]  </span>
                <span>Dynamic Plan Tree, Tool Registry, State Graphs</span>
              </div>
              <div>
                <span style={{ color: "var(--status-green)", fontWeight: 600 }}>[03. TOOLS]    </span>
                <span>MCP Servers, API Sandbox, Code Execution, Vector Search</span>
              </div>
              <div>
                <span style={{ color: "#a855f7", fontWeight: 600 }}>[04. REFLECT]  </span>
                <span>Self-Correction Loop, Static Analysis &amp; Schema Validation</span>
              </div>
              <div>
                <span style={{ color: "#fdfcfc", fontWeight: 600 }}>[05. SHIP]     </span>
                <span>Production Artifact Deployment &amp; Telemetry Stream</span>
              </div>
            </div>
            <div style={{ marginTop: 8, color: "var(--dim)", fontSize: "11px" }}>
              * Tested with LangGraph, Model Context Protocol (MCP), and custom ReAct loops.
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === "projects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>
              {`// FEATURED DEPLOYMENTS (${PROJECTS.length} active)`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PROJECTS.slice(0, 3).map((p, idx) => (
                <div
                  key={p.id}
                  style={{
                    padding: "8px 10px",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  <div>
                    <span style={{ color: "var(--dim)", marginRight: 6 }}>[{idx + 1}]</span>
                    <span style={{ fontWeight: 600, color: "#fff" }}>{p.title}</span>
                    <span style={{ color: "var(--muted)", marginLeft: 8, fontSize: "12px" }}>
                      — {p.subtitle}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--accent)", textDecoration: "none", fontSize: "12px" }}
                    >
                      [open ↗]
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#projects"
              style={{ color: "var(--dim)", textDecoration: "none", fontSize: "12px", marginTop: 4 }}
            >
              &gt;&gt; View complete case studies in Projects section below ↓
            </a>
          </div>
        )}

        {/* Tab 4: Stack */}
        {activeTab === "stack" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "12px" }}>
            <div style={{ color: "var(--status-green)", fontWeight: 600 }}>
              {"// TECHNICAL SPECIFICATIONS"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "6px 12px", marginTop: 4 }}>
              <span style={{ color: "var(--dim)" }}>Languages:</span>
              <span style={{ color: "#fff" }}>TypeScript, Python, JavaScript, SQL, HTML/CSS</span>

              <span style={{ color: "var(--dim)" }}>AI &amp; Agents:</span>
              <span style={{ color: "#fff" }}>LangChain, LangGraph, LlamaIndex, MCP, OpenAI / Gemini APIs</span>

              <span style={{ color: "var(--dim)" }}>Frameworks:</span>
              <span style={{ color: "#fff" }}>Next.js 15, React, Node.js, FastAPI, Express, TailwindCSS</span>

              <span style={{ color: "var(--dim)" }}>Data &amp; Cloud:</span>
              <span style={{ color: "#fff" }}>PostgreSQL, Supabase, Redis, Docker, Vercel, Git</span>
            </div>
          </div>
        )}

        {/* Tab 5: Contact */}
        {activeTab === "contact" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "12px" }}>
            <div style={{ color: "var(--status-amber)", fontWeight: 600 }}>
              {"// DIRECT TELEMETRY CHANNELS"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "6px 12px", marginTop: 4 }}>
              <span style={{ color: "var(--dim)" }}>Email:</span>
              <a href={`mailto:${SITE.email}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                {SITE.email}
              </a>

              <span style={{ color: "var(--dim)" }}>GitHub:</span>
              <a href={SITE.socials.github} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                github.com/{SITE.name.replace(/\s+/g, "")} ↗
              </a>

              <span style={{ color: "var(--dim)" }}>X / Twitter:</span>
              <a href={SITE.socials.twitter} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                x.com/anshsinghapa ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Footer Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 14px",
          background: "rgba(0,0,0,0.3)",
          borderTop: "1px solid var(--hairline)",
          fontSize: "11px",
          color: "var(--dim)",
        }}
      >
        <span>Click tabs above or press [`] for full interactive shell</span>
        <span style={{ color: "var(--muted)" }}>UTF-8 · zsh</span>
      </div>
    </div>
  );
}
