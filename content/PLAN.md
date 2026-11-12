# Editorial plan: 50 articles

Two articles a week from 17 November 2026, so the full set lands by early May 2027. Articles 1–12 are drafted in `content/posts` (status: draft). Edit them, clear anything about bank work, then flip `status` to `published` in Keystatic.

**Who we're writing for:** hiring managers and recruiters for Staff Design Engineer, UX Engineer, Design Technologist and Applied AI Engineer roles, in Europe first. Every article should (a) answer a question they or their team search for, (b) prove a claim with shipped work, and (c) link to one case study and to /hire.

**Rules for every article**
- Only claims Sai has made or can back. Anything unsure goes in an `EditorNote`.
- Bank work at the level compliance has cleared. Nothing about how the checks work internally until the patent publication freeze is lifted.
- One live demo or before/after where it helps; never decoration.
- Title says what the reader gets. Description 140–160 characters.
- Link to the cluster's pillar article and at least one sibling.

## Clusters (pillar first)

| Cluster | Pillar |
| --- | --- |
| A. Design systems for AI agents | #1 Your design system has a new reader |
| B. Evaluating AI output | #3 Measure the agent, not the demo |
| C. Applied AI in finance and enterprise | #10 Designing AI assistants for finance teams |
| D. In-browser AI and WebGPU | #5 Running a small LLM in the browser |
| E. Accessibility | #8 Accessibility is a design system feature |
| F. Careers and hiring | #7 Design engineer vs UX engineer vs design technologist |
| G. Building in public | #6 How this site works |

## The 50

