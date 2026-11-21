// Link checker over built HTML. Internal links must resolve to a built page, route body or public file.
// External links must answer 2xx/3xx (LinkedIn blocks bots, so it is allowed to answer 999/403/429). Pass --offline to skip external.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const built = path.join(root, '.next/server/app');
const offline = process.argv.includes('--offline');
const ALLOW_STATUS = new Map([['linkedin.com', [999, 403, 429, 401]]]);
const DYNAMIC = [/^\/keystatic/, /^\/api\//];

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, out) : /\.html$/.test(e.name) && out.push(p);
  }
  return out;
}

function exists(p) {
  const clean = p.replace(/\/$/, '') || '/index';
  return [`${clean}.html`, `${clean}/index.html`, `${clean}.body`].some((c) => fs.existsSync(path.join(built, c)))
    || fs.existsSync(path.join(root, 'public', p));
}

const internal = new Map(); // href -> [pages]
const external = new Map();
for (const f of walk(built)) {
  const rel = path.relative(built, f);
  const html = fs.readFileSync(f, 'utf8');
  if (html.includes('NEXT_HTTP_ERROR_FALLBACK;404') || /_global-error/.test(rel)) continue;
  for (const m of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|#|javascript:)/.test(href)) continue;
    const map = /^https?:\/\//.test(href) ? external : internal;
    if (!map.has(href)) map.set(href, []);
    map.get(href).push(rel);
  }
}

const bad = [];
for (const [href, pages] of internal) {
  const p = href.split('#')[0].split('?')[0];
  if (!p || DYNAMIC.some((r) => r.test(p))) continue;
  if (!exists(p)) bad.push(`internal ${href} (from ${[...new Set(pages)].slice(0, 3).join(', ')})`);
}

if (!offline) {
  const own = (process.env.NEXT_PUBLIC_SITE_URL || 'https://saiprakash.design').replace(/\/$/, '');
  await Promise.all([...external].map(async ([href, pages]) => {
    if (href.startsWith(own)) { const p = href.slice(own.length) || '/'; if (!exists(p.split('#')[0])) bad.push(`own-domain ${href}`); return; }
    const host = new URL(href).hostname.replace(/^www\./, '');
    const ok = ALLOW_STATUS.get(host) ?? [];
    try {
      let r = await fetch(href, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 link-check' } });
      if (r.status >= 400 && r.status !== 429) r = await fetch(href, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 link-check' } });
      if (r.status >= 400 && !ok.includes(r.status)) bad.push(`external ${href} -> ${r.status} (from ${pages[0]})`);
    } catch (e) {
      if (!ok.length) bad.push(`external ${href} -> ${e.cause?.code || e.name} (from ${pages[0]})`);
    }
  }));
}

if (bad.length) { console.error(`Link check FAILED (${bad.length}):\n  - ${bad.join('\n  - ')}`); process.exit(1); }
console.log(`Link check passed: ${internal.size} internal, ${offline ? 'external skipped' : external.size + ' external'}.`);
