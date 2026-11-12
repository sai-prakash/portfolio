import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCase, getWork, stateLabel } from '@/lib/content';
import Mdx from '@/components/Mdx';
import HireBox from '@/components/HireBox';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCase((await params).slug);
  if (!c) return {};
  return {
    title: `${c.title}: ${c.headline}`,
    description: c.description,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: { type: 'article', title: c.headline || c.title, description: c.description, url: `/work/${c.slug}` },
    robots: c.status === 'draft' ? { index: false } : undefined,
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  if (!c) notFound();
  return (
    <article>
      <header className="wrap article-head">
        <p className="label"><Link href="/work">Work</Link> / {c.org}</p>
        <h1>{c.headline || c.title}</h1>
        <p className="lede">{c.description}</p>
        <dl className="facts" style={{ maxWidth: '40rem', marginTop: '1.6rem' }}>
          <dt>Project</dt><dd>{c.title}</dd>
          {c.role && (<><dt>My role</dt><dd>{c.role}</dd></>)}
          {c.period && (<><dt>When</dt><dd>{c.period}</dd></>)}
          <dt>State</dt><dd>{stateLabel[c.state]}{c.status === 'draft' ? ' (draft page)' : ''}</dd>
          {c.metric && (<><dt>Result</dt><dd>{c.metric} {c.metricLabel}</dd></>)}
        </dl>
      </header>
      <div className="wrap layout-article">
        <Mdx source={c.body} />
        <aside className="aside-sticky" aria-label="Contact"><HireBox where={`case:${c.slug}`} /></aside>
      </div>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: c.title, headline: c.headline, description: c.description, author: { '@type': 'Person', name: site.name, url: site.url }, url: `${site.url}/work/${c.slug}` }} />
    </article>
  );
}
