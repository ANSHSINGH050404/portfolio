"use client";
import { STACK_PILLS } from "../constants";

const LINE = [...STACK_PILLS, ...STACK_PILLS].join("  ·  ");

export function Marquee() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
        padding: "18px 0",
        background: "var(--bg)",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      <div className="mq-wrap">
        <div
          className="mq-inner"
          style={{
            fontSize: 13,
            letterSpacing: "-0.01em",
            color: "var(--dim)",
          }}
        >
          <span style={{ paddingRight: 48 }}>{LINE}</span>
          <span style={{ paddingRight: 48 }}>{LINE}</span>
        </div>
      </div>
    </div>
  );
}
