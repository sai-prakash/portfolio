'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { track } from '@vercel/analytics';

/**
 * The hero is one page with two readers. A haldi string splits it:
 * left of the string is what a person reads, right is the same content as an agent reads it.
 * Drag the string, or focus it and use the arrow keys.
 */
export default function SeamHero({ human, agent }: { human: ReactNode; agent: ReactNode }) {
  const [pos, setPos] = useState(100);
  const [ring, setRing] = useState(false);
  const root = useRef<HTMLElement>(null);
  const dragging = useRef(false);
  const tracked = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 900px)').matches;
    const rest = narrow ? 97 : 56;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPos(rest); return; }
    const peek = narrow ? 62 : rest;
    const t0 = performance.now() + 450;
    const ease = (p: number) => 1 - Math.pow(1 - p, 3);
    const step = (t: number) => {
      const a = Math.max(0, Math.min(1, (t - t0) / 1100));
      const b = Math.max(0, Math.min(1, (t - t0 - 1500) / 800));
      const v = 100 - (100 - peek) * ease(a) + (rest - peek) * ease(b);
      setPos(v);
      if (b < 1 && !dragging.current) raf.current = requestAnimationFrame(step);
      else if (!dragging.current) setRing(true);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  function move(clientX: number) {
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(5, Math.min(97, ((clientX - r.left) / r.width) * 100)));
  }
  function used() {
    if (tracked.current) return;
    tracked.current = true;
    try { track('seam_move'); } catch {}
  }

  return (
    <section className="dual" ref={root} style={{ ['--dual' as string]: `${pos}%` }} aria-label="Introduction">
      <div className="dual-agent" aria-hidden="true" inert>{agent}</div>
      <div className="dual-human">{human}</div>
      <div
        className={`dual-handle${ring ? ' ring' : ''}`}
        onAnimationEnd={() => setRing(false)}
        onPointerDown={(e) => {
          cancelAnimationFrame(raf.current);
          dragging.current = true;
          setRing(false);
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e.clientX);
        }}
        onPointerMove={(e) => { if (dragging.current) move(e.clientX); }}
        onPointerUp={() => { dragging.current = false; setRing(true); used(); }}
        onPointerCancel={() => { dragging.current = false; }}
      >
        <span className="dual-tag l" aria-hidden="true">What you read</span>
        <span className="dual-tag r" aria-hidden="true">What an agent reads</span>
        <span className="dual-knob">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <input
            type="range"
            min={5}
            max={97}
            step={1}
            value={Math.round(Math.min(97, Math.max(5, pos)))}
            aria-label="Move the string between the human view and the agent view"
            aria-valuetext={`${Math.round(pos)} percent human view, ${100 - Math.round(pos)} percent agent view`}
            onChange={(e) => { cancelAnimationFrame(raf.current); dragging.current = false; setPos(Number(e.target.value)); used(); }}
          />
        </span>
      </div>
    </section>
  );
}
