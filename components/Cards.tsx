import Link from 'next/link';
import { formatDate, stateLabel, type CaseStudy, type Post } from '@/lib/content';

export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <article className="card" data-track={c.track} data-spot>
      <p className="label" style={{ margin: 0 }}>{c.org}</p>
      <h3 data-href={`/work/${c.slug}`}><Link href={`/work/${c.slug}`}>{c.headline || c.title}</Link></h3>
      <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-m)' }}>{c.title}</p>
      <div className="meta">
        <span className={`pill ${c.state}`}>{stateLabel[c.state]}</span>
        {c.status === 'draft' && <span className="pill draft">Draft</span>}
      </div>
    </article>
  );
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p.slug} data-track={p.track}>
          <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
          <div>
            <h3><Link href={`/writing/${p.slug}`}>{p.title}</Link></h3>
            <p>{p.description}</p>
            <p className="small" style={{ marginTop: '0.4rem' }}>{p.readingMinutes} min read{p.status === 'draft' ? ' · ' : ''}{p.status === 'draft' && <span className="pill draft">Draft</span>}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
