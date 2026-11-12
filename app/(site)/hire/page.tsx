import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import TrackLink from '@/components/TrackLink';
import AskButton from '@/components/AskButton';

export const metadata: Metadata = {
  title: 'Hiring Sai Prakash: Staff Design Engineer and Applied AI Engineer',
  description: 'The two-minute summary for recruiters and hiring managers: roles Sai Prakash fits, what he has shipped, how he works, and how to reach him.',
  alternates: { canonical: '/hire' },
};

const fits = [
  { role: 'Staff Design Engineer / UX Engineer', why: 'Owns the seam between design and production code. Twelve years across both, from UI developer at SAP to Staff at JPMorgan Chase.' },
  { role: 'Applied AI Engineer', why: 'Has shipped two LLM products that a bank uses every day, and builds the evaluation that shows whether they work.' },
  { role: 'Design systems lead for AI', why: 'Builds agent-readable design systems: tiered specs, an MCP server, and checks that grade what coding agents produce.' },
];

export default function Hire() {
  return (
    <div className="wrap section">
      <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em', maxWidth: '14ch' }}>The two-minute version</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>For recruiters and hiring managers. Everything here links to the longer story.</p>

      <h2 style={{ marginTop: '3rem' }}>Roles I fit</h2>
      <div className="grid-3" style={{ marginTop: '1.2rem' }}>
        {fits.map((f) => (
          <div className="card" key={f.role}><h3>{f.role}</h3><p className="muted" style={{ margin: 0, fontSize: 'var(--fs-m)' }}>{f.why}</p></div>
        ))}
      </div>

      <h2 style={{ marginTop: '3.5rem' }}>Shipped</h2>
      <ul className="post-list" style={{ marginTop: '1.2rem' }}>
        <li><span className="small muted">83% less time</span><div><h3><Link href="/work/liquidity-co-pilot">Liquidity Co-Pilot</Link></h3><p>AI assistant that cut a liquidity task from 218 minutes to 37.</p></div></li>
        <li><span className="small muted">78% less time</span><div><h3><Link href="/work/promptforge">PromptForge</Link></h3><p>LLM document extraction: 90 minutes to 20 per document, now the commercial bank&apos;s tool for golden data.</p></div></li>
        <li><span className="small muted">Web ready</span><div><h3><Link href="/work/design-system-checks">Design system checks</Link></h3><p>Grades agent-generated code against the design system. Started as a hackathon-winning linter.</p></div></li>
      </ul>

      <h2 style={{ marginTop: '3.5rem' }}>Facts</h2>
      <dl className="facts" style={{ maxWidth: '44rem', marginTop: '1.2rem' }}>
        <dt>Now</dt><dd>Staff Design Engineer (VP), JPMorgan Chase, Bengaluru</dd>
        <dt>Before</dt><dd>Senior UX Engineer, JPMorgan Chase; eleven years at SAP, UI Developer to Innovation Architect</dd>
        <dt>Education</dt><dd>M.Tech Software Engineering, BITS Pilani; BCA, BIT Mesra</dd>
        <dt>Stack</dt><dd>TypeScript, React, Next.js, design tokens, MCP, LLM evaluation, WebGPU, accessibility (WCAG)</dd>
        <dt>Open to</dt><dd>Staff roles in Europe and beyond</dd>
      </dl>

      <section id="contact" style={{ marginTop: '3.5rem', scrollMarginTop: '90px' }} aria-labelledby="c-h">
        <h2 id="c-h">Get in touch</h2>
        <p className="lede" style={{ marginTop: '0.6rem' }}>Email is fastest. I reply within two working days.</p>
        <div className="row" style={{ marginTop: '1rem' }}>
          <TrackLink className="btn" href={`mailto:${site.email}?subject=${encodeURIComponent('Role at ')}`} event="cta_email" data={{ where: 'hire' }}>Email {site.email}</TrackLink>
          {site.calendar && <TrackLink className="btn ghost" href={site.calendar} event="cta_calendar" data={{ where: 'hire' }}>Book 30 minutes</TrackLink>}
          <TrackLink className="btn ghost" href={site.linkedin} event="cta_linkedin" data={{ where: 'hire' }}>LinkedIn</TrackLink>
          <AskButton className="btn ghost" label="Ask a question first" />
        </div>
      </section>
    </div>
  );
}
