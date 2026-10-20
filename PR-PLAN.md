# PR Plan — Portfolio hardening

Base: `master` (d576e94). Repo: `ANSHSINGH050404/portfolio` (now public).
Every PR targets `master`, is merged before the next branches, and is verified with
`bun run lint` + `npx tsc --noEmit` + `bun run build` before merge.

## Slice 1 — `fix/stats` (correctness, highest priority)
**Why first:** the hero displays a wrong number on the main page.

- `components/Counter.tsx` — rAF loop has no cleanup, so a stale animation
  overwrites the live value (104 rendered, 122 real). Add `cancelAnimationFrame`
  in the effect cleanup.
- `app/api/stats/route.ts` — own-repo filter compares `repository_url` against a
  case-sensitive prefix; GitHub returns the owner segment lowercased in some
  responses. Make the comparison case-insensitive and derive it from the actual
  repo list.
- `app/api/stats/route.ts` — `GITHUB_USER` is hardcoded, duplicating
  `constants/index.ts`. Import it.
- `constants/index.ts` — `upstreamPrs: 104` fallback is stale (real: 122).
  Refresh fallbacks.
- `constants/index.ts` — "50+ OSS contributions" understates 122 upstream PRs.
  Make it accurate and link it to the live source of truth.

## Slice 2 — `fix/pr-wall` (truthfulness)
- `components/PRWall.tsx` — badge says "Merged / Closed" for every closed PR, but
  all 8 hardcoded fallbacks are `merged=False`. Use the real `merged_at` from the
  GitHub search API and label accurately.
- `components/PRWall.tsx` — 7 of 30 live cards are the author's own
  repos/forks, under a heading that claims "merged into projects I don't own".
  Filter them out.
- `components/PRWall.tsx` — hardcoded fallback PR list drifts from reality
  (2 cal.com PRs are closed, not open). Derive from the API, keep fallback minimal.

## Slice 3 — `fix/heading-and-metadata` (crawler-visible correctness)
- `components/SlotTitle.tsx` — the `<h1>`'s text content is 24KB of random
  glyphs; only `aria-label` carries the name. Crawlers and AI scrapers read
  garbage. Add real text to the DOM, mark the reels decorative.
- `app/layout.tsx` — title/description duplicated between `layout.tsx` and
  `constants/index.ts` and already drifted (em dash vs hyphen). Drive metadata
  from `SITE`.
- Add canonical URL.

## Slice 4 — `fix/domain-and-urls` (honest strings)
User decision: keep the Vercel URL, fix dishonest strings.
- `constants/index.ts` — add a single `url` field; use it for canonical,
  robots, sitemap, and share links.
- `components/Terminal.tsx` — prompt says `guest@ansh.dev:~$` and the welcome
  banner says "ansh.dev terminal v1.0", but `ansh.dev` belongs to someone else.
  Point these at the real deployment URL.
- `app/robots.ts`, `app/sitemap.ts` — hardcode the origin; derive from `SITE`.

## Slice 5 — `fix/no-js` (progressive enhancement)
- `app/page.tsx` — without JS the loader overlay covers the page in black and
  all 31 `.fi` reveal elements stay at `opacity: 0`. Add a `<noscript>` fallback
  that removes the overlay and reveals content.

## Slice 6 — `perf/bundle` (performance)
- `app/page.tsx` — `Terminal`, `CommandPalette`, `SlotTitle`, `HeadlineSmoke`
  load eagerly. Code-split them with `next/dynamic`.
- Remove `components/ParticleCanvas.tsx` and `components/MagneticCursor.tsx`
  (never imported) and `public/click1.wav` (unused).
- `app/api/github/route.ts`, `app/api/stats/route.ts` — support `GITHUB_TOKEN`
  to lift the 60 req/hr unauthenticated limit and cut cold-start latency.

## Slice 7 — `feat/seo` (discoverability)
- `app/layout.tsx` — add JSON-LD `Person` schema with `sameAs` links.
- `app/sitemap.ts` — emit real routes.
- `app/llms.txt/route.ts` — add `llms.txt` for AI crawlers.

## Slice 8 — `feat/project-metrics` (verifiable metrics)
User decision: derive from what is verifiable, never invent numbers.
- `constants/index.ts` — replace the qualitative metric chips ("Live", "Visual")
  with facts I can verify: source repo link, last push date, primary language,
  live-URL status.
- `app/api/github/route.ts` — expose per-project repo metadata.
- `components/Projects.tsx` — render the derived metrics.

## Slice 9 — `feat/blog` (writing)
- Add a `/blog` route with real technical posts written from the actual
  projects (Browseflow, TypeRace, Omni Search MCP) and the upstream PR work.
- `app/sitemap.ts` — include blog posts.

## Slice 10 — `feat/terminal-and-palette` (distinctiveness)
- `components/Terminal.tsx` — add `stats`, `hire`, `whoami --json`,
  `resume --json`.
- `components/CommandPalette.tsx` — fuzzy-search projects, not just navigate.

## Slice 11 — `ci/quality` (engineering signal)
- `.github/workflows/ci.yml` — lint, typecheck, build, and the existing axe
  a11y gate on every PR.
- `package.json` — add `typecheck` and `test:a11y` scripts.

## Slice 12 — `docs/readme` (accuracy)
- `README.md` — says "Next.js 15" (actual: 16), says `npm install` (actual:
  bun), doesn't mention the terminal/palette/analytics.