| # | Title | Search intent | Cluster | Track | Target date | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Your design system has a new reader, and it doesn't scroll | design system for AI agents | A | DE | 17 Nov 2026 | Drafted |
| 2 | Give the agent twelve kilobytes first: tiered specs | design system documentation for LLMs | A | DE | 20 Nov | Drafted |
| 3 | Measure the agent, not the demo | evaluate AI generated UI code | B | Both | 24 Nov | Drafted |
| 4 | What a design system MCP server should expose | design system MCP server | A | Both | 27 Nov | Drafted |
| 5 | Running a small LLM in the browser with WebGPU | WebLLM WebGPU in browser LLM | D | AI | 1 Dec | Drafted |
| 6 | How this site works | Next.js Keystatic portfolio with AI | G | Both | 4 Dec | Drafted |
| 7 | Design engineer vs UX engineer vs design technologist | what is a design engineer | F | DE | 8 Dec | Drafted |
| 8 | Accessibility is a design system feature, not an audit | accessible design system | E | DE | 11 Dec | Drafted |
| 9 | LLM document extraction that people trust | LLM document extraction human in the loop | C | AI | 15 Dec | Drafted |
| 10 | Designing AI assistants for finance teams | AI copilot design finance | C | AI | 18 Dec | Drafted |
| 11 | Evaluating LLM features without a data science team | how to evaluate LLM features | B | AI | 22 Dec | Drafted |
| 12 | Design system adoption is a measurement problem | measure design system adoption | B | DE | 29 Dec | Drafted |
| 13 | Writing component rules an agent can follow | design system guidelines for AI | A | DE | 5 Jan 2027 | Outline |
| 14 | The one-line component registry | component inventory for agents | A | DE | 8 Jan | Outline |
| 15 | Examples beat prose: teaching agents with code samples | few-shot examples design system | A | Both | 12 Jan | Outline |
| 16 | Design tokens for agents: names that explain themselves | design token naming | A | DE | 15 Jan | Outline |
| 17 | Agents and Figma: closing the loop between design files and code | Figma to code AI agents | A | DE | 19 Jan | Outline |
| 18 | Five layers of grading AI-generated UI | AI UI evaluation framework | B | Both | 22 Jan | Outline |
| 19 | LLM-as-judge for UI: when to trust it | LLM as a judge evaluation | B | AI | 26 Jan | Outline |
| 20 | Building a task set for agent benchmarks | benchmark coding agents | B | Both | 29 Jan | Outline |
| 21 | ds-bench-de: first results on German design systems | SAP UI5 Siemens iX Telekom Scale AI | B/G | Both | 2 Feb | Outline (needs results) |
| 22 | Self-correcting agents: feeding check failures back | agent self-correction loop | B | AI | 5 Feb | Outline |
| 23 | Retrieval before generation: small models, big context | RAG small language model | D | AI | 9 Feb | Outline |
| 24 | JSON mode and structured output in the browser | WebLLM JSON structured output | D | AI | 12 Feb | Outline |
| 25 | WebGPU fallbacks: designing for the browsers that can't | WebGPU fallback UX | D | Both | 16 Feb | Outline |
| 26 | Private by default: AI features that never leave the device | on-device AI privacy finance | D | AI | 19 Feb | Outline |
| 27 | Transformers.js vs WebLLM for product teams | transformers.js vs webllm | D | AI | 23 Feb | Outline |
| 28 | Measuring in-browser model performance | WebGPU tokens per second | D | AI | 26 Feb | Outline (needs measurements) |
| 29 | The European Accessibility Act for design system teams | European Accessibility Act design system | E | DE | 2 Mar | Outline (verify law) |
| 30 | BFSG in practice: what German product teams need from their components | BFSG Barrierefreiheitsstärkungsgesetz design | E | DE | 5 Mar | Outline (verify law) |
| 31 | Accessible AI interfaces: streaming text, screen readers and focus | accessible chat UI | E | Both | 9 Mar | Outline |
| 32 | Contrast at the token level | colour contrast design tokens | E | DE | 12 Mar | Outline |
| 33 | SEBI's digital accessibility rules, explained for product teams | SEBI digital accessibility | E | DE | 16 Mar | Outline (verify circulars) |
| 34 | The review screen is the product: human-in-the-loop UX | human in the loop UX design | C | AI | 19 Mar | Outline |
| 35 | Golden data: why reference records matter for AI in banking | golden data AI | C | AI | 23 Mar | Outline (clear with compliance) |
| 36 | Baselines first: proving an AI feature's value | measure AI productivity gains | C | AI | 26 Mar | Outline |
| 37 | Prompt management for product teams | prompt versioning | C | AI | 30 Mar | Outline |
| 38 | When not to use an LLM | LLM vs rules | C | AI | 2 Apr | Outline |
| 39 | Interviewing as a Staff design engineer: what I prepare | staff design engineer interview | F | DE | 6 Apr | Outline |
| 40 | From SAP UI developer to Staff design engineer: eleven years of lessons | design engineer career path | F | DE | 9 Apr | Outline |
| 41 | What a Staff design engineer does all week | staff design engineer responsibilities | F | DE | 13 Apr | Outline |
| 42 | Hiring an applied AI engineer: what to look for | hire applied AI engineer | F | AI | 16 Apr | Outline |
| 43 | Portfolio for design engineers: show the system, not the screens | design engineer portfolio | F/G | DE | 20 Apr | Outline |
| 44 | Moving from India to Germany as a design engineer | design engineer jobs Germany | F | Both | 23 Apr | Outline (only after you're ready to say it publicly) |
| 45 | Keystatic and MDX: a CMS where articles can run demos | Keystatic MDX components | G | DE | 27 Apr | Outline |
| 46 | Building the playground: an agent, a design system and six checks | AI UI playground | G | Both | 30 Apr | Outline |
| 47 | llms.txt and structured data: making a portfolio readable by AI | llms.txt example | G | Both | 4 May | Outline |
| 48 | Analytics for a portfolio: measuring what recruiters do | portfolio analytics | G | Both | 7 May | Outline (needs data) |
| 49 | Design system linting on apps that never used the system | design system linter | B | DE | 11 May | Outline (after freeze is lifted) |
| 50 | A year of building design systems for agents: what held up | design systems AI lessons | A | Both | 14 May | Outline |

## Case studies (in `content/work`)

Liquidity Co-Pilot · PromptForge · Design system checks · A design system agents can read · MDS AI Assist Figma plugin · ds-bench-de · This site. Each has `EditorNote`s listing what you need to add.
