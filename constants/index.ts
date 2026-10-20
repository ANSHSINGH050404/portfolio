export const GITHUB_USER = "ANSHSINGH050404";

export const SITE = {
  name: "Ansh Kumar Singh",
  shortName: "Ansh",
  title: "Ansh Singh — Full-Stack & Agentic AI Engineer",
  description:
    "Full-stack and agentic AI engineer building production AI products — agentic systems, Next.js, and scalable backends.",
  /**
   * Canonical origin. The Vercel project is named `ansh.dev`, but that domain
   * is owned by someone else, so every absolute URL on the site points here
   * instead of at a URL that does not serve this portfolio.
   */
  url: "https://anshdev-tau.vercel.app",
  email: "anshsinghapa@gmail.com",
  location: "Noida, India",
  resumePath: "/Resume-feb@11.pdf",
  resumeFileName: "Ansh-Kumar-Singh-Resume.pdf",
  socials: {
    github: `https://github.com/ANSHSINGH050404`,
    linkedin: "https://www.linkedin.com/in/ansh-kumar-singh-050404",
    email: "mailto:anshsinghapa@gmail.com",
    twitter: "https://x.com/anshsinghapa",
  },
};

export const ROLES = [
  "Full-Stack Developer",
  "Agentic AI Engineer",
  "System Designer",
  "Product Builder",
];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  stack: string[];
  accent: string;
  year: string;
  link: string;
  featured: boolean;
  metric: string;
  problem: string;
  approach: string;
  result: string;
  metrics: { label: string; value: string }[];
  preview: { label: string; gradient: string; image?: string };
};

export const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Browseflow",
    subtitle: "AI Browser Workflow Builder",
    desc: "Visual builder for AI browser automations — open pages, act, extract, and agent through multi-step flows with live runs and session replay. Describe the browser. Ship the workflow.",
    stack: ["Next.js", "TypeScript", "AI Agents", "Browserbase"],
    accent: "#2997ff",
    year: "2026",
    link: "https://browseflow-wine.vercel.app/",
    featured: true,
    metric: "Visual · Agents · Live runs",
    problem:
      "Browser automation still means brittle selectors and scripts — teams can't ship multi-step web workflows without writing code.",
    approach:
      "Node-based visual canvas (Open, Extract, Observe, Agent, HTTP, Condition) driven by natural language, with live run status and Browserbase session replay for teams.",
    result:
      "Shipped a full SaaS loop: org workspaces, free plan (3 workflows / 50 runs), multiplayer canvas, Pro agent + billing — live in production.",
    metrics: [
      { label: "Builder", value: "Visual" },
      { label: "Runs", value: "Live + Replay" },
      { label: "Nodes", value: "Agent · Extract" },
      { label: "Status", value: "Live" },
    ],
    preview: {
      label: "Flow · Browser · Agents",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
      image: "/projects/01.webp",
    },
  },
  {
    id: "02",
    title: "PathForge",
    subtitle: "AI-Powered Career Platform",
    desc: "Career guidance platform with Google Gemini AI for automated Career Path Builder and Resume Analyzer. Serverless backend with Drizzle ORM and Neon PostgreSQL.",
    stack: ["Next.js 15", "TypeScript", "Gemini AI", "PostgreSQL"],
    accent: "#2997ff",
    year: "2024",
    link: "https://pathforge-rho.vercel.app/",
    featured: false,
    metric: "AI · End-to-End",
    problem:
      "Students and early-career engineers struggle to map skills → roles → learning paths without expensive coaching.",
    approach:
      "Gemini-powered path builder + resume analyzer on a serverless Next.js stack (Drizzle + Neon) with structured outputs and actionable plans.",
    result:
      "Shipped a full product loop: upload resume → analysis → personalized path — live in production.",
    metrics: [
      { label: "Stack", value: "Full AI SaaS" },
      { label: "AI", value: "Gemini" },
      { label: "DB", value: "Neon PG" },
      { label: "Status", value: "Live" },
    ],
    preview: {
      label: "Career Path · Resume AI",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
      image: "/projects/02.webp",
    },
  },
  {
    id: "03",
    title: "TypeRace",
    subtitle: "Real-Time Multiplayer Typing Racer",
    desc: "Live typing races over WebSockets — create a room, share the code, and race in real time while a custom typing engine scores WPM and accuracy per keystroke against a persistent global leaderboard.",
    stack: ["Next.js", "TypeScript", "Socket.IO", "Express", "MongoDB"],
    accent: "#2997ff",
    year: "2026",
    link: "https://type-race-two.vercel.app/",
    featured: false,
    metric: "Realtime · Rooms · Leaderboard",
    problem:
      "Typing tests are single-player — there is no fair way to race someone live, because keystroke timing has to stay in sync across every client in the room.",
    approach:
      "Express 5 + Socket.IO rooms broadcast per-keystroke progress so every racer sees live positions; a custom engine computes WPM/accuracy on the client and Mongoose persists each result into a global leaderboard.",
    result:
      "Room-code races with live opponent progress, a ready-up/rematch flow, and a persistent leaderboard — Next.js client on Vercel, socket server on Render, MongoDB behind it.",
    metrics: [
      { label: "Transport", value: "Socket.IO" },
      { label: "Rooms", value: "Code-based" },
      { label: "Scoring", value: "WPM · Acc" },
      { label: "Status", value: "Live" },
    ],
    preview: {
      label: "Race · Live · Leaderboard",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
      image: "/projects/03.webp",
    },
  },
  {
    id: "04",
    title: "Omni Search MCP",
    subtitle: "Deep-Web Research MCP Server",
    desc: "A Model Context Protocol server plus web client for agentic research — search the web, read URLs, run deep-research passes, then return structured mind maps and summaries instead of raw text.",
    stack: ["Python", "FastAPI", "MCP", "Next.js"],
    accent: "#2997ff",
    year: "2026",
    link: "https://omni-search-mcp-frontend.vercel.app/",
    featured: false,
    metric: "MCP · Deep research · Mind maps",
    problem:
      "Agents and chat UIs can search, but results come back as unstructured text — you can see what was found, never how the sources relate to each other.",
    approach:
      "A Python MCP server exposes search, fetch, research and summarise tools over a FastAPI layer; the Next.js client turns the returned research graph into an interactive mind map.",
    result:
      "A Dockerised MCP server wired to a web client that returns a navigable mind map instead of a wall of text — live in production.",
    metrics: [
      { label: "Protocol", value: "MCP" },
      { label: "Tools", value: "Search · Fetch" },
      { label: "Output", value: "Mind map" },
      { label: "Status", value: "Live" },
    ],
    preview: {
      label: "Search · Research · Maps",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
      image: "/projects/04.webp",
    },
  },
];

