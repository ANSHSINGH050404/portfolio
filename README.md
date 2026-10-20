# Portfolio — Ansh Kumar Singh

Personal site for **Ansh Kumar Singh** — full-stack & agentic AI engineer.

**Live:** [anshdev-tau.vercel.app](https://anshdev-tau.vercel.app)

## What's here

- **Projects** with case studies (problem → approach → result) and live
  deployment status, checked at request time rather than asserted.
- **GitHub activity** — upstream pull requests with accurate merge state,
  filtered to repositories the author does not own.
- **Writing** — `/blog`, three technical write-ups about problems that came
  up while building the projects.
- **An interactive terminal** (`` ` ``) and command palette (`⌘K`) with live
  stats and machine-readable JSON output.
- **Structured data** — JSON-LD `Person` schema and `llms.txt` for crawlers
  and answer engines.

## Stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS 4

## Getting started

```bash
git clone https://github.com/ANSHSINGH050404/portfolio.git
cd portfolio
bun install
bun run dev
```

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run axe` | WCAG 2.2 AA audit across four scenarios (needs `bunx playwright install chromium`) |
| `bun run perf` | Core Web Vitals and bundle measurement against a running server |
| `bun run screenshots` | Capture screenshots for review |
| `bun run og` | Regenerate the Open Graph image |

CI runs lint, typecheck, build and the accessibility audit on every pull
request.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_DATABUDDY_CLIENT_ID` | No | Analytics client id. Without it, no analytics is sent. |
| `GITHUB_TOKEN` | No | Raises the GitHub API rate limit from 60 req/hr to 5,000/hr and removes a cold-start stall. Server side only. |

Copy `.env.example` to `.env.local` and fill in what you need.

## Contact

- Email: anshsinghapa@gmail.com
- GitHub: [@ANSHSINGH050404](https://github.com/ANSHSINGH050404)
- LinkedIn: [ansh-kumar-singh-050404](https://www.linkedin.com/in/ansh-kumar-singh-050404)
