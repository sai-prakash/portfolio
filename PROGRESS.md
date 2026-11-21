# Overhaul progress

Branch: `overhaul/gold-standard`. Statuses: `Todo`, `In progress`, `Done (verified: how)`, `Blocked on Sai: what, where the draft is`.
Gate: `npm run verify` (types, unit tests, build, CV PDF, content gates, link check, CV parse). A11y, Lighthouse and screenshots are listed under Phase 5 until wired.

## Phase 0: stop the damage
- [x] Before/after chart bug. Done (verified: root cause was next-mdx-remote v6 blocking `{218}` JS-expression props, so values arrived undefined; component now takes string props, validates finite numbers, renders only for a cleared fact; `tests/content-gates.test.mjs` fails on NaN, undefined and empty value-unit; built HTML grep shows 0 NaN)
- [x] Banned internal names removed everywhere. Done (verified: `scripts/verify-content.mjs` scans source, built HTML/JSON/TXT, commit messages against `scripts/banned-terms.json`; passes; runs in CI via `.github/workflows/verify.yml`)
- [x] Uncleared metrics removed; metrics render only from `facts.json`. Done (verified: gate fails on any non-cleared fact value and on the legacy list; `Metric` and `BeforeAfter` read `clearedMetric()`)
- [x] `/writing` hidden until 3 essays; six dead links removed; link checker in CI. Done (verified: `/writing`, `/feed.xml` 404 and absent from nav, sitemap, llms.txt; `scripts/check-links.mjs` passes on built output)
- [x] Stray "Pa / Sa / Sa" labels removed; slider replaced. Done (verified: component deleted; no drag slider on home; no 218/37 anywhere)
- [x] "90 to to 20" stat removed. Done (verified: stat band deleted; gate would catch the numbers)
- [ ] `saiprakash.design` pointed at this project, `sai-prakash.vercel.app` redirects to it. Blocked on Sai: DNS and Vercel steps in `LAUNCH.md` (nothing changed)
- [x] `/about` added. Done (verified: 200, in sitemap, in nav)

## Phase 1: hiring basics and evidence
- [x] Facts strip on home, `/hire`, `/about`. Done (verified: renders from `facts.json`; null hidden). Needs Sai: notice period, relocation, German CEFR
- [ ] CV: month and year on every role, VP date. Blocked on Sai: `roles[].start/end`, `vpSince` in `content/facts.json`. Two pages and PDF parse: Done (verified: `npm run verify:cv`, PyMuPDF extraction because poppler is not installed locally; CI installs poppler-utils)
- [ ] Three hero case studies at 1,200 to 2,000 words. In progress
- [ ] Redrawn visuals, recreations route, loops. Todo
- [x] Smaller studies merged into the "Design systems for agents" programme page. Done (verified: three files removed, one page, work list is 3 + programme + open source)
- [x] One-line positioning. Done: "I build the design-system spec that coding agents read, and the checks that show they followed it." Chosen from five after a sceptical-hiring-manager critique (Grok, log in `.overhaul/logs/grok-positioning.txt`). Why: the critic scored the original (option 1) 6/4/5 on clarity/credibility/fog and flagged "work" and "prove" as empty; the winner names two artefacts a manager can interview on. Its warning, which I acted on: the first proof on the page must match the line, so the home page now leads with the agent demo, not a numbers band. Role toggle removed.
- [ ] Booking link. Done in code (renders only from `facts.calendarUrl`); Blocked on Sai: the URL
- [ ] Recommendations: component done (renders only approved quotes). Request drafts: Todo
- [ ] GitHub profile README, bio, pin list. Todo

## Phase 2: design refresh
- [x] Header 9 controls to 5. Done (verified: Work, Writing when live, About, CV, Contact; cmd-K, agent view, theme, ask moved to footer; shortcuts kept)
- [x] Easter-egg counter removed; sound strictly opt-in; Panini puzzle moved to About. Done (verified: counter and toasts removed, `Tanpura` renders only a "Sound off" button, nothing plays or loads before opt-in, puzzle on `/about` only)
- [ ] New home order. In progress (done except the hero loop and real images)
- [ ] Editorial layout (680 px column, 12-col grid, one accent). In progress
- [x] Outlined pills replaced with text links; one primary button per view (home, hire, about, footer). Done (verified: code)
- [ ] Mobile header under 72 px, proof in first 812 px. In progress (header done; needs screenshot check)
- [x] Sticky "Hiring?" pill retired. Done (component deleted)

## Phase 3: public artefacts and writing
- [ ] MCP server, tiered specs. Todo
- [ ] ds-bench-de T02 to T12 and leaderboard. Todo (local search found no T0x files on this machine; repo is public on GitHub)
- [ ] Craft page. Todo
- [ ] Three essays. Todo
- [ ] Playground bring-your-own prompt. Todo
- [ ] Token contrast tool page. Todo

## Phase 4: distribution drafts
- [ ] LinkedIn posts, talk proposal, outreach template and tracker, analytics events. Todo

## Phase 5: verification
- [ ] axe on every route, light and dark. Todo
- [ ] Lighthouse mobile. Todo
- [ ] No-JS check. Static part Done (verified: gate checks one h1, title, description, canonical, og:image, Person JSON-LD on every built page); Playwright JS-off run Todo
- [ ] Screenshots reviewed, Grok critique. Todo

## Sai review list (patent freeze and publication safety)
- The "Design systems for agents" page describes the benchmark's six scoring dimensions and the tiered-spec idea. Confirm with counsel these are clear.
- The checks page describes outcomes only. Nothing about how they work.
- Page for the code agent is reduced to one paragraph with no mechanism.
