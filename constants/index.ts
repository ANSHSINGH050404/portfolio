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
  /**
   * Hostname shown in the terminal prompt and window title. Derived from the
   * canonical origin so it always names the host actually serving the page.
   */
  host: "anshdev-tau.vercel.app",
  email: "anshsinghapa@gmail.com",
  location: "Noida, India",
  resumePath: "/resume.pdf",
  resumeFileName: "Ansh-Kumar-Singh-Resume.pdf",
  socials: {
    github: `https://github.com/ANSHSINGH050404`,
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
  preview: { label: string; gradient: string; image?: string; video?: string };
  /**
   * The public repository behind the project, when one exists. The metrics
   * shown on the card are derived from it — language, last commit, stars —
   * so they stay true instead of being claims that drift.
   */
  repo?: string;
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
    repo: "Browseflow-AI-browser-workflows",
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
    stack: ["Next.js", "TypeScript", "Cloudflare Workers", "Durable Objects", "PartySocket"],
    accent: "#2997ff",
    year: "2026",
    link: "https://type-race-two.vercel.app/",
    featured: false,
    metric: "Realtime · Durable Objects · 1v1",
    problem:
      "Typing tests are single-player — there is no fair way to race someone live, because keystroke timing has to stay in sync across every client in the room.",
    approach:
      "A Cloudflare Durable Object owns each room and keeps its state authoritative; PartySocket carries progress over a WebSocket, and a shared scoring module computes WPM and accuracy from the same formula on both sides.",
    result:
      "Room-link 1v1 races with live opponent progress, a ready-up countdown and a rematch in the same room — Next.js client on Vercel, room worker on Cloudflare, no database at all.",
    preview: {
      label: "Race · Live · Durable Objects",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
      image: "/projects/03.webp",
    },
    repo: "Type-Racer",
  },
  {
    id: "04",
    title: "Omni Search MCP",
    subtitle: "Deep-Web Research MCP Server",
    desc: "A Model Context Protocol server plus web client for agentic research — search the web, read URLs, run deep-research passes, then return structured mind maps and summaries instead of raw text.",
    stack: ["Python", "FastMCP", "MCP", "Next.js"],
    accent: "#2997ff",
    year: "2026",
    link: "https://omni-search-mcp-frontend.vercel.app/",
    featured: false,
    metric: "MCP · Deep research · Mind maps",
    problem:
      "Agents and chat UIs can search, but results come back as unstructured text — you can see what was found, never how the sources relate to each other.",
    approach:
      "A FastMCP server exposes four tools over the Model Context Protocol — search, read, deep research and summarise — backed by Serper for search, Jina Reader for clean page text and Gemini for synthesis.",
    result:
      "A Dockerised MCP server wired to a web client that returns a navigable mind map instead of a wall of text — live in production.",
    preview: {
      label: "Search · Research · Maps",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
      image: "/projects/04.webp",
    },
    repo: "omni-search-mcp-frontend",
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
    desc: "Upstream pull requests across TypeScript and Python ecosystems — 122 opened against other people's repositories, 25 merged. Building tools others actually use.",
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
 *
 * `upstreamPrs` and `mergedPrs` count only repositories the author does not
 * own, matching the `-user:` filter the route applies.
 */
export const STATS_FALLBACK: Stats = {
  originalRepos: 186,
  upstreamPrs: 125,
  mergedPrs: 25,
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

export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    q: "Are you available for new work?",
    a: "Yes — I take on a small number of freelance and contract engagements at a time, alongside full-time roles. Best fit is AI product work, agentic systems, or full-stack platforms that need to ship in weeks.",
  },
  {
    q: "What's your engagement model?",
    a: "Fixed-scope sprints (2–6 weeks) for a defined outcome, or a monthly retainer for ongoing product work. I scope in writing before any code is written, and the scope is what gets built.",
  },
  {
    q: "What stack do you work in?",
    a: "TypeScript/Next.js on the front, Node or Python on the back, Postgres/Redis, Docker, and the usual AI stack (LangChain/LangGraph, MCP, vector stores). I can slot into an existing codebase or start one.",
  },
  {
    q: "Do you do pure AI/ML research?",
    a: "No — I build products on top of models. If you need training, fine-tuning research, or eval science, I'm not the right hire. If you need something that calls models and ships to users, I am.",
  },
  {
    q: "How fast do you respond?",
    a: "Usually within a business day, in IST (UTC+5:30). For active engagements I'm available on Slack/Discord during overlap hours with US/EU timezones.",
  },
  {
    q: "Can I see the source for this site?",
    a: "Yes — the whole portfolio is open source on GitHub. The link is in the footer. Stats, PR wall and project metrics are all derived live rather than typed by hand.",
  },
];
