"use client";

export function Marquee() {
  return (
    <div
      style={{
        borderTop: "1px solid #ffffff07",
        borderBottom: "1px solid #ffffff07",
        padding: "13px 0",
        background: "#030306",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      <div className="mq-wrap">
        <div
          className="mq-inner"
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 12,
            letterSpacing: ".22em",
            color: "#ffffff12",
          }}
        >
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <span key={i}>
                &nbsp;&nbsp;&nbsp;NEXT.JS · TYPESCRIPT · LANGCHAIN · NODE.JS ·
                REACT · POSTGRESQL · REDIS · DOCKER · AWS · GRAPHQL · FASTAPI
                · PINECONE &nbsp;&nbsp;
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
