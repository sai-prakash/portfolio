import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { facts } from '@/lib/facts';
import TrackLink from '@/components/TrackLink';
import AskButton from '@/components/AskButton';
import TimeOverlap from '@/components/TimeOverlap';
import FactsStrip from '@/components/FactsStrip';
import Testimonials from '@/components/Testimonials';

export const metadata: Metadata = {
  title: 'Hiring Sai Prakash: Staff Design Engineer',
  description: 'The two-minute summary for recruiters and hiring managers: the roles Sai Prakash fits, what he has shipped, how he works, and how to reach him.',
  alternates: { canonical: '/hire' },
};

const fits = [
  { role: 'Staff Design Engineer / UX Engineer', why: 'Owns the seam between design and production code. Twelve years across both, from UI developer at SAP to Staff at JPMorgan Chase.' },
  { role: 'Applied AI Engineer', why: 'Has shipped two LLM products that analysts at a large bank use for real decisions, and builds the evaluation that shows whether such things work.' },
  { role: 'Design systems lead for AI', why: 'Builds agent-readable design systems: tiered specs, MCP tool design, and checks that grade what coding agents produce.' },
];

export default function Hire() {
  return (
    <div className="wrap section">
      <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em', maxWidth: '14ch' }}>The two-minute version</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>For recruiters and hiring managers. Everything here links to the longer story.</p>
      <div className="row" style={{ marginTop: '1.2rem' }}>
        <TrackLink className="btn" href={`mailto:${site.email}`} event="cta_email" data={{ where: 'hire-top' }}>Email {site.email}</TrackLink>
        {facts.calendarUrl && <TrackLink className="textlink" href={facts.calendarUrl} event="cta_booking" data={{ where: 'hire-top' }}>Book 30 minutes</TrackLink>}
        <TrackLink className="textlink" href="/cv" event="cta_cv" data={{ where: 'hire-top' }}>CV</TrackLink>
      </div>

      <h2 style={{ marginTop: '3rem' }}>At a glance</h2>
      <FactsStrip />
      <div className="card" style={{ marginTop: '1.2rem', maxWidth: '44rem' }}><TimeOverlap /></div>

      <h2 style={{ marginTop: '3rem' }}>Roles I fit</h2>
      <div className="grid-3" style={{ marginTop: '1.2rem' }}>
        {fits.map((f) => (
          <div className="card" key={f.role}><h3>{f.role}</h3><p className="muted" style={{ margin: 0, fontSize: 'var(--fs-m)' }}>{f.why}</p></div>
        ))}
      </div>

      <h2 style={{ marginTop: '3.5rem' }}>Shipped</h2>
      <ul className="post-list" style={{ marginTop: '1.2rem' }}>
        <li><span className="small muted">Production</span><div><h3><Link href="/work/liquidity-co-pilot">Liquidity Co-Pilot</Link></h3><p>A trust-first AI assistant for liquidity and collateral decisions. Analysts adopted it voluntarily.</p></div></li>
        <li><span className="small muted">Production</span><div><h3><Link href="/work/promptforge">PromptForge</Link></h3><p>LLM document extraction where the model pre-fills and people verify. It turned a manual reference-data process into an AI-assisted one.</p></div></li>
        <li><span className="small muted">In build</span><div><h3><Link href="/work/design-system-checks">Design-system checks</Link></h3><p>Grades agent-generated code against a design system. Started as a hackathon-winning linter.</p></div></li>
      </ul>

      <h2 style={{ marginTop: '3.5rem' }}>How I multiply</h2>
      <ul className="prose" style={{ marginTop: '1rem' }}>
        <li>Mentored the two engineers who built PromptForge with me, and the state patterns we used were adopted across the wider engineering pod.</li>
        <li>Took a hackathon win to design leadership.</li>
        <li>Handed the Figma plugin to engineering and kept owning its UX research.</li>
        <li>Gave designers direct model access with an SDK, a playground and an API.</li>
      </ul>

      <Testimonials />

      <section id="contact" style={{ marginTop: '3.5rem', scrollMarginTop: '90px' }} aria-labelledby="c-h">
        <h2 id="c-h">Get in touch</h2>
        <p className="lede" style={{ marginTop: '0.6rem' }}>Email is fastest. I reply within two working days.</p>
        <div className="row" style={{ marginTop: '1rem' }}>
          <TrackLink className="btn" href={`mailto:${site.email}?subject=${encodeURIComponent('Role at ')}`} event="cta_email" data={{ where: 'hire' }}>Email {site.email}</TrackLink>
          {facts.calendarUrl && <TrackLink className="textlink" href={facts.calendarUrl} event="cta_booking" data={{ where: 'hire' }}>Book 30 minutes</TrackLink>}
          <TrackLink className="textlink" href={site.linkedin} event="cta_linkedin" data={{ where: 'hire' }}>LinkedIn</TrackLink>
          <AskButton className="textlink" label="Ask a question first" />
        </div>
      </section>
    </div>
  );
}
