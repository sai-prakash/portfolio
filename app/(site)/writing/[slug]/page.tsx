import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, getPost, getPosts, tagSlug } from '@/lib/content';
import Mdx from '@/components/Mdx';
import HireBox from '@/components/HireBox';
import JsonLd from '@/components/JsonLd';
import { PostList } from '@/components/Cards';
import { site, tracks } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/writing/${p.slug}` },
    keywords: p.tags,
    openGraph: { type: 'article', title: p.title, description: p.description, url: `/writing/${p.slug}`, publishedTime: p.publishedAt, modifiedTime: p.updatedAt ?? p.publishedAt, authors: [site.name], tags: p.tags },
    robots: p.status === 'draft' ? { index: false } : undefined,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const related = getPosts().filter((x) => x.slug !== p.slug && x.tags.some((t) => p.tags.includes(t))).slice(0, 3);
  return (
    <article>
      <header className="wrap article-head">
        <p className="label"><Link href="/writing">Writing</Link> / {tracks[p.track]}</p>
        <h1>{p.title}</h1>
        <p className="lede">{p.description}</p>
        <div className="byline">
          <span>By <Link href="/hire">Sai Prakash</Link></span>
          <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
          {p.updatedAt && <span>Updated {formatDate(p.updatedAt)}</span>}
          <span>{p.readingMinutes} min read</span>
          {p.status === 'draft' && <span className="pill draft">Draft</span>}
        </div>
      </header>
      <div className="wrap layout-article">
        <div>
          <Mdx source={p.body} />
          {p.tags.length > 0 && <ul className="tags" aria-label="Topics">{p.tags.map((t) => <li key={t}><Link href={`/writing/tag/${tagSlug(t)}`}>{t}</Link></li>)}</ul>}
        </div>
        <aside className="aside-sticky" aria-label="Contact"><HireBox where={`post:${p.slug}`} /></aside>
      </div>
      {related.length > 0 && (
        <section className="wrap" style={{ paddingBottom: '4rem' }} aria-labelledby="rel-h">
          <h2 id="rel-h" style={{ marginBottom: '1rem' }}>Related</h2>
          <PostList posts={related} />
        </section>
      )}
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description,
        datePublished: p.publishedAt, dateModified: p.updatedAt ?? p.publishedAt, keywords: p.tags.join(', '),
        author: { '@type': 'Person', name: site.name, url: site.url }, mainEntityOfPage: `${site.url}/writing/${p.slug}`,
      }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Writing', item: `${site.url}/writing` },
        { '@type': 'ListItem', position: 2, name: p.title, item: `${site.url}/writing/${p.slug}` },
      ] }} />
    </article>
  );
}
