# Launch gate: actions that need Sai's yes

Nothing below has been done. Each is prepared.

## 1. Merge to main
Open a PR from `overhaul/gold-standard` to `main` once `npm run verify` is green on the preview. Merge only after review. Then re-run the checks against production.

## 2. Point `saiprakash.design` at this project (replaces the old "Senior Product Designer" site)
Vercel project: `portfolio`. Today it serves `sai-prakash.vercel.app`.
1. Vercel, project `portfolio`, Settings, Domains: add `saiprakash.design` (set as primary) and `www.saiprakash.design` (redirect to the apex).
2. At the DNS host for `saiprakash.design`, replace the old site's records with what Vercel shows. Normally:
   - `A` for `@` to `76.76.21.21`
   - `CNAME` for `www` to `cname.vercel-dns.com`
   Delete any other `A`, `AAAA` or `CNAME` on `@` and `www` that point to the old host. Use the exact values the Domains screen displays if they differ.
3. Settings, Domains: edit `sai-prakash.vercel.app` and set it to redirect (308) to `saiprakash.design`.
4. Environment variable (Production): `NEXT_PUBLIC_SITE_URL=https://saiprakash.design`. Redeploy.
5. Secondary domain `ai.saiprakash.design` (if still in use): add it as a redirect to the apex.
6. Verify: `curl -I https://saiprakash.design`, check the title no longer says "Senior Product Designer", and test the link preview at opengraph.xyz.

## 3. Make repos public
`ds-bench-de` is already public. The MCP server repo stays private until you say yes.

## 4. GitHub profile
Files in `github-profile/` (when written). Apply: create repo `sai-prakash/sai-prakash`, paste the README, set the bio, pin the three repos, unpin or archive the unrelated ones listed there.

## 5. Posts and outreach
Drafts only, in `distribution/` (when written). Nothing is posted or sent.
