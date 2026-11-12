'use client';
import { useState } from 'react';

const tokens: Record<string, string> = {
  'ink': '#12163A', 'ink-2': '#4B5180', 'indigo': '#2E3BC4', 'haldi': '#F5B82E', 'kumkum': '#B8322A',
  'paper': '#EAEDF7', 'card': '#FFFFFF', 'line': '#C6CBE6', 'muted-grey': '#9AA0BF',
};
function lum(hex: string) {
  const c = hex.slice(1).match(/../g)!.map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

export default function ContrastChecker() {
  const [fg, setFg] = useState('ink-2');
  const [bg, setBg] = useState('paper');
  const ratio = contrast(tokens[fg], tokens[bg]);
  const rows: [string, number][] = [['Body text (AA)', 4.5], ['Large text (AA)', 3], ['Body text (AAA)', 7]];
  return (
    <div className="demo-body">
      <div className="grid-2">
        <div className="field"><label htmlFor="cc-fg">Text token</label>
          <select id="cc-fg" value={fg} onChange={(e) => setFg(e.target.value)}>{Object.keys(tokens).map((t) => <option key={t}>{t}</option>)}</select></div>
        <div className="field"><label htmlFor="cc-bg">Background token</label>
          <select id="cc-bg" value={bg} onChange={(e) => setBg(e.target.value)}>{Object.keys(tokens).map((t) => <option key={t}>{t}</option>)}</select></div>
      </div>
      <div style={{ marginTop: '1rem', background: tokens[bg], color: tokens[fg], padding: '1.1rem', borderRadius: 10, border: '1px solid var(--line)' }}>
        <strong style={{ fontSize: '1.3rem' }}>Approve payment</strong>
        <p style={{ margin: '0.3rem 0 0' }}>The quick check every token pair should pass.</p>
      </div>
      <p aria-live="polite" style={{ margin: '1rem 0 0.4rem' }}><strong style={{ fontFamily: 'var(--f-display)', fontSize: '1.8rem' }}>{ratio.toFixed(2)} : 1</strong></p>
      <ul className="checks">
        {rows.map(([name, min]) => (
          <li key={name} className={ratio >= min ? 'ok' : 'fail'}>
            <span className="mark" aria-hidden="true">{ratio >= min ? '✓' : '✕'}</span>
            <span><span className="visually-hidden">{ratio >= min ? 'Pass: ' : 'Fail: '}</span>{name}<small>Needs {min} : 1</small></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
