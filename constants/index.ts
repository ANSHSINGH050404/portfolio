export const GITHUB_USER = "ANSHSINGH050404";

export const SITE = {
  name: "Ansh Kumar Singh",
  shortName: "Ansh",
  title: "Ansh Singh — Full-Stack & Agentic AI Engineer",
  description:
    "Final-year CS student building production AI products. Full-stack developer specializing in agentic systems, Next.js, and scalable backends.",
  email: "anshsinghapa@gmail.com",
  location: "Bareilly, India",
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
  preview: { label: string; gradient: string };
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
    },
  },
  {
    id: "03",
    title: "AI Interviewer",
    subtitle: "Agentic Interview System",
    desc: "Agentic interviewer with adaptive questioning, multi-turn reasoning, WebRTC audio/video, and analytics dashboard for candidate performance trends.",
    stack: ["Node.js", "TypeScript", "WebSockets", "Supabase"],
    accent: "#2997ff",
    year: "2024",
    link: "https://voicevue-ai.vercel.app",
    featured: false,
    metric: "Real-time · WebRTC",
    problem:
      "Hiring loops are slow and inconsistent — candidates rarely get adaptive, high-signal practice interviews.",
    approach:
      "Agentic multi-turn interviewer with WebRTC A/V, WebSocket session state, and a performance analytics dashboard.",
    result:
      "Real-time mock interviews that adapt mid-session and surface trendable skill signals.",
    metrics: [
      { label: "Mode", value: "Realtime" },
      { label: "Media", value: "WebRTC" },
      { label: "Agent", value: "Multi-turn" },
      { label: "Status", value: "Live" },
    ],
    preview: {
      label: "Voice · Video · Agents",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
    },
  },
  {
    id: "04",
    title: "RAG Doc Assistant",
    subtitle: "LLM Documentation Search",
    desc: "Intelligent documentation search using RAG architecture. Indexed 10,000+ pages with hybrid vector + BM25 search, improving retrieval accuracy by 35%.",
    stack: ["Python", "FastAPI", "LangChain", "Pinecone"],
    accent: "#2997ff",
    year: "2023",
    link: "https://omni-search-mcp-frontend.vercel.app/",
    featured: false,
    metric: "10K+ pages indexed",
    problem:
      "Teams waste hours grepping docs — pure keyword search misses intent; pure vectors miss exact terms.",
    approach:
      "Hybrid RAG: chunk + embed into Pinecone, fuse vector + BM25 ranking, serve via FastAPI + LangChain.",
    result:
      "Indexed 10,000+ pages with ~35% better retrieval accuracy vs. baseline keyword search.",
    metrics: [
      { label: "Pages", value: "10K+" },
      { label: "Accuracy", value: "+35%" },
      { label: "Search", value: "Hybrid" },
      { label: "Stack", value: "RAG" },
    ],
    preview: {
      label: "Vector · BM25 · RAG",
      gradient: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0f 100%)",
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
    desc: "50+ OSS contributions across TypeScript and Python ecosystems. Building tools others actually use.",
    tags: ["OSS", "TypeScript", "Python"],
  },
  {
    role: "CS Undergraduate",
    org: "SRMS CETR, Bareilly",
    period: "2021 — 2025",
    desc: "Final-year Computer Science. Focus on distributed systems, ML pipelines, and product engineering.",
    tags: ["CS", "Systems", "ML"],
  },
];

export const STATS = [
  { value: 30, suffix: "+", label: "Projects shipped" },
  { value: 50, suffix: "+", label: "OSS contribs" },
  { value: 500, suffix: "+", label: "Users on product" },
  { value: 5, suffix: "K+", label: "Daily API users" },
];

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
    desc: "WebSockets, WebRTC, live dashboards.",
    span: "sm",
    accent: "#2997ff",
  },
];
