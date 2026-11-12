import type { Metadata } from 'next';
import Link from 'next/link';
import { colors, radius, rules, space, type } from '@/lib/tokens';
import { contrast } from '@/lib/contrast';
import { SYSTEM_PROMPT } from '@/lib/playground';
import CopyButton from '@/components/CopyButton';

export const metadata: Metadata = {
  title: 'The system this site is made of',
  description: 'The design tokens, type scale and component rules behind this site, the same spec agents get as a compact prompt and as JSON.',
  alternates: { canonical: '/system' },
};

export default function SystemPage() {
  const paper = colors.find((c) => c.name === 'paper')!;
  return (
    <div className="wrap section">
      <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em', maxWidth: '16ch' }}>The system this site is made of.</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>Every colour, size and component here comes from one system. People read it on this page; agents get the same thing as a <Link href="/design-system.json">JSON file</Link> or a compact prompt.</p>
      <div className="row" style={{ marginTop: '1.2rem' }}><CopyButton text={SYSTEM_PROMPT} label="Copy the agent prompt" /><Link className="btn ghost small" href="/design-system.json">Open design-system.json</Link></div>

      <h2 style={{ marginTop: '3.5rem' }}>Colour</h2>
      <p className="muted">Contrast is measured against the page background, in both themes.</p>
      <div className="grid-3" style={{ marginTop: '1.2rem' }}>
        {colors.map((c) => {
          const r = contrast(c.light, paper.light);
          return (
            <div className="card" key={c.name} style={{ gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
                <span style={{ flex: 1, height: 48, borderRadius: 8, background: c.light, border: '1px solid var(--line)' }} />
                <span style={{ flex: 1, height: 48, borderRadius: 8, background: c.dark, border: '1px solid var(--line)' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--f-mono)' }}>{c.name}</h3>
              <p className="small muted" style={{ margin: 0 }}>{c.use}</p>
              <p className="small" style={{ margin: 0 }}>{c.light} / {c.dark} · {r.toFixed(1)}:1 on paper</p>
            </div>
          );
        })}
      </div>

      <h2 style={{ marginTop: '3.5rem' }}>Type</h2>
      <table className="prose" style={{ maxWidth: 'none', display: 'table', marginTop: '1rem' }}>
        <thead><tr><th scope="col">Token</th><th scope="col">Size</th><th scope="col">Face</th><th scope="col">Use</th></tr></thead>
        <tbody>{type.map((t) => <tr key={t.name}><td><code>{t.name}</code></td><td><code>{t.value}</code></td><td>{t.font}</td><td>{t.use}</td></tr>)}</tbody>
      </table>

      <h2 style={{ marginTop: '3.5rem' }}>Space and shape</h2>
      <div className="row" style={{ alignItems: 'flex-end', marginTop: '1rem' }} aria-label="Spacing scale in pixels">
        {space.map((s) => <div key={s} style={{ textAlign: 'center' }}><div style={{ width: s, height: s, background: 'var(--indigo)', borderRadius: 3 }} aria-hidden="true" /><span className="small">{s}</span></div>)}
      </div>
      <p className="small muted" style={{ marginTop: '1rem' }}>Radius: {radius.map((r) => `${r.name} ${r.value}`).join(', ')}.</p>

      <h2 style={{ marginTop: '3.5rem' }}>Components, one rule each</h2>
      <ul className="post-list" style={{ marginTop: '1rem' }}>
        {rules.map((r) => <li key={r.component}><span className="small" style={{ fontWeight: 600 }}>{r.component}</span><div><p style={{ margin: 0, color: 'var(--ink)' }}>{r.rule}</p></div></li>)}
      </ul>
      <p style={{ marginTop: '2rem' }}>See an agent build with these rules in the <Link href="/playground">playground</Link>.</p>
    </div>
  );
}
