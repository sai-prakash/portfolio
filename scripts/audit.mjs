// Browser audit over every route: axe (WCAG 2.1 AA + best practice) in light and dark, visible keyboard focus,
// JS-off readability, and screenshots at 1440 and 375 px into .overhaul/screens/.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { serve } from './serve.mjs';

const shots = '.overhaul/screens';
fs.mkdirSync(shots, { recursive: true });
const sitemap = fs.readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiprakash.design';
const routes = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/'))];
if (process.env.ROUTES) routes.splice(0, routes.length, ...process.env.ROUTES.split(','));
const noShots = process.argv.includes('--no-shots');
const { url, stop } = await serve();
const problems = [];
const name = (r) => (r === '/' ? 'home' : r.slice(1).replace(/\//g, '_'));

try {
  const browser = await chromium.launch();
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: theme, viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const r of routes) {
      await page.goto(url + r, { waitUntil: 'networkidle' });
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
      for (const v of res.violations) problems.push(`axe ${theme} ${r}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target?.join(' ')}`);
      // keyboard focus must be visible on every interactive element
      const bad = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])')) {
          const b = el.getBoundingClientRect();
          if (!b.width || !b.height || getComputedStyle(el).visibility === 'hidden') continue;
          el.focus({ preventScroll: true });
          if (document.activeElement !== el) continue;
          const cs = getComputedStyle(el);
          const ring = (e) => (getComputedStyle(e).outlineStyle !== 'none' && parseFloat(getComputedStyle(e).outlineWidth) > 0) || getComputedStyle(e).boxShadow !== 'none';
          const visible = ring(el) || (el.parentElement?.parentElement && ring(el.parentElement.parentElement)) || ring(el.closest('.card') ?? el);
          if (!visible) out.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
        }
        return [...new Set(out)].slice(0, 5);
      });
      if (bad.length) problems.push(`focus ${theme} ${r}: no visible focus on ${bad.join(', ')}`);
      if (!noShots) await page.screenshot({ path: path.join(shots, `${name(r)}-${theme}-1440.png`), fullPage: true });
    }
    if (!noShots) {
      await page.setViewportSize({ width: 375, height: 812 });
      for (const r of routes) {
        await page.goto(url + r, { waitUntil: 'networkidle' });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 1) problems.push(`mobile ${theme} ${r}: horizontal scroll (+${overflow}px)`);
        await page.screenshot({ path: path.join(shots, `${name(r)}-${theme}-375.png`), fullPage: true });
      }
    }
    await ctx.close();
  }
  // JS off: full text, one h1, metadata
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(url + r);
    const d = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      words: document.body.innerText.split(/\s+/).length,
      title: !!document.title,
      desc: !!document.querySelector('meta[name=description]'),
      canon: !!document.querySelector('link[rel=canonical]'),
      og: !!document.querySelector('meta[property="og:image"]'),
      ld: !!document.querySelector('script[type="application/ld+json"]'),
    }));
    if (d.h1 !== 1 || d.words < 80 || !d.title || !d.desc || !d.canon || !d.og || !d.ld) problems.push(`no-js ${r}: ${JSON.stringify(d)}`);
  }
  await browser.close();
} finally { stop(); }

if (problems.length) { console.error(`Audit FAILED (${problems.length}):\n  - ${problems.join('\n  - ')}`); process.exit(1); }
console.log(`Audit passed on ${routes.length} routes (axe light+dark, focus, no-JS${noShots ? '' : ', screenshots'}).`);
