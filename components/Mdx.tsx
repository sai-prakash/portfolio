import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { ReactNode } from 'react';
import DemoRenderer from './demos/DemoRenderer';

const showDrafts = process.env.SHOW_DRAFTS === '1' || process.env.NODE_ENV === 'development';

function BeforeAfter({ label, before, after, unit = 'min' }: { label?: string; before: number; after: number; unit?: string }) {
  const pct = Math.round((1 - after / before) * 100);
  return (
    <div className="before-after" role="img" aria-label={`${label ?? 'Measured'}: ${before} ${unit} before, ${after} ${unit} after, ${pct}% less.`}>
      <p aria-hidden="true" style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>{label}</p>
      <div className="bars" aria-hidden="true">
        <div className="bar"><span>Before</span><i style={{ width: '100%' }} /><span>{before} {unit}</span></div>
        <div className="bar after"><span>After</span><i style={{ width: `${(after / before) * 100}%` }} /><span>{after} {unit}</span></div>
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
  Figure: ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  ),
  Callout: ({ tone = 'note', children }: { tone?: string; children: ReactNode }) => <div className={`callout ${tone}`}>{children}</div>,
  EditorNote: ({ children }: { children: ReactNode }) => (showDrafts ? <aside className="editor-note">{children}</aside> : null),
};

export default function Mdx({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
    </div>
  );
}
