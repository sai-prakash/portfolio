'use client';
import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';

const BASE = 138.59 * 2; // C#4. The kolam's bead plays notes above this tonic.

/** Opt-in sound for the kolam. Off until the visitor turns it on; nothing plays or loads before that. */
export default function Tanpura() {
  const [on, setOn] = useState(false);
  const ac = useRef<AudioContext | null>(null);
  const onRef = useRef(false);

  useEffect(() => {
    const note = (e: Event) => {
      const ctx = ac.current;
      if (!ctx || !onRef.current) return;
      const f = BASE * ((e as CustomEvent<number>).detail || 1);
      const now = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, now);
      out.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
      out.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      out.connect(ctx.destination);
      [1, 2, 3, 4.01].forEach((h, k) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = k === 0 ? 'triangle' : 'sine';
        o.frequency.value = f * h;
        g.gain.value = [0.6, 0.35, 0.22, 0.14][k];
        o.connect(g).connect(out);
        o.start(now);
        o.stop(now + 2.5);
      });
    };
    window.addEventListener('sai:note', note);
    return () => { window.removeEventListener('sai:note', note); ac.current?.close().catch(() => {}); };
  }, []);

  function toggle() {
    const next = !onRef.current;
    if (next) {
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ac.current ??= new AC();
        void ac.current.resume();
      } catch { return; }
      try { track('sound_on'); } catch {}
    }
    onRef.current = next;
    setOn(next);
  }

  return (
    <button type="button" className="textlink sound-btn" aria-pressed={on} onClick={toggle}>
      {on ? 'Sound on' : 'Sound off'}
    </button>
  );
}
