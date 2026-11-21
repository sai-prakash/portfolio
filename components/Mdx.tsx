import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { ReactNode } from 'react';
import DemoRenderer from './demos/DemoRenderer';
import { clearedMetric } from '@/lib/facts';

/** A cleared number, from content/facts.json. Renders the fallback text (or nothing) until Sai has cleared it. */
function Metric({ id, fallback }: { id: string; fallback?: string }) {
  const m = clearedMetric(id);
  return <>{m ? m.value : fallback ?? null}</>;
}

/** Before/after bars. Renders only when the fact is cleared and both numbers are finite, so it can never show NaN or an empty value. */
function BeforeAfter({ fact, label, before, after, unit = 'min' }: { fact: string; label?: string; before: string | number; after: string | number; unit?: string }) {
  const b = Number(before);
  const a = Number(after);
  if (!clearedMetric(fact) || !Number.isFinite(b) || !Number.isFinite(a) || b <= 0 || a < 0) return null;
  const pct = Math.round((1 - a / b) * 100);
  return (
    <div className="before-after" role="img" aria-label={`${label ?? 'Measured'}: ${b} ${unit} before, ${a} ${unit} after, ${pct}% less.`}>
      <p aria-hidden="true" style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>{label}</p>
      <div className="bars" aria-hidden="true">
        <div className="bar"><span>Before</span><i style={{ width: '100%' }} /><span>{b} {unit}</span></div>
        <div className="bar after"><span>After</span><i style={{ width: `${(a / b) * 100}%` }} /><span>{a} {unit}</span></div>
      </div>
      <p className="result" aria-hidden="true">{pct}% less</p>
    </div>
  );
}

const components = {
  Demo: ({ name, caption }: { name: string; caption?: string }) => <DemoRenderer name={name} caption={caption} />,
  Embed: ({ src, title, height = 480 }: { src: string; title: string; height?: number }) => (
    <figure>
      <iframe className="embed" src={src} title={title} height={height} loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerPolicy="no-referrer" />
      <figcaption><a href={src}>Open “{title}” in a new tab</a></figcaption>
    </figure>
  ),
  BeforeAfter,
  Metric,
  Figure: ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  ),
  Callout: ({ tone = 'note', children }: { tone?: string; children: ReactNode }) => <div className={`callout ${tone}`}>{children}</div>,
  EditorNote: () => null,
};

export default function Mdx({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
    </div>
  );
}
