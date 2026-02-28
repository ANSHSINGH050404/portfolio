"use client";
import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { GITHUB_USER } from "../constants";

export function GitHubStreak() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.1);
  const [hovered, setHovered] = useState(false);

  const streakImgUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USER}&theme=transparent&hide_border=true&stroke=00ffe020&ring=00ffe0&fire=ff2d78&currStreakLabel=00ffe0&sideLabels=475569&currStreakNum=ffffff&sideNums=ffffff&dates=334155&background=00000000`;
  const statsImgUrl = `https://github-readme-stats.vercel.app/api?username=${GITHUB_USER}&show_icons=true&theme=transparent&hide_border=true&title_color=00ffe0&icon_color=ff2d78&text_color=94a3b8&bg_color=00000000&count_private=true`;
  const langImgUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USER}&layout=compact&theme=transparent&hide_border=true&title_color=00ffe0&text_color=94a3b8&bg_color=00000000&langs_count=6`;

  return (
    <section
      id="github"
      style={{
        padding: "120px clamp(24px,5vw,80px)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg,transparent,#ffffff05,transparent)",
        }}
      />
      {/* glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse,#00ffe006 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div ref={ref} style={{ position: "relative" }}>
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ marginBottom: 52 }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: "#00ffe0",
              letterSpacing: ".18em",
              marginBottom: 16,
            }}
          >
            {"// 003 — OPEN SOURCE"}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <h2
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(48px,7vw,88px)",
                lineHeight: 0.95,
                color: "#fff",
                letterSpacing: ".02em",
              }}
            >
              GITHUB
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px #ffffff20",
                  color: "transparent",
                }}
              >
                ACTIVITY
              </span>
            </h2>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
                color: "#00ffe0",
                border: "1px solid #00ffe030",
                padding: "8px 18px",
                textDecoration: "none",
                letterSpacing: ".08em",
                transition: "background .2s,box-shadow .2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00ffe012";
                e.currentTarget.style.boxShadow = "0 0 20px #00ffe025";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              @{GITHUB_USER} ↗
            </a>
          </div>
        </div>

        {/* Streak + Stats grid */}
        <div
          className={`fi ${visible ? "in" : ""}`}
          style={{ transitionDelay: ".15s" }}
        >
          {/* Streak — full width */}
          <div
            data-hover
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: "#06060c",
              border: "1px solid #ffffff07",
              padding: "32px",
              marginBottom: 1,
              transition: "border-color .3s, transform .3s",
              transform: hovered ? "translateY(-4px)" : "none",
              borderColor: hovered ? "#00ffe030" : "#ffffff07",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg,#00ffe0,transparent)",
              }}
            />
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 9,
                color: "#00ffe0",
                letterSpacing: ".18em",
                marginBottom: 20,
                opacity: 0.7,
              }}
            >
              🔥 CONTRIBUTION STREAK
            </div>
            <img
              src={streakImgUrl}
              alt="GitHub Streak Stats"
              style={{
                width: "100%",
                maxWidth: 700,
                display: "block",
                margin: "0 auto",
                filter: "brightness(1.1)",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (
                  (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                ).style.display = "flex";
              }}
            />
            {/* fallback */}
            <div
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                gap: 60,
                padding: "20px 0",
              }}
            >
              {[
                ["🔥", "Current Streak", "Loading..."],
                ["⚡", "Total Contributions", "Loading..."],
                ["🏆", "Longest Streak", "Loading..."],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: 36,
                      color: "#00ffe0",
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 9,
                      color: "#475569",
                      letterSpacing: ".12em",
                      marginTop: 4,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats + Languages row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "#ffffff05",
            }}
            className="two-col"
          >
            {[
              { src: statsImgUrl, label: "📊 GITHUB STATS", accent: "#ff2d78" },
              { src: langImgUrl, label: "💻 TOP LANGUAGES", accent: "#7c3aed" },
            ].map(({ src, label, accent }) => (
              <div
                key={label}
                style={{
                  background: "#06060c",
                  border: "1px solid #ffffff07",
                  padding: "28px 32px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg,${accent},transparent)`,
                  }}
                />
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 9,
                    color: accent,
                    letterSpacing: ".18em",
                    marginBottom: 20,
                    opacity: 0.7,
                  }}
                >
                  {label}
                </div>
                <img
                  src={src}
                  alt={label}
                  style={{ width: "100%", display: "block", filter: "brightness(1.1)" }}
                />
              </div>
            ))}
          </div>

          {/* Contribution graph */}
          <div
            style={{
              background: "#06060c",
              border: "1px solid #ffffff07",
              borderTop: "1px solid #ffffff05",
              padding: "28px 32px",
              position: "relative",
              overflow: "hidden",
              marginTop: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg,#7c3aed,transparent)",
              }}
            />
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 9,
                color: "#7c3aed",
                letterSpacing: ".18em",
                marginBottom: 20,
                opacity: 0.7,
              }}
            >
              🗓️ CONTRIBUTION GRAPH
            </div>
            <img
              src={`https://ghchart.rshah.org/00ffe0/${GITHUB_USER}`}
              alt="GitHub Contribution Graph"
              style={{
                width: "100%",
                display: "block",
                filter: "brightness(.9) saturate(1.3)",
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
