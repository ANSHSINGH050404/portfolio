"use client";

export function Navbar() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Resume-feb@11.pdf";
    link.download = "Ansh-Kumar-Singh-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        padding: "0 clamp(24px,5vw,80px)",
        height: 66,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ffffff07",
        backdropFilter: "blur(28px)",
        background: "#05050890",
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 20,
          letterSpacing: ".14em",
          color: "#fff",
        }}
      >
        ANSH<span style={{ color: "#00ffe0" }}>.</span>DEV
      </div>
      <div style={{ display: "flex", gap: 32 }} className="hide-mob">
        {["About", "Projects", "Skills", "GitHub", "Contact"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nl">
            {l}
          </a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          onClick={handleDownload}
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            color: "#f59e0b",
            border: "1px solid #f59e0b35",
            padding: "7px 14px",
            background: "transparent",
            letterSpacing: ".06em",
            cursor: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "background .2s,box-shadow .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f59e0b12";
            e.currentTarget.style.boxShadow = "0 0 20px #f59e0b25";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
          className="hide-mob"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          RESUME
        </button>
        <a
          href="mailto:anshsinghapa@gmail.com"
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11,
            color: "#00ffe0",
            border: "1px solid #00ffe035",
            padding: "8px 18px",
            textDecoration: "none",
            letterSpacing: ".06em",
            transition: "background .2s,box-shadow .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#00ffe012";
            e.currentTarget.style.boxShadow = "0 0 24px #00ffe025";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          HIRE ME →
        </a>
      </div>
    </nav>
  );
}
