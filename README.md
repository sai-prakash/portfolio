# saiprakash.design

Portfolio, writing and live demos for Sai Prakash. Next.js on Vercel, content in this repo, edited with Keystatic, with a small language model that runs in the visitor's browser.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000, editor at http://localhost:3000/keystatic
npm run build        # builds the search index, then the site
```

Drafts show in development and on Vercel preview deployments (set `SHOW_DRAFTS=1` for the Preview environment only). Production shows only `status: published`.

## How it's put together

| Part | Where | Notes |
| --- | --- | --- |
| Pages | `app/(site)` | Home, work, writing, tags, /hire, /playground. Statically generated. |
| Content | `content/posts`, `content/work` | MDX with front matter. `content/about.json` holds facts the guide uses. |
| Editor | `/keystatic`, `keystatic.config.tsx` | Git-based. Local mode in dev; GitHub mode in production. |
| Live demos | `components/demos` | Register in `registry.ts`, map in `DemoRenderer.tsx`. Editors insert them as a "Live demo" block. Any web demo can go in an "Embed" block. |
| AI guide | `components/AskSai.tsx`, `lib/ai` | BM25 search over `public/search-index.json` (built by `scripts/build-index.mjs`), then Qwen2.5 0.5B via WebLLM if the visitor opts in. Falls back to quoting the best passage. |
| Playground | `components/Playground.tsx`, `lib/playground.ts` | Qwen2.5 1.5B generates UI JSON from a tiny design system; six checks grade it; failures are fed back. Recorded runs when there's no WebGPU. |
| SEO | `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml`, `app/llms.txt`, `opengraph-image.tsx` files, JSON-LD in pages | Previews are `noindex` via robots. |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` | Page views on every plan. Custom events (`cta_email`, `cta_hire_page`, `role_switch`, `ai_question`, `playground_run`, ...) need Vercel Pro. |

## Deploy on Vercel (one project)

1. Import `sai-prakash/portfolio` in Vercel. Framework: Next.js. No other settings needed.
2. Environment variables:
   - Production: `NEXT_PUBLIC_SITE_URL=https://saiprakash.design`
   - Preview: `SHOW_DRAFTS=1`
3. In the project, turn on **Analytics** and **Speed Insights**.
4. Add the domain `saiprakash.design`.

## Turn on the web editor in production

1. Run `npm run dev` and open `http://localhost:3000/keystatic` with `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` in `.env.local`.
2. Follow Keystatic's prompt to create the GitHub app. It writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into `.env.local`.
3. Copy those four plus `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` into Vercel's Production environment.
4. Edit at `https://saiprakash.design/keystatic`. Every save is a commit; Vercel redeploys.

## Add a live demo

1. Create `components/demos/MyDemo.tsx` (a client component).
2. Add `'my-demo': { label: 'My demo' }` to `components/demos/registry.ts`.
3. Add `'my-demo': dynamic(() => import('./MyDemo'))` to `DemoRenderer.tsx`.
4. It appears in the editor's "Live demo" menu.

## Content plan

See `content/PLAN.md`: 50 articles across seven clusters, 12 drafted.

## Before going public

- Read every draft and case study; resolve every `EditorNote`.
- Clear bank work with compliance. Keep the design system checks at the level of outcomes while the patent publication freeze is on.
- Decide whether the "open to Europe" lines stay while you're employed.
