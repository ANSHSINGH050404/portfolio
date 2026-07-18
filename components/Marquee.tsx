"use client";
import { STACK_PILLS } from "../constants";

const LINE = [...STACK_PILLS, ...STACK_PILLS].join("  ·  ");

export function Marquee() {
  return (
    <div
      style={{
        borderTop: "1px solid #ffffff08",
        borderBottom: "1px solid #ffffff08",
        padding: "14px 0",
        background: "#020205",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      <div className="mq-wrap">
        <div
          className="mq-inner"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            letterSpacing: "0.2em",
            color: "#ffffff12",
          }}
        >
          <span style={{ paddingRight: 48 }}>{LINE}</span>
          <span style={{ paddingRight: 48 }}>{LINE}</span>
        </div>
      </div>
    </div>
  );
}
