// Content gates. Run after `next build`. Fails the build on:
//  1. banned internal names / patent-frozen mechanisms anywhere in built output, source content or commit messages
//  2. NaN / undefined / empty value-unit pairs in rendered HTML
//  3. any metric from content/facts.json (or the legacy uncleared list) that is not cleared:true
//  4. no-JS basics on every built page: one h1, title, description, canonical, og:image
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const terms = JSON.parse(fs.readFileSync(path.join(root, 'scripts/banned-terms.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(path.join(root, 'content/facts.json'), 'utf8'));
const banned = terms.banned.map((t) => new RegExp(t, 'i'));
const uncleared = terms.uncleared.map((t) => new RegExp(t, 'i'));
for (const m of facts.metrics) if (m.value && m.cleared !== true) uncleared.push(new RegExp(m.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
if (facts.ceoAward && !facts.ceoAwardCleared) banned.push(new RegExp(facts.ceoAward.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

function walk(dir, ok, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.git', '.next', '.overhaul', 'recreations-src'].includes(e.name)) walk(p, ok, out); }
    else if (ok(p)) out.push(p);
  }
  return out;
}

function scan(where, text) {
  for (const re of banned) { const m = text.match(re); if (m) fail(where, `banned term "${m[0]}"`); }
  for (const re of uncleared) { const m = text.match(re); if (m) fail(where, `uncleared metric "${m[0]}"`); }
}

// 1+3 over source (content, app, components, lib, public, README)
const srcExt = /\.(mdx?|tsx?|json|css|txt|svg|html)$/;
const srcFiles = [
  ...['content', 'app', 'components', 'lib', 'public'].flatMap((d) => walk(path.join(root, d), (p) => srcExt.test(p) && !/content\/facts\.json$|lib\/facts\.ts$/.test(p))),
  path.join(root, 'README.md'),
].filter((f) => fs.existsSync(f));
for (const f of srcFiles) scan(path.relative(root, f), fs.readFileSync(f, 'utf8'));

// commit messages on this branch
try {
  const log = execSync('git log --format=%B origin/main..HEAD', { encoding: 'utf8' });
  scan('git log', log);
} catch { /* no remote ref in CI shallow clones: skip */ }

// 1+2+3+4 over built output
const built = path.join(root, '.next/server/app');
if (!fs.existsSync(built)) { console.error('No build output. Run `npm run build` first.'); process.exit(2); }
const out = walk(built, (p) => /\.(html|body)$/.test(p));
const metaRoutes = (p) => /_not-found|_global-error|keystatic/.test(p);
for (const f of out) {
  const rel = path.relative(built, f);
  const raw = fs.readFileSync(f, 'utf8');
  scan(rel, raw);
  if (!f.endsWith('.html')) continue;
  // Visible text and attributes only: Next flight data legitimately contains "$undefined".
  const visible = raw.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const text = visible.replace(/<[^>]+>/g, ' ');
  const attrs = (visible.match(/(aria-label|alt|title|content)="[^"]*"/g) || []).join(' ');
  for (const [name, hay] of [['text', text], ['attributes', attrs]]) {
    if (/\bNaN\b/.test(hay)) fail(rel, `NaN in ${name}`);
    if (/\bundefined\b/.test(hay)) fail(rel, `"undefined" in ${name}`);
    if (/\[object Object\]/.test(hay)) fail(rel, `[object Object] in ${name}`);
  }
  if (/<[a-z0-9]+[^>]*>\s*(min|minutes|%|mins)\s*<\//i.test(visible.replace(/<!--.*?-->/g, ''))) fail(rel, 'empty value-unit pair');
  if (metaRoutes(rel) || raw.includes('NEXT_HTTP_ERROR_FALLBACK;404')) continue; // 404 shells (e.g. hidden /writing) are not pages
  // 4: no-JS basics
  const h1s = (visible.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(rel, `expected one h1, found ${h1s}`);
  if (!/<title>[^<]{5,}<\/title>/.test(raw)) fail(rel, 'missing <title>');
  if (!/<meta name="description" content="[^"]{20,}"/.test(raw)) fail(rel, 'missing meta description');
  if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(raw)) fail(rel, 'missing canonical');
  if (!/<meta property="og:image" content="https?:\/\/[^"]+"/.test(raw)) fail(rel, 'missing og:image');
  if (!/"@type":"Person"/.test(raw)) fail(rel, 'missing Person JSON-LD');
}

if (problems.length) {
  console.error(`\nContent gates FAILED (${problems.length}):`);
  for (const p of problems.slice(0, 80)) console.error('  - ' + p);
  process.exit(1);
}
console.log(`Content gates passed: ${srcFiles.length} source files, ${out.length} built files.`);
