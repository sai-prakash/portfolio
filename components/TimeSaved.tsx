'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { findEgg } from '@/lib/eggs';

const BEFORE = 218;
const AFTER = 37;

export default function TimeSaved() {
  const id = useId();
  const [v, setV] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const played = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setV(100);
      return;
    }
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting || played.current) return;
      played.current = true;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setV(100 * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, []);

  const minutes = Math.round(BEFORE - ((BEFORE - AFTER) * v) / 100);
  const saved = BEFORE - minutes;
  const pct = Math.round((saved / BEFORE) * 100);
  const keep = (minutes / BEFORE) * 100;

  return (
    <div className="timesaved" ref={root}>
      <p className="stat">
        <span>{minutes}</span> <small>minutes</small>
      </p>
      <div className="ts-bar" aria-hidden="true">
        <i className="ts-keep" style={{ width: `${keep}%` }} />
        <i className="ts-cut" style={{ left: `${keep}%` }} />
      </div>
      <p className="ts-saved">{saved} minutes back, {pct}% less</p>
      <div className="ts-slider">
        <label htmlFor={id}>Drag from before to after</label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(v)}
          aria-valuetext={`${minutes} minutes, ${saved} minutes back`}
          onChange={(e) => {
            cancelAnimationFrame(raf.current);
            played.current = true;
            const n = Number(e.target.value);
            setV(n);
            if (n >= 100) findEgg('time');
          }}
        />
        <span className="ts-ends" aria-hidden="true"><span>Before: {BEFORE} minutes</span><span>After: {AFTER} minutes</span></span>
      </div>
    </div>
  );
}
