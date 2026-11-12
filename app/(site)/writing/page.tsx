import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getTags } from '@/lib/content';
import { PostList } from '@/components/Cards';

export const metadata: Metadata = {
  title: 'Writing: design systems for AI agents, LLM products and evaluation',
  description: 'Articles by Sai Prakash on agent-readable design systems, MCP, evaluating AI-generated UI, in-browser LLMs with WebGPU, accessibility and design engineering careers.',
  alternates: { canonical: '/writing' },
};

export default function WritingIndex() {
  const posts = getPosts();
  const tags = getTags();
  return (
    <div className="wrap section">
      <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em' }}>Writing</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>Notes from building AI products and design systems that agents can use. Every article is checked against what I&apos;ve actually shipped.</p>
      {tags.length > 0 && (
        <nav aria-label="Topics"><ul className="tags">{tags.map((t) => <li key={t.slug}><Link href={`/writing/tag/${t.slug}`}>{t.tag} ({t.count})</Link></li>)}</ul></nav>
      )}
      <h2 className="visually-hidden">All articles</h2>
      <div style={{ marginTop: '2.5rem' }}>{posts.length ? <PostList posts={posts} /> : <p className="muted">New articles are on the way.</p>}</div>
    </div>
  );
}