export const SKILLS = [
  { name: "React / Next.js", pct: 94, color: "#2997ff", icon: "" },
  { name: "Node.js / Express", pct: 90, color: "#2997ff", icon: "" },
  { name: "TypeScript / Python", pct: 88, color: "#2997ff", icon: "" },
  { name: "Agentic AI / LLMs", pct: 92, color: "#2997ff", icon: "" },
  { name: "PostgreSQL / Redis", pct: 83, color: "#2997ff", icon: "" },
  { name: "Docker / AWS", pct: 76, color: "#2997ff", icon: "" },
];

export const STACK_PILLS = [
  "Next.js",
  "TypeScript",
  "Python",
  "Node.js",
  "LangChain",
  "LangGraph",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Pinecone",
  "Docker",
  "AWS",
  "GraphQL",
  "Prisma",
  "Supabase",
  "WebSockets",
];

export const EXPERIENCE = [
  {
    role: "Full-Stack & AI Engineer",
    org: "Independent / Freelance",
    period: "2023 — Present",
    desc: "Shipping AI products end-to-end: agentic workflows, RAG systems, real-time apps, and production Next.js platforms.",
    tags: ["AI Agents", "SaaS", "APIs"],
  },
  {
    role: "Open Source Contributor",
    org: "GitHub Community",
    period: "2022 — Present",
    desc: "Upstream pull requests across TypeScript and Python ecosystems — 122 authored, 59 merged. Building tools others actually use.",
    tags: ["OSS", "TypeScript", "Python"],
  },
  {
    role: "CS Undergraduate",
    org: "SRMS CETR, Bareilly",
    period: "2021 — 2025",
    desc: "Computer Science at SRMS CETR, Bareilly (2021 — 2025). Focus on distributed systems, ML pipelines, and product engineering.",
    tags: ["CS", "Systems", "ML"],
  },
];

export type Stats = {
  originalRepos: number;
  upstreamPrs: number;
  mergedPrs: number;
  languages: number;
  years: number;
};

export const STAT_LABELS: {
  key: keyof Stats;
  label: string;
  /** Secondary line under the number, e.g. how many of the PRs were merged. */
  sub?: { key: keyof Stats; label: string };
}[] = [
  { key: "originalRepos", label: "original repos" },
  {
    key: "upstreamPrs",
    label: "upstream PRs",
    sub: { key: "mergedPrs", label: "merged upstream" },
  },
  { key: "languages", label: "languages used" },
  { key: "years", label: "years shipping" },
];

/**
 * Last verified against the GitHub API on 2026-10-20. These are only used
 * when the API is rate-limited or offline — the live numbers come from
 * `/api/stats`.
 */
export const STATS_FALLBACK: Stats = {
  originalRepos: 185,
  upstreamPrs: 122,
  mergedPrs: 59,
  languages: 11,
  years: 4,
};

export const BENTO = [
  {
    id: "ai",
    title: "Agentic AI",
    desc: "Multi-step LLM agents, tool calling, memory, and eval loops that ship.",
    span: "lg",
    accent: "#2997ff",
  },
  {
    id: "fullstack",
    title: "Full-Stack",
    desc: "Next.js · Node · Postgres · Redis from pixel to prod.",
    span: "md",
    accent: "#2997ff",
  },
  {
    id: "speed",
    title: "Ship Fast",
    desc: "From idea → MVP → users in weeks, not quarters.",
    span: "sm",
    accent: "#2997ff",
  },
  {
    id: "systems",
    title: "Systems Thinking",
    desc: "Auth microservices, caching layers, and APIs that scale.",
    span: "md",
    accent: "#2997ff",
  },
  {
    id: "realtime",
    title: "Real-time",
    desc: "WebSockets, live race sync, dashboards.",
    span: "sm",
    accent: "#2997ff",
  },
];
