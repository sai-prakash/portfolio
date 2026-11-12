'use client';
import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { findEgg } from '@/lib/eggs';
import { isPlainKey } from '@/lib/keys';

/**
 * The hero headline as three tanpura strings, tuned Pa, Sa (high), Sa.
 * Silent until the visitor turns sound on. Moving the pointer across a line plucks it.
 * Turning sound on strums all three, so keyboard users hear it too. Respects reduced motion (no wobble).
 */
const LINES = [
  { text: 'Built for people.', swara: 'Pa', ratio: 1.5 },
  { text: 'Read by agents.', swara: 'Sa', ratio: 2, machine: true },
  { text: 'Proven in production.', swara: 'Sa', ratio: 1 },
];
const BASE = 138.59; // C#3, a common tanpura Sa
// Just-intonation ratios from Sa. Keys: s r g m p d n.
const SARGAM: Record<string, number> = { s: 1, r: 9 / 8, g: 5 / 4, m: 4 / 3, p: 3 / 2, d: 5 / 3, n: 15 / 8 };
const ORDER = ['s', 'r', 'g', 'm', 'p', 'd', 'n'];

export default function HeadlineStrings() {
  const [on, setOn] = useState(false);
  const [ringing, setRinging] = useState<number | null>(null);
  const ac = useRef<AudioContext | null>(null);
  const onRef = useRef(false);
  const last = useRef<number[]>([0, 0, 0]);

  const plucked = useRef<Set<number>>(new Set());
  const progress = useRef(0);

  useEffect(() => () => { ac.current?.close().catch(() => {}); }, []);

  /** The pluck voice: a triangle fundamental plus slightly detuned harmonics, a hint of the tanpura's buzz. */
  function voice(f: number) {
    const ctx = ac.current;
    if (!ctx || !onRef.current) return;
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    out.connect(ctx.destination);
    [1, 2, 3, 4.01, 5.02].forEach((h, k) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = k === 0 ? 'triangle' : 'sine';
      o.frequency.value = f * h;
      g.gain.value = [0.6, 0.35, 0.22, 0.14, 0.1][k];
      o.connect(g).connect(out);
      o.start(now);
      o.stop(now + 3.3);
    });
  }

  function pluck(i: number, byVisitor = true) {
    const ctx = ac.current;
    if (!ctx || !onRef.current) return;
    const now = ctx.currentTime;
    if (now - last.current[i] < 0.15) return;
    last.current[i] = now;
    voice(BASE * LINES[i].ratio);
    if (byVisitor) {
      plucked.current.add(i);
      if (plucked.current.size === LINES.length) findEgg('strum');
    }
    setRinging(i);
    setTimeout(() => setRinging((r) => (r === i ? null : r)), 900);
  }

  // Sargam: with sound on, s r g m p d n play Sa to Ni. Pressing them in order finds an egg.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!onRef.current || !isPlainKey(e)) return;
      const k = e.key.toLowerCase();
      if (!(k in SARGAM)) return;
      voice(BASE * 2 * SARGAM[k]);
      if (k === ORDER[progress.current]) {
        progress.current += 1;
        if (progress.current === ORDER.length) { progress.current = 0; findEgg('sargam'); }
      } else {
        progress.current = k === 's' ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const next = !onRef.current;
    if (next) {
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ac.current ??= new AC();
        void ac.current.resume();
      } catch {
        return;
      }
      try { track('sound_on'); } catch {}
    }
    onRef.current = next;
    setOn(next);
    if (next) [0, 1, 2].forEach((i, k) => setTimeout(() => pluck(i, false), 60 + k * 420));
  }

  return (
    <div className="strings">
      <h1 aria-label="Built for people. Read by agents. Proven in production.">
        {LINES.map((l, i) => (
          <span key={l.text} className={`string-line${l.machine ? ' machine' : ''}${ringing === i ? ' ringing' : ''}`} onPointerEnter={() => pluck(i)} aria-hidden="true">
            {l.text}
            <i className="string-wire" />
            <small className="swara">{l.swara}</small>
          </span>
        ))}
      </h1>
      <button type="button" className="btn ghost small sound-btn" aria-pressed={on} onClick={toggle}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />{on && <path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a8.5 8.5 0 0 1 0 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
        {on ? 'Sound on: run your pointer across the headline, or press s r g m p d n' : 'Sound off, tuned like a tanpura'}
      </button>
    </div>
  );
}
