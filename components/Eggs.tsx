'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EGGS, findEgg, getFound, keyState, type EggId } from '@/lib/eggs';
import { site } from '@/lib/site';
import { isTypingTarget } from '@/lib/keys';

declare global {
  interface Window {
    sai?: { hire: () => string };
    __saiLogged?: boolean;
  }
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function Eggs() {
  const [msg, setMsg] = useState('');
  const [kolam, setKolam] = useState(false);
  const done = useCallback(() => setKolam(false), []);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const show = (text: string) => {
      setMsg(text);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(''), 4000);
    };
    const onEgg = (e: Event) => {
      const id = (e as CustomEvent<EggId>).detail;
      const egg = EGGS.find((x) => x.id === id);
      if (egg) show(`Found: ${egg.title}. ${getFound().length} of ${EGGS.length}.`);
    };
    const onToast = (e: Event) => show(String((e as CustomEvent).detail));
    window.addEventListener('egg', onEgg);
    window.addEventListener('sai:toast', onToast);

    // Konami code.
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const i = keyState.konami;
      if (k === KONAMI[i]) {
        keyState.konami = i + 1;
        if (keyState.konami === KONAMI.length) {
          keyState.konami = 0;
          keyState.doneAt = performance.now();
          findEgg('kolam');
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setKolam(true);
        }
      } else {
        keyState.konami = k === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);

    // Console pitch and sai.hire().
    window.sai = {
      hire() {
        findEgg('console');
        console.log(`%c${site.email}`, 'font:600 13px monospace;color:#2E3BC4');
        window.open(`mailto:${site.email}`, '_self');
        return site.email;
      },
    };
    if (!window.__saiLogged) {
      window.__saiLogged = true;
      console.log(
        `%c${site.name}%c\nStaff Design Engineer and Applied AI Engineer.\nI ship LLM products and make design systems legible to coding agents.\nType sai.hire() to reach me.`,
        'font:700 20px Georgia,serif;color:#2E3BC4;padding:4px 0',
        'font:13px/1.5 monospace;color:#4B5180',
      );
    }

    return () => {
      window.removeEventListener('egg', onEgg);
      window.removeEventListener('sai:toast', onToast);
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer.current);
      delete window.sai;
    };
  }, []);

  return (
    <>
      <div className="egg-toast" role="status" data-show={msg ? 'true' : 'false'}>{msg}</div>
      {kolam && <KolamCanvas onDone={done} />}
    </>
  );
}

function KolamCanvas({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const col = { indigo: css.getPropertyValue('--indigo').trim() || '#2E3BC4', haldi: css.getPropertyValue('--haldi').trim() || '#F5B82E', kumkum: css.getPropertyValue('--kumkum').trim() || '#B8322A' };
    const N = 8;
    const s = Math.min(W, H) / (N * 2 + 3);
    const cx = W / 2, cy = H / 2;
    const dots: { x: number; y: number; ring: number; d: number }[] = [];
    for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
      if (Math.abs(i) + Math.abs(j) <= N && (i + j) % 2 === 0) dots.push({ x: i, y: j, ring: (Math.abs(i) + Math.abs(j)) / 2, d: Math.hypot(i, j) });
    }
    const maxD = Math.max(...dots.map((d) => d.d));
    const ringCols = [col.indigo, col.kumkum, col.haldi];
    const t0 = performance.now();
    let raf = 0;
    const frame = (t: number) => {
      const p = Math.min(1, (t - t0) / 3000);
      ctx.clearRect(0, 0, W, H);
      const fade = p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;
      const reveal = Math.min(1, p / 0.7) * (maxD + 1.5);
      ctx.lineWidth = Math.max(1.5, s * 0.07);
      ctx.lineCap = 'round';
      for (const d of dots) {
        const a = Math.max(0, Math.min(1, reveal - d.d)) * fade;
        if (a <= 0) continue;
        ctx.globalAlpha = a * 0.9;
        const px = cx + (d.x * s) / 2 * 1.4, py = cy + (d.y * s) / 2 * 1.4;
        const r = s * 0.42;
        // Four petals around each dot: the loop that closes the kolam.
        ctx.strokeStyle = ringCols[d.ring % 2];
        ctx.beginPath();
        for (let q = 0; q < 4; q++) {
          const ang = (q * Math.PI) / 2;
          const ox = Math.cos(ang) * r * 0.5, oy = Math.sin(ang) * r * 0.5;
          ctx.moveTo(px + ox + r * 0.5, py + oy);
          ctx.arc(px + ox, py + oy, r * 0.5, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fillStyle = col.haldi;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(2, s * 0.07), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (p < 1) raf = requestAnimationFrame(frame);
      else onDone();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return <canvas ref={ref} className="kolam-canvas" aria-hidden="true" />;
}
