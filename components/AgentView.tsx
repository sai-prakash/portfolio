'use client';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { track } from '@vercel/analytics';
import { findEgg, keyState } from '@/lib/eggs';
import { isPlainKey } from '@/lib/keys';
import { contrast, effectiveBackground, parseCssColor, composite, toHex } from '@/lib/contrast';

const EVENT = 'agentview';
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const snapshot = () => document.documentElement.dataset.view === 'agent';

export function useAgentView() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

export function setAgentView(on: boolean) {
  const apply = () => {
    if (on) document.documentElement.dataset.view = 'agent';
    else delete document.documentElement.dataset.view;
    window.dispatchEvent(new Event(EVENT));
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
  else apply();
  if (on) {
    findEgg('agent');
    try { track('agent_view_on'); } catch {}
  }
}

export function toggleAgentView() {
  setAgentView(document.documentElement.dataset.view !== 'agent');
}

/** Header button. */
export function AgentToggle() {
  const on = useAgentView();
  return (
    <button type="button" className="icon-btn has-label agent-toggle" aria-pressed={on} onClick={toggleAgentView}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>
      <span className="agent-toggle-label">Agent view</span>
    </button>
  );
}

const ROLES: Record<string, string> = {
  A: 'link', BUTTON: 'button', IMG: 'img', NAV: 'navigation', HEADER: 'banner', FOOTER: 'contentinfo', MAIN: 'main',
  UL: 'list', OL: 'list', LI: 'listitem', SECTION: 'region', ARTICLE: 'article', INPUT: 'input', P: 'p', DL: 'dl', TIME: 'time', FIGURE: 'figure',
};

function describe(el: Element) {
  const tag = el.tagName;
  const role = el.getAttribute('role') || (/^H[1-6]$/.test(tag) ? `heading(${tag.toLowerCase()})` : ROLES[tag] || tag.toLowerCase());
  let name = el.getAttribute('aria-label') || el.getAttribute('alt') || '';
  if (!name && (/^H[1-6]$/.test(tag) || tag === 'A' || tag === 'BUTTON' || el.getAttribute('role') === 'button')) {
    name = (el.textContent || '').replace(/\s+/g, ' ').trim();
  }
  if (name.length > 40) name = name.slice(0, 39) + '…';
  return name ? `${role} "${name}"` : role;
}

export default function AgentView() {
  const on = useAgentView();
  const chip = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // The `a` key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'a' || !isPlainKey(e)) return;
      if (keyState.konami >= 9 || performance.now() - keyState.doneAt < 100) return; // end of the Konami code
      toggleAgentView();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Space for the bar: other fixed UI stacks above it.
  useEffect(() => {
    if (!on || !bar.current) return;
    const el = bar.current;
    const set = () => document.documentElement.style.setProperty('--bar-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => { ro.disconnect(); document.documentElement.style.removeProperty('--bar-h'); };
  }, [on]);

  // Live inspector.
  useEffect(() => {
    if (!on) return;
    const c = chip.current, b = box.current;
    if (!c || !b) return;
    const lines = Array.from(c.children) as HTMLElement[];
    let raf = 0;
    let pending: { x: number; y: number; t: Element; focus: boolean } | null = null;

    const hide = () => { c.hidden = true; b.hidden = true; };
    const inspect = (p: NonNullable<typeof pending>) => {
      let el: Element | null = p.t;
      if (!(el instanceof Element) || !el.closest('main, header, footer') || el.closest('.agent-bar, .agent-chip, dialog') || /^(MAIN|HEADER|FOOTER|BODY|HTML)$/.test(el.tagName)) { hide(); return; }
      const cs = getComputedStyle(el);
      const family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      const bg = effectiveBackground(el);
      const raw = parseCssColor(cs.color);
      const fgRgb = raw ? composite(raw, bg) : bg;
      const fg = toHex(fgRgb), bgHex = toHex(bg);
      const ratio = contrast(fg, bgHex);
      const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const pass = ratio >= (large ? 3 : 4.5);
      lines[0].textContent = describe(el);
      lines[1].textContent = `font ${family}, ${Math.round(size * 10) / 10}px, ${weight}`;
      lines[2].textContent = `colour ${fg} on ${bgHex}, ${ratio.toFixed(1)}:1 ${pass ? 'AA pass' : 'AA fail'}`;
      const r = el.getBoundingClientRect();
      b.hidden = false; c.hidden = false;
      Object.assign(b.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      const w = c.offsetWidth, h = c.offsetHeight;
      let x = p.focus ? r.left : p.x + 14;
      let y = p.focus ? r.bottom + 6 : p.y + 18;
      x = Math.max(8, Math.min(x, window.innerWidth - w - 8));
      if (y + h > window.innerHeight - 8) y = (p.focus ? r.top : p.y) - h - 10;
      c.style.left = `${x}px`;
      c.style.top = `${Math.max(8, y)}px`;
    };
    const queue = (p: NonNullable<typeof pending>) => {
      pending = p;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; const q = pending; pending = null; if (q) inspect(q); });
    };
    const onMove = (e: PointerEvent) => e.target instanceof Element && queue({ x: e.clientX, y: e.clientY, t: e.target, focus: false });
    const onFocus = (e: FocusEvent) => e.target instanceof Element && queue({ x: 0, y: 0, t: e.target, focus: true });
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) hide(); };
    hide();
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('scroll', hide, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('scroll', hide);
    };
  }, [on]);

  if (!on) return null;
  return (
    <>
      <div className="agent-hl" ref={box} aria-hidden="true" hidden />
      <div className="agent-chip" ref={chip} aria-hidden="true" hidden><div /><div /><div /></div>
      <div className="agent-bar" ref={bar} role="region" aria-label="Agent view">
        <p>You are reading this site the way a coding agent does. Same source, two readers.</p>
        <p className="agent-bar-links">
          <a href="/llms.txt">/llms.txt</a>
          <a href="/design-system.json">/design-system.json</a>
          <button type="button" onClick={() => setAgentView(false)}>Back to the human view</button>
        </p>
      </div>
    </>
  );
}
