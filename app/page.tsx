"use client";
import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  {
    id: "01",
    title: "NeuralBoard",
    subtitle: "AI Collaboration Platform",
    desc: "Real-time whiteboard where teams and AI co-create. Diagrams, code, and ideas generated in milliseconds.",
    stack: ["Next.js 15", "OpenAI", "WebSockets", "Redis"],
    accent: "#00ffe0",
    year: "2024",
  },
  {
    id: "02",
    title: "ShipFast CMS",
    subtitle: "Headless Content Engine",
    desc: "Git-backed, markdown-first CMS with a stunning admin UI. Open source with 4k GitHub stars.",
    stack: ["React", "Node.js", "PostgreSQL", "S3"],
    accent: "#ff2d78",
    year: "2024",
  },
  {
    id: "03",
    title: "TradeFlow",
    subtitle: "Fintech Dashboard",
    desc: "Crypto portfolio tracker with AI-driven insights, real-time alerts, and integrated tax reporting.",
    stack: ["Next.js", "WebSockets", "Chart.js", "Prisma"],
    accent: "#7c3aed",
    year: "2023",
  },
];

const SKILLS = [
  { name: "React / Next.js", pct: 96, color: "#00ffe0" },
  { name: "Node.js / Express", pct: 91, color: "#ff2d78" },
  { name: "TypeScript", pct: 89, color: "#7c3aed" },
  { name: "PostgreSQL / Redis", pct: 84, color: "#f59e0b" },
  { name: "Docker / AWS", pct: 78, color: "#00ffe0" },
  { name: "GraphQL", pct: 80, color: "#ff2d78" },
];

const STACK_PILLS = ["Next.js","React","TypeScript","Node.js","PostgreSQL","Redis","Docker","AWS","GraphQL","Prisma","Tailwind","Figma","Vercel","Supabase"];

// ── Particle Canvas ──
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let mouse = { x: w / 2, y: h / 2 };
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    const colors = ["#00ffe088", "#ff2d7844", "#7c3aed55"];
    const N = 80;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.4,
      color: colors[Math.floor(Math.random() * 3)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,224,${(1 - d / 110) * 0.07})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        const mdx = mouse.x - particles[i].x;
        const mdy = mouse.y - particles[i].y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 150) { particles[i].vx += mdx * 0.00007; particles[i].vy += mdy * 0.00007; }
        particles[i].vx *= 0.99; particles[i].vy *= 0.99;
        particles[i].x += particles[i].vx; particles[i].y += particles[i].vy;
        if (particles[i].x < 0) particles[i].x = w;
        if (particles[i].x > w) particles[i].x = 0;
        if (particles[i].y < 0) particles[i].y = h;
        if (particles[i].y > h) particles[i].y = 0;
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].r, 0, Math.PI * 2);
        ctx.fillStyle = particles[i].color;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMouse); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ── Magnetic Cursor ──
function MagneticCursor() {
  const bigRef = useRef(null);
  const dotRef = useRef(null);
  const big = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    let raf;
    const animate = () => {
      big.current.x += (pos.current.x - big.current.x) * 0.1;
      big.current.y += (pos.current.y - big.current.y) * 0.1;
      if (bigRef.current) { bigRef.current.style.left = big.current.x + "px"; bigRef.current.style.top = big.current.y + "px"; }
      if (dotRef.current) { dotRef.current.style.left = pos.current.x + "px"; dotRef.current.style.top = pos.current.y + "px"; }
      raf = requestAnimationFrame(animate);
    };
    animate();
    const over = (e) => {
      const isHover = e.target.closest("a,button,[data-hover]");
      if (bigRef.current) {
        bigRef.current.style.transform = `translate(-50%,-50%) scale(${isHover ? 2.8 : 1})`;
        bigRef.current.style.opacity = isHover ? "0.3" : "1";
        bigRef.current.style.borderColor = isHover ? "#ff2d78" : "#00ffe088";
      }
    };
    window.addEventListener("mouseover", over);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", over); };
  }, []);
  return (
    <>
      <div ref={bigRef} style={{ position: "fixed", width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #00ffe088", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 9999, transition: "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s, border-color .3s", mixBlendMode: "difference" }} />
      <div ref={dotRef} style={{ position: "fixed", width: 5, height: 5, borderRadius: "50%", background: "#00ffe0", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 9999, boxShadow: "0 0 8px #00ffe0" }} />
    </>
  );
}

// ── useReveal ──
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── SkillBar ──
function SkillBar({ name, pct, color, delay, visible }) {
  const [w, setW] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setW(pct);
      let current = 0;
      const step = () => {
        current += 2;
        if (current >= pct) { setDisplayPct(pct); return; }
        setDisplayPct(current);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [visible, pct, delay]);
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".08em", color: "#94a3b8", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>{name}</span>
        <span style={{ fontSize: 11, color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{displayPct}%</span>
      </div>
      <div style={{ height: 1, background: "#ffffff08", borderRadius: 99, position: "relative" }}>
        <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg,${color},${color}80)`, borderRadius: 99, transition: "width 1.3s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 12px ${color}80`, position: "relative" }}>
          <div style={{ position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)", width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 14px ${color}` }} />
        </div>
      </div>
    </div>
  );
}

