'use client';
import { useEffect, useState } from 'react';
import { contrast } from '@/lib/contrast';

type Row = { name: string; ok: boolean; detail: string; wcag: string };

function toHex(rgb: string) {
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m) return '#000000';
  return '#' + m.slice(0, 3).map((n) => Math.round(Number(n)).toString(16).padStart(2, '0')).join('');
}
function accName(el: Element) {
  const aria = el.getAttribute('aria-label') || '';
  const by = el.getAttribute('aria-labelledby');
  const byText = by ? by.split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' ') : '';
  return (aria || byText || (el as HTMLElement).innerText || el.getAttribute('title') || '').trim();
}

/** Audits the page it's on, in the visitor's browser. Nothing here is typed in by hand. */
export default function SelfAudit() {
  const [rows, setRows] = useState<Row[] | null>(null);
  function run() {
    const out: Row[] = [];
    out.push({ name: 'Page language is set', ok: !!document.documentElement.lang, detail: `lang="${document.documentElement.lang}"`, wcag: '3.1.1' });
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
    const skips = hs.filter((l, i) => i > 0 && l - hs[i - 1] > 1).length;
    out.push({ name: 'One h1, no skipped heading levels', ok: hs.filter((l) => l === 1).length === 1 && skips === 0, detail: `${hs.length} headings, ${skips} skips`, wcag: '1.3.1' });
    const imgs = [...document.querySelectorAll('img')];
    const noAlt = imgs.filter((i) => !i.hasAttribute('alt')).length;
    out.push({ name: 'Every image has alt text', ok: noAlt === 0, detail: `${imgs.length} images, ${noAlt} without alt`, wcag: '1.1.1' });
    const fields = [...document.querySelectorAll('input:not([type=hidden]),select,textarea')];
    const unlabelled = fields.filter((f) => !((f as HTMLInputElement).labels?.length || f.getAttribute('aria-label') || f.getAttribute('aria-labelledby'))).length;
    out.push({ name: 'Every field has a label', ok: unlabelled === 0, detail: `${fields.length} fields, ${unlabelled} unlabelled`, wcag: '3.3.2' });
    const controls = [...document.querySelectorAll('a[href],button')];
    const unnamed = controls.filter((c) => !accName(c)).length;
    out.push({ name: 'Every link and button has a name', ok: unnamed === 0, detail: `${controls.length} controls, ${unnamed} unnamed`, wcag: '4.1.2' });
    const lm = ['header', 'nav', 'main', 'footer'].filter((t) => document.querySelector(t));
    out.push({ name: 'Skip link and landmarks', ok: !!document.querySelector('a.skip[href="#main"]') && lm.length === 4, detail: `skip link, ${lm.join(', ')}`, wcag: '2.4.1' });
    const cs = getComputedStyle(document.documentElement);
    const bg = toHex(getComputedStyle(document.body).backgroundColor);
    const pairs = ['--ink', '--ink-2', '--indigo'].map((v) => [v, contrast(cs.getPropertyValue(v).trim() || '#000000', bg)] as const);
    const worst = pairs.reduce((a, b) => (b[1] < a[1] ? b : a));
    out.push({ name: 'Text colours meet 4.5:1', ok: worst[1] >= 4.5, detail: `lowest: ${worst[0].slice(2)} at ${worst[1].toFixed(1)}:1 in this theme`, wcag: '1.4.3' });
    const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const kb = Math.round(((nav?.transferSize ?? 0) + res.reduce((s, r) => s + (r.transferSize || 0), 0)) / 1024);
    const third = new Set(res.map((r) => new URL(r.name).host).filter((h) => h && h !== location.host)).size;
    out.push({ name: 'Light page, no third-party trackers', ok: third === 0, detail: `${kb} KB transferred, ${third} other hosts`, wcag: 'Performance' });
    setRows(out);
  }
  useEffect(() => { const t = setTimeout(run, 600); return () => clearTimeout(t); }, []);
  const passed = rows?.filter((r) => r.ok).length ?? 0;
  return (
    <div className="demo">
      <div className="demo-head"><p>This page, measured in your browser</p><button type="button" className="btn ghost small" onClick={run}>Run again</button></div>
      <ul className="checks demo-body" aria-live="polite" style={{ paddingTop: 0, paddingBottom: 0 }}>
        {(rows ?? []).map((r) => (
          <li key={r.name} className={r.ok ? 'ok' : 'fail'}>
            <span className="mark" aria-hidden="true">{r.ok ? '✓' : '✕'}</span>
            <span><span className="visually-hidden">{r.ok ? 'Pass: ' : 'Fail: '}</span>{r.name} <span className="small muted">({r.wcag})</span><small>{r.detail}</small></span>
          </li>
        ))}
        {!rows && <li><span /><span>Measuring…</span></li>}
      </ul>
      <div className="tally"><span>Checks passed</span><strong>{rows ? `${passed} of ${rows.length}` : '…'}</strong></div>
    </div>
  );
}
