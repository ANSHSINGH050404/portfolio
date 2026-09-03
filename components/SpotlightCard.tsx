"use client";
import {
  useRef,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
  type MouseEventHandler,
} from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accent?: string;
  as?: "div" | "a" | "article";
  href?: string;
  target?: string;
  rel?: string;
  "data-hover"?: boolean;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onMouseLeave?: MouseEventHandler<HTMLElement>;
}

export function SpotlightCard({
  children,
  className = "",
  style,
  accent = "var(--accent)",
  as = "div",
  href,
  target,
  rel,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const common = {
    ref: ref as never,
    className: `spotlight ${className}`,
    style: {
      ...style,
      ["--spot" as string]: accent,
    } as CSSProperties,
    onMouseMove: onMove,
    onMouseEnter,
    onMouseLeave,
    ...rest,
  };

  if (as === "a" && href) {
    return (
      <a href={href} target={target} rel={rel} {...common}>
        {children}
      </a>
    );
  }

  return <div {...common}>{children}</div>;
}
