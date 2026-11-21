import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { facts } from '@/lib/facts';
import FactsStrip from '@/components/FactsStrip';
import TrackLink from '@/components/TrackLink';
import DemoRenderer from '@/components/demos/DemoRenderer';

export const metadata: Metadata = {
  title: 'About Sai Prakash, Staff Design Engineer',
  description: 'Sai Prakash is a Staff Design Engineer in Bengaluru with twelve years across design and code, working on design systems that coding agents can use, and on proving that they do.',
  alternates: { canonical: '/about' },
};

const span = (a: string | null, b: string | null) => (a ? `${a} to ${b ?? 'now'}` : null);

export default function About() {
  const roles = facts.roles.map((r) => ({ ...r, when: span(r.start, r.end) }));
  return (
    <div className="wrap section">
      <article className="reading">
        <p className="label">About</p>
        <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em' }}>Twelve years between design and production code.</h1>
        <p className="lede" style={{ marginTop: '1rem' }}>I&apos;m a Staff Design Engineer at JPMorgan Chase in Bengaluru. I work where a design system meets the people and agents who build with it, and I measure whether it works.</p>

        <h2>What I do now</h2>
        <p>I make a large bank&apos;s design system readable by coding agents: tiered specs an agent loads as it needs them, an MCP server so it can ask the system directly, and checks that grade what the agent builds. Before that I shipped two LLM products that analysts use for real decisions. Both rest on one habit: put a person where the model is least sure, and make correcting it cheap.</p>

        <h2>Where I come from</h2>
        <p>I started as a UI developer at SAP and stayed for most of my career so far, moving from front-end code into design leadership and innovation prototyping. I worked on SAP&apos;s living style guide, so the handoff between design and engineering has been my problem for a long time. I joined JPMorgan Chase to take it into AI.</p>
        {roles.some((r) => r.when) && (
          <ul>
            {roles.filter((r) => r.when).map((r) => <li key={r.org}><strong>{r.org}</strong>{r.title ? `, ${r.title}` : ''}: {r.when}</li>)}
          </ul>
        )}

        <h2>How I work</h2>
        <ul>
          <li>I write the rule in one line and keep the reasoning one tap away.</li>
          <li>I write for people and agents at once, from the same source.</li>
          <li>I test that the agent followed the rule, and publish the score.</li>
          <li>I prototype first. A working prototype settles more arguments than a proposal.</li>
        </ul>

        <h2>Facts</h2>
        <FactsStrip />
        <p className="small muted" style={{ marginTop: '1rem' }}>BCA, BIT Mesra, 2012. M.Tech in Software Engineering, BITS Pilani, 2016, while working.</p>

        <h2>A puzzle I like</h2>
        <p>Pāṇini, writing in Sanskrit more than two thousand years ago, named whole sets of sounds with two letters. It is the same move as a design token: name a set once, refer to it everywhere.</p>
        <DemoRenderer name="pratyahara" caption="Pick a two-letter name and see which sounds it covers." />

        <div className="row" style={{ marginTop: '2.5rem' }} id="contact">
          <TrackLink className="btn" href={`mailto:${site.email}`} event="cta_email" data={{ where: 'about' }}>Email {site.email}</TrackLink>
          <Link className="textlink" href="/cv">CV</Link>
          <Link className="textlink" href="/work">Work</Link>
        </div>
      </article>
    </div>
  );
}