// ── Counter ──
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = () => {
      current += Math.ceil(target / 35);
      if (current >= target) { setVal(target); return; }
      setVal(current);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Main ──
export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [skillsRef, skillsVisible] = useReveal(0.05);
  const [projRef, projVisible] = useReveal(0.05);
  const [ctaRef, ctaVisible] = useReveal(0.1);

  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  return (
    <div style={{ background: "#050508", color: "#e2e8f0", fontFamily: "'Outfit','DM Sans',sans-serif", minHeight: "100vh", overflowX: "hidden", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Bebas+Neue&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#050508;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#00ffe0,#ff2d78);border-radius:99px;}
        ::selection{background:#00ffe025;}

        /* GLITCH */
        .glitch{position:relative;color:#fff;display:inline-block;}
        .glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;font-family:inherit;font-size:inherit;font-weight:inherit;line-height:inherit;}
        .glitch::before{color:#00ffe0;clip-path:polygon(0 0,100% 0,100% 38%,0 38%);animation:gt 4s infinite linear;}
        .glitch::after{color:#ff2d78;clip-path:polygon(0 62%,100% 62%,100% 100%,0 100%);animation:gb 4s infinite linear;}
        @keyframes gt{0%,85%,100%{transform:none;opacity:1}87%{transform:translate(-4px,2px);opacity:.8}90%{transform:translate(4px,-2px);opacity:.8}93%{transform:none;opacity:1}}
        @keyframes gb{0%,83%,100%{transform:none;opacity:1}85%{transform:translate(4px,-3px);opacity:.7}89%{transform:translate(-4px,2px);opacity:.7}92%{transform:none;opacity:1}}

        /* SCANLINE */
        .scanlines::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px);pointer-events:none;z-index:900;}

        /* NAV LINK */
        .nl{color:#475569;text-decoration:none;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:color .2s;position:relative;font-family:'JetBrains Mono',monospace;}
        .nl::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:#00ffe0;transition:width .3s;box-shadow:0 0 6px #00ffe0;}
        .nl:hover{color:#00ffe0;}
        .nl:hover::after{width:100%;}

        /* PROJECT CARD */
        .pcard{background:#06060c;border:1px solid #ffffff07;transition:border-color .3s,transform .3s,background .3s;position:relative;overflow:hidden;}
        .pcard::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 60%,#00ffe008);opacity:0;transition:opacity .4s;}
        .pcard:hover::before{opacity:1;}
        .pcard:hover{transform:translateY(-8px);border-color:#00ffe025;background:#08080f;}
        .pcard-num{font-family:'Bebas Neue',sans-serif;font-size:80px;color:#ffffff03;line-height:1;position:absolute;top:12px;right:18px;pointer-events:none;letter-spacing:.02em;transition:color .3s;}
        .pcard:hover .pcard-num{color:#ffffff07;}

        /* PILL */
        .spill{border:1px solid #ffffff0f;padding:5px 13px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#475569;transition:border-color .2s,color .2s,box-shadow .2s;font-family:'JetBrains Mono',monospace;cursor:none;}
        .spill:hover{border-color:#00ffe060;color:#00ffe0;box-shadow:0 0 12px #00ffe020;}

        /* FADE */
        .fi{opacity:0;transform:translateY(36px);transition:opacity .9s cubic-bezier(.4,0,.2,1),transform .9s cubic-bezier(.4,0,.2,1);}
        .fi.in{opacity:1;transform:none;}

        /* MARQUEE */
        .mq-wrap{overflow:hidden;white-space:nowrap;}
        .mq-inner{display:inline-block;animation:mq 20s linear infinite;}
        .mq-inner:hover{animation-play-state:paused;}
        @keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

        /* HERO TEXT REVEAL */
        .hl{overflow:hidden;}
        .hl span{display:block;transform:translateY(105%);transition:transform 1.1s cubic-bezier(.76,0,.24,1);}
        .hl span.show{transform:translateY(0);}

        /* PULSE DOT */
        @keyframes pdot{0%,100%{opacity:1;box-shadow:0 0 0 0 #00ffe040}50%{opacity:.5;box-shadow:0 0 0 6px transparent}}

        /* SCROLL LINE */
        @keyframes sline{0%{opacity:0;transform:scaleY(0);transform-origin:top}50%{opacity:1}100%{opacity:0;transform:scaleY(1);transform-origin:top}}

        /* noise overlay */
        .noise-overlay{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.35;}

        @media(max-width:768px){
          .three-col{grid-template-columns:1fr!important;}
          .two-col{grid-template-columns:1fr!important;}
          .hide-mob{display:none!important;}
          .hero-btns{flex-direction:column!important;}
        }
      `}</style>

      <ParticleCanvas />
      <MagneticCursor />

      {/* scanlines */}
      <div className="scanlines" style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }} />

      {/* SVG noise */}
      <svg className="noise-overlay" style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}>
        <filter id="nf"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#nf)" opacity="0.035" />
      </svg>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, padding: "0 clamp(24px,5vw,80px)", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ffffff07", backdropFilter: "blur(28px)", background: "#05050890" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".14em", color: "#fff" }}>
          ALEX<span style={{ color: "#00ffe0" }}>.</span>DEV
        </div>
        <div style={{ display: "flex", gap: 36 }} className="hide-mob">
          {["About", "Projects", "Skills", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nl">{l}</a>
          ))}
        </div>
        <a href="mailto:hello@alex.dev"
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#00ffe0", border: "1px solid #00ffe035", padding: "8px 18px", textDecoration: "none", letterSpacing: ".06em", transition: "background .2s,box-shadow .2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#00ffe012"; e.currentTarget.style.boxShadow = "0 0 24px #00ffe025"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
          HIRE ME →
        </a>
      </nav>

      {/* ── HERO ── */}
      <section id="about" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px clamp(24px,5vw,80px) 60px", position: "relative", zIndex: 10 }}>

        {/* side label */}
        <div className="hide-mob" style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%) rotate(90deg)", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#ffffff18", letterSpacing: ".2em" }}>
          FULL · STACK · BUILDER · 2024
        </div>

        {/* corner decorations */}
        <div style={{ position: "absolute", top: 90, left: "clamp(24px,5vw,80px)", width: 40, height: 40, borderTop: "1px solid #00ffe040", borderLeft: "1px solid #00ffe040" }} />
        <div style={{ position: "absolute", bottom: 50, right: "clamp(24px,5vw,80px)", width: 40, height: 40, borderBottom: "1px solid #ff2d7840", borderRight: "1px solid #ff2d7840" }} />

        {/* badge */}
        <div className={`fi ${loaded ? "in" : ""}`} style={{ transitionDelay: ".1s", marginBottom: 36 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#00ffe0", letterSpacing: ".12em", border: "1px solid #00ffe028", padding: "7px 16px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffe0", animation: "pdot 2s infinite" }} />
            AVAILABLE FOR PROJECTS
          </span>
        </div>

        {/* BIG NAME */}
        <div style={{ marginBottom: 32 }}>
          {["ALEX", "CARTER"].map((word, wi) => (
            <div key={word} className="hl">
              <span
                className={loaded ? "show" : ""}
                style={{
                  transitionDelay: `${wi * 0.14 + 0.2}s`,
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "clamp(72px,12vw,156px)",
                  lineHeight: 0.9,
                  letterSpacing: "-.01em",
                  display: "block",
                  color: wi === 1 ? "transparent" : "#fff",
                  WebkitTextStroke: wi === 1 ? "1px #ffffff22" : "none",
                }}
              >
                {wi === 0 ? (
                  <span className="glitch" data-text={word}>{word}</span>
                ) : word}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 60, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className={`fi ${loaded ? "in" : ""}`} style={{ transitionDelay: ".55s", maxWidth: 460 }}>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "#475569", marginBottom: 40, fontWeight: 300 }}>
              I build products at the intersection of{" "}
              <span style={{ color: "#cbd5e1", fontWeight: 500 }}>elegant interfaces</span> and{" "}
              <span style={{ color: "#cbd5e1", fontWeight: 500 }}>resilient systems</span>. From database architecture to pixel-perfect UI — I ship the whole stack.
            </p>
            <div className="hero-btns" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#projects"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: ".07em", color: "#050508", background: "#00ffe0", padding: "14px 32px", textDecoration: "none", fontWeight: 700, transition: "box-shadow .25s,transform .15s", display: "inline-block" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px #00ffe060"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                SEE MY WORK
              </a>
              <a href="#contact"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: ".07em", color: "#e2e8f0", border: "1px solid #ffffff1a", padding: "14px 32px", textDecoration: "none", transition: "border-color .25s", display: "inline-block" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#ff2d7880"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#ffffff1a"}>
                GET IN TOUCH
              </a>
            </div>
          </div>

          {/* stats */}
          <div className={`fi ${loaded ? "in" : ""}`} style={{ transitionDelay: ".7s", display: "flex", gap: 44, marginTop: 6 }}>
            {[["12", "+", "PROJECTS"], ["3", "+", "YEARS EXP"], ["∞", "", "PASSION"]].map(([n, suf, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 54, lineHeight: 1, color: "#f1f5f9", letterSpacing: "-.01em" }}>
                  {n === "∞" ? "∞" : <Counter target={parseInt(n)} suffix={suf} />}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#334155", letterSpacing: ".14em", marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div className={`fi ${loaded ? "in" : ""}`} style={{ transitionDelay: ".95s", position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#ffffff18", letterSpacing: ".18em" }}>SCROLL</span>
          <div style={{ width: 1, height: 52, background: "linear-gradient(#00ffe0,transparent)", animation: "sline 1.6s ease-in-out infinite" }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop: "1px solid #ffffff07", borderBottom: "1px solid #ffffff07", padding: "13px 0", background: "#030306", position: "relative", zIndex: 10, overflow: "hidden" }}>
        <div className="mq-wrap">
          <div className="mq-inner" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: ".22em", color: "#ffffff12" }}>
            {Array(8).fill(null).map((_, i) => (
              <span key={i}>&nbsp;&nbsp;&nbsp;NEXT.JS · TYPESCRIPT · NODE.JS · REACT · POSTGRESQL · REDIS · DOCKER · AWS · GRAPHQL · PRISMA · FIGMA &nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "120px clamp(24px,5vw,80px)", position: "relative", zIndex: 10 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#ffffff06,transparent)" }} />

        <div ref={projRef}>
          <div className={`fi ${projVisible ? "in" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#00ffe0", letterSpacing: ".18em", marginBottom: 16 }}>// 001 — SELECTED WORK</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,7vw,88px)", lineHeight: 0.95, color: "#fff", letterSpacing: ".02em" }}>
                FEATURED<br />
                <span style={{ WebkitTextStroke: "1px #ffffff20", color: "transparent" }}>PROJECTS</span>
              </h2>
            </div>
            <p style={{ maxWidth: 300, color: "#334155", fontSize: 14, lineHeight: 1.85, fontWeight: 300 }}>
              End-to-end products I've designed, architected, and shipped from zero to production.
            </p>
          </div>
        </div>

        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#ffffff05", border: "1px solid #ffffff05" }}>
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className={`pcard fi ${projVisible ? "in" : ""}`}
              style={{ transitionDelay: `${i * 0.12 + 0.2}s`, padding: "36px 32px" }}
              data-hover
            >
              <div className="pcard-num">{p.id}</div>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${p.accent},transparent)` }} />
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.accent, letterSpacing: ".18em", marginBottom: 20, opacity: 0.7 }}>{p.year}</div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: ".03em", color: "#f1f5f9", marginBottom: 6, lineHeight: 1 }}>{p.title}</h3>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 20, letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{p.subtitle}</div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
                {p.stack.map(s => (
                  <span key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.accent, background: `${p.accent}10`, border: `1px solid ${p.accent}28`, padding: "3px 10px", letterSpacing: ".06em" }}>{s}</span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: p.accent, letterSpacing: ".1em" }}>
                <div style={{ width: 28, height: 1, background: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
                VIEW PROJECT
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "120px clamp(24px,5vw,80px)", background: "#030306", position: "relative", zIndex: 10 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#ffffff05,transparent)" }} />
        {/* glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, background: "radial-gradient(ellipse,#7c3aed06 0%,transparent 70%)", pointerEvents: "none" }} />

        <div ref={skillsRef} style={{ position: "relative" }}>
          <div className={`fi ${skillsVisible ? "in" : ""}`} style={{ marginBottom: 64 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#ff2d78", letterSpacing: ".18em", marginBottom: 16 }}>// 002 — CAPABILITIES</div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,7vw,88px)", lineHeight: 0.95, color: "#fff", letterSpacing: ".02em" }}>
              SKILLS &<br />
              <span style={{ WebkitTextStroke: "1px #ffffff20", color: "transparent" }}>EXPERTISE</span>
            </h2>
          </div>

          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px 80px" }}>
            <div className={`fi ${skillsVisible ? "in" : ""}`} style={{ transitionDelay: ".2s" }}>
              {SKILLS.map((s, i) => (
                <SkillBar key={s.name} {...s} delay={i * 90 + 250} visible={skillsVisible} />
              ))}
            </div>

            <div className={`fi ${skillsVisible ? "in" : ""}`} style={{ transitionDelay: ".4s" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#334155", letterSpacing: ".18em", marginBottom: 18 }}>ALSO WORK WITH</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 52 }}>
                {STACK_PILLS.map(t => <span key={t} className="spill">{t}</span>)}
              </div>

              <div style={{ borderLeft: "1px solid #00ffe025", paddingLeft: 24 }}>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.95, fontWeight: 300, marginBottom: 28 }}>
                  I thrive in the space between{" "}
                  <span style={{ color: "#94a3b8" }}>beautiful interfaces</span> and{" "}
                  <span style={{ color: "#94a3b8" }}>resilient systems</span>. I've launched products used by thousands, contributed to open-source tools, and written about web engineering.
                </p>
                <div style={{ display: "flex", gap: 24 }}>
                  {[["GitHub", "#00ffe0"], ["Twitter", "#ff2d78"], ["LinkedIn", "#7c3aed"]].map(([name, c]) => (
                    <a key={name} href="#"
                      style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: c, textDecoration: "none", letterSpacing: ".08em", borderBottom: `1px solid ${c}35`, paddingBottom: 3, transition: "border-color .2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = c}
                      onMouseLeave={e => e.currentTarget.style.borderColor = `${c}35`}>
                      {name} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "120px clamp(24px,5vw,80px) 160px", position: "relative", zIndex: 10, textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#ffffff05,transparent)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: "radial-gradient(circle,#00ffe007 0%,transparent 70%)", pointerEvents: "none" }} />
        {/* corner decorations */}
        <div style={{ position: "absolute", top: 60, left: "clamp(24px,5vw,80px)", width: 36, height: 36, borderTop: "1px solid #00ffe030", borderLeft: "1px solid #00ffe030" }} />
        <div style={{ position: "absolute", bottom: 80, right: "clamp(24px,5vw,80px)", width: 36, height: 36, borderBottom: "1px solid #ff2d7830", borderRight: "1px solid #ff2d7830" }} />

        <div ref={ctaRef}>
          <div className={`fi ${ctaVisible ? "in" : ""}`} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#00ffe0", letterSpacing: ".18em", marginBottom: 24 }}>
            // 003 — LET'S BUILD SOMETHING
          </div>
          <h2 className={`fi ${ctaVisible ? "in" : ""}`} style={{ transitionDelay: ".1s", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(60px,11vw,130px)", lineHeight: 0.92, letterSpacing: "-.01em", marginBottom: 36 }}>
            <span style={{ color: "#fff" }}>GOT AN</span><br />
            <span style={{ WebkitTextStroke: "1px #ffffff20", color: "transparent" }}>IDEA?</span>
          </h2>
          <p className={`fi ${ctaVisible ? "in" : ""}`} style={{ transitionDelay: ".2s", fontSize: 15, color: "#334155", maxWidth: 400, margin: "0 auto 52px", lineHeight: 1.9, fontWeight: 300 }}>
            Open to freelance projects, full-time roles, and interesting collaborations. Let's make something exceptional.
          </p>
          <div className={`fi ${ctaVisible ? "in" : ""}`} style={{ transitionDelay: ".3s", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:hello@alex.dev"
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: ".07em", color: "#050508", background: "#00ffe0", padding: "16px 40px", textDecoration: "none", fontWeight: 700, transition: "box-shadow .25s,transform .15s", display: "inline-block" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 60px #00ffe065"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              SEND A MESSAGE
            </a>
            <a href="https://github.com"
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: ".07em", color: "#e2e8f0", border: "1px solid #ffffff18", padding: "16px 40px", textDecoration: "none", transition: "border-color .25s,color .25s", display: "inline-block" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff2d7870"; e.currentTarget.style.color = "#ff2d78"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff18"; e.currentTarget.style.color = "#e2e8f0"; }}>
              GITHUB ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #ffffff06", padding: "22px clamp(24px,5vw,80px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, zIndex: 10, position: "relative" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: ".14em", color: "#ffffff15" }}>
          ALEX<span style={{ color: "#00ffe025" }}>.</span>DEV
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#ffffff12", letterSpacing: ".1em" }}>
          DESIGNED & BUILT FROM SCRATCH — {new Date().getFullYear()}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#ffffff12", letterSpacing: ".1em" }}>
          NEXT.JS · TAILWIND · ♥
        </div>
      </footer>
    </div>
  );
}