"use client";
import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { GITHUB_USER } from "../constants";

export function ResumeDownload() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.1);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const link = document.createElement("a");
    link.href = "/Resume-feb@11.pdf";
    link.download = "Ansh-Kumar-Singh-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div
      ref={ref}
      className={`fi ${visible ? "in" : ""}`}
      style={{ transitionDelay: ".2s" }}
    >
      <div
        data-hover
        style={{
          background: "#06060c",
          border: "1px solid #ffffff07",
          padding: "36px 40px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg,#f59e0b,transparent)",
          }}
        />
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              color: "#f59e0b",
              letterSpacing: ".18em",
              marginBottom: 12,
              opacity: 0.8,
            }}
          >
            {"// 004 — CURRICULUM VITAE"}
          </div>
          <h3
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 32,
              color: "#f1f5f9",
              letterSpacing: ".04em",
              marginBottom: 6,
            }}
          >
            ANSH KUMAR SINGH
          </h3>
          <p
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11,
              color: "#475569",
              letterSpacing: ".06em",
            }}
          >
            Full-Stack Developer & Agentic AI Engineer
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* View online */}
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11,
              color: "#e2e8f0",
              border: "1px solid #ffffff18",
              padding: "12px 24px",
              textDecoration: "none",
              letterSpacing: ".06em",
              transition: "border-color .2s",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffffff40")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ffffff18")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2 2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            VIEW GITHUB
          </a>
          {/* Download */}
          <button
            onClick={handleDownload}
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11,
              color: "#050508",
              background: downloading ? "#f59e0b" : "#f59e0b",
              border: "none",
              padding: "12px 28px",
              letterSpacing: ".06em",
              cursor: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 700,
              transition: "box-shadow .25s,transform .15s",
              boxShadow: downloading ? "0 0 40px #f59e0b80" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 40px #f59e0b60";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (!downloading) {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }
            }}
          >
            {downloading ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                DOWNLOADING...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                DOWNLOAD CV
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
