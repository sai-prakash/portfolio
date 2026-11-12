'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { diamond, key, trace } from '@/lib/kolam';

/**
 * A playable kolam. Every dot is a rule; the line is what gets built, and it has to pass every rule
 * without touching one. Tap a point to add or remove a rule and the line re-routes.
 * A bead travels the line and plays a note each time it rounds a rule (when the headline sound is on).
 */
const N = 9, S = 56, PAD = 40, SIZE = PAD * 2 + (N - 1) * S;
const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4, 5 / 2, 3];
const RULES = [
  'every field has a label', 'one primary action per view', 'colour comes from a token', 'text contrast is at least 4.5 to 1',
  'buttons say what will happen', 'everything works from the keyboard', 'spacing comes from the scale', 'headings go in order',
  'focus is always visible', 'motion can be turned off', 'components come from the system', 'errors say how to fix them',
];
const start = () => diamond(7, N);

export default function Kolam() {
  const [dots, setDots] = useState<Set<string>>(start);
  const [cur, setCur] = useState({ c: 4, r: 4 });
  const [intro, setIntro] = useState(true);
  const [note, setNote] = useState('');
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const beads = useRef<(SVGCircleElement | null)[]>([]);
  const dotEls = useRef(new Map<string, SVGCircleElement>());
  const ruleNo = useRef(0);
  const painting = useRef<null | boolean>(null);
  const flags = useRef({ edited: false, won: false });

  const loops = useMemo(() => trace(dots, S, PAD), [dots]);
  const one = loops.length === 1 && dots.size > 1;

  useEffect(() => { const t = setTimeout(() => setIntro(false), 2600); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (one && flags.current.edited && !flags.current.won) { flags.current.won = true; try { track('kolam_one_line', { rules: String(dots.size) }); } catch {} }
  }, [one, dots]);

  // The bead: travels each line, lights the rule it rounds and asks the headline to play a note.
  useEffect(() => {
    if (intro || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, last = performance.now(), visible = true, lastNote = 0;
    const pos = loops.map(() => 0);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (svg.current) io.observe(svg.current);
    const step = (now: number) => {
      const dt = Math.min(64, now - last); last = now;
      if (visible && !document.hidden) {
        loops.slice(0, 3).forEach((lp, i) => {
          const el = paths.current[i], bead = beads.current[i];
          if (!el || !bead || !lp.length) return;
          const prev = pos[i];
          const next = prev + (dt / 1000) * 150;
          for (const t of lp.turns) {
            const hit = (t.at > prev && t.at <= next) || (next > lp.length && t.at <= next - lp.length);
            if (!hit) continue;
            dotEls.current.get(key(t.c, t.r))?.animate([{ transform: 'scale(2.4)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'ease-out' });
            if (now - lastNote > 200) { lastNote = now; window.dispatchEvent(new CustomEvent('sai:note', { detail: SCALE[N - 1 - t.r] })); }
          }
          pos[i] = next % lp.length;
          const p = el.getPointAtLength((pos[i] / lp.length) * el.getTotalLength());
          bead.setAttribute('cx', String(p.x)); bead.setAttribute('cy', String(p.y));
        });
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [loops, intro]);

  function set(c: number, r: number, on?: boolean) {
    if (c < 0 || r < 0 || c >= N || r >= N) return;
    setDots((prev) => {
      const k = key(c, r), has = prev.has(k), want = on ?? !has;
      if (want === has) return prev;
      const next = new Set(prev);
      if (want) { next.add(k); setNote(`Added a rule: ${RULES[ruleNo.current++ % RULES.length]}.`); } else { next.delete(k); setNote('Removed a rule.'); }
      return next;
    });
    setIntro(false);
    if (!flags.current.edited) { flags.current.edited = true; try { track('kolam_edit'); } catch {} }
  }
  function cell(e: React.PointerEvent) {
    const b = svg.current!.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * SIZE, y = ((e.clientY - b.top) / b.height) * SIZE;
    return { c: Math.round((x - PAD) / S), r: Math.round((y - PAD) / S) };
  }
  function surprise() {
    const next = new Set<string>(), m = (N - 1) / 2;
    for (let r = 0; r <= m; r++) for (let c = 0; c <= m; c++) {
      if (Math.random() < 0.34 + 0.11 * (c + r)) for (const [a, b] of [[c, r], [N - 1 - c, r], [c, N - 1 - r], [N - 1 - c, N - 1 - r]]) next.add(key(a, b));
    }
    next.add(key(m, m));
    setDots(next); setIntro(false); setNote('A new pattern.');
  }

  const status = dots.size === 0 ? 'No rules, nothing to build.' : `${dots.size} ${dots.size === 1 ? 'rule' : 'rules'}, ${loops.length} ${loops.length === 1 ? 'line' : 'lines'}.`;

  return (
    <div className={`kolam${one ? ' one' : ''}`}>
      <div
        className="kolam-board"
        tabIndex={0}
        role="application"
        aria-label="Kolam board. Arrow keys move, space adds or removes a rule."
        onKeyDown={(e) => {
          const mv: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
          if (e.key in mv) { e.preventDefault(); const [dc, dr] = mv[e.key]; setCur((p) => ({ c: Math.max(0, Math.min(N - 1, p.c + dc)), r: Math.max(0, Math.min(N - 1, p.r + dr)) })); }
          else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); set(cur.c, cur.r); }
        }}
      >
        <svg
          ref={svg}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          onPointerDown={(e) => {
            const { c, r } = cell(e);
            if (c < 0 || r < 0 || c >= N || r >= N) return;
            if (e.pointerType === 'mouse') { painting.current = !dots.has(key(c, r)); e.currentTarget.setPointerCapture(e.pointerId); }
            setCur({ c, r }); set(c, r);
          }}
          onPointerMove={(e) => { if (painting.current !== null) { const { c, r } = cell(e); set(c, r, painting.current); } }}
          onPointerUp={() => { painting.current = null; }}
          onPointerCancel={() => { painting.current = null; }}
        >
          {Array.from({ length: N * N }, (_, i) => <circle key={i} className="k-ghost" cx={PAD + (i % N) * S} cy={PAD + Math.floor(i / N) * S} r="2" />)}
          {loops.map((lp, i) => <path key={`${i}-${lp.d.length}`} ref={(el) => { paths.current[i] = el; }} className={`k-line l${Math.min(i, 3)}${intro ? ' draw' : ''}`} d={lp.d} pathLength={intro ? 1 : undefined} />)}
          {[...dots].map((k) => { const [c, r] = k.split(',').map(Number); return <circle key={k} ref={(el) => { if (el) dotEls.current.set(k, el); else dotEls.current.delete(k); }} className="k-dot" cx={PAD + c * S} cy={PAD + r * S} r="4.5" />; })}
          {!intro && loops.slice(0, 3).map((_, i) => <circle key={i} ref={(el) => { beads.current[i] = el; }} className="k-bead" r="6" cx="-20" cy="-20" />)}
          <circle className="k-cursor" cx={PAD + cur.c * S} cy={PAD + cur.r * S} r="15" />
        </svg>
      </div>
      <div className="kolam-foot">
        <p className="kolam-status"><strong>{status}</strong> {one ? 'One unbroken line through every rule. That is the job.' : 'Can you make it one line?'}</p>
        <p className="kolam-note" aria-live="polite">{note || 'Every dot is a rule. The line is what an agent builds. Tap to add or remove a rule. Turn the sound on to hear it.'}</p>
        <div className="row">
          <button type="button" className="k-btn" onClick={surprise}>Surprise me</button>
          <button type="button" className="k-btn" onClick={() => { setDots(start()); setNote('Back to the start.'); }}>Start over</button>
          <details className="k-hint"><summary>Hint</summary><p>Try a rectangle of dots whose sides share no common factor, such as 4 by 5.</p></details>
        </div>
      </div>
    </div>
  );
}
