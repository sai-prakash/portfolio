import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getTags, tagSlug } from '@/lib/content';
import { PostList } from '@/components/Cards';

export const dynamicParams = false;
export function generateStaticParams() {
  const tags = getTags();
  return tags.length ? tags.map((t) => ({ tag: t.slug })) : [{ tag: 'none' }];
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const t = getTags().find((x) => x.slug === tag);
  if (!t) return {};
  return { title: `Articles about ${t.tag}`, description: `Sai Prakash's writing about ${t.tag}.`, alternates: { canonical: `/writing/tag/${t.slug}` } };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const slug = (await params).tag;
  const t = getTags().find((x) => x.slug === slug);
  if (!t) notFound();
  const posts = getPosts().filter((p) => p.tags.some((x) => tagSlug(x) === slug));
  return (
    <div className="wrap section">
      <p className="label"><Link href="/writing">Writing</Link></p>
      <h1>Articles about {t.tag}</h1>
      <h2 className="visually-hidden">Articles</h2>
      <div style={{ marginTop: '2rem' }}><PostList posts={posts} /></div>
    </div>
  );
}
