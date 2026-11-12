import type { Metadata } from 'next';
import { getWork } from '@/lib/content';
import { CaseCard } from '@/components/Cards';

export const metadata: Metadata = {
  title: 'Work: case studies in applied AI and design engineering',
  description: 'Case studies from Sai Prakash: LLM products in production at JPMorgan Chase, design systems that coding agents can read, and checks that grade AI-generated UI.',
  alternates: { canonical: '/work' },
};

export default function WorkIndex() {
  const work = getWork();
  return (
    <div className="wrap section">
      <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em' }}>Work</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>Bank work is described at the level I can share in public. I&apos;m glad to go deeper in a conversation.</p>
      <h2 className="visually-hidden">Case studies</h2>
      <div className="grid-3" style={{ marginTop: '2.5rem' }}>{work.map((c) => <CaseCard key={c.slug} c={c} />)}</div>
    </div>
  );
}
