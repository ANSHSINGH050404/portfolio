"use client";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #ffffff06",
        padding: "22px clamp(24px,5vw,80px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        zIndex: 10,
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 16,
          letterSpacing: ".14em",
          color: "#ffffff15",
        }}
      >
        ANSH<span style={{ color: "#00ffe025" }}>.</span>DEV
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
          color: "#ffffff12",
          letterSpacing: ".1em",
        }}
      >
        DESIGNED & BUILT FROM SCRATCH — {new Date().getFullYear()}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
          color: "#ffffff12",
          letterSpacing: ".1em",
        }}
      >
        NEXT.JS · TAILWIND · ♥
      </div>
    </footer>
  );
}
