import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import TrackLink from '@/components/TrackLink';
import AskButton from '@/components/AskButton';
import TimeOverlap from '@/components/TimeOverlap';
import DemoRenderer from '@/components/demos/DemoRenderer';

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
      <div className="row" style={{ marginTop: '1.2rem' }}>
        <TrackLink className="btn" href={`mailto:${site.email}`} event="cta_email" data={{ where: 'hire-top' }}>Email {site.email}</TrackLink>
        <TrackLink className="btn ghost" href="/cv" event="cta_cv" data={{ where: 'hire-top' }}>One-page CV</TrackLink>
      </div>

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

      <h2 style={{ marginTop: '3.5rem' }}>How I multiply</h2>
      <ul className="prose" style={{ marginTop: '1rem' }}>
        <li>Gave designers direct model access with an SDK, a playground and an API.</li>
        <li>Took a hackathon win to design leadership.</li>
        <li>Explained the agent docs pipeline to design, product and tech leads as three decisions.</li>
        <li>Handed the Figma plugin to engineering and kept owning its UX research.</li>
      </ul>

      <h2 style={{ marginTop: '3.5rem' }}>Path</h2>
      <ol className="post-list" style={{ marginTop: '1.2rem' }} aria-label="Career, oldest first">
        <li><span className="small muted">11 years</span><div><h3>SAP</h3><p>UI Developer, then Lead Product Designer, then Innovation Architect. Worked on SAP&apos;s living style guide; led design for mobile experience and Business Objects prototyping.</p></div></li>
        <li><span className="small muted">Corporate &amp; Investment Bank</span><div><h3>JPMorgan Chase, Senior UX Engineer</h3><p>Built a Figma-to-SALT pipeline that turns design files into design-system code.</p></div></li>
        <li><span className="small muted">Consumer &amp; Community Banking, 2026</span><div><h3>JPMorgan Chase, VP, Staff Design Engineer</h3><p>Making the Manhattan Design System AI-native where design turns into code, measured by design-to-code cycle time.</p></div></li>
      </ol>

      <h2 style={{ marginTop: '3.5rem' }}>How I work</h2>
      <p className="lede" style={{ marginTop: '0.6rem' }}>Four habits, borrowed from a very old grammar.</p>
      <div className="hero-grid" style={{ marginTop: '1rem' }}>
        <ol className="prose">
          <li>Name a set once, then refer to it everywhere.</li>
          <li>State the rule in one line. Keep the reasoning one tap away.</li>
          <li>Write it so people and agents read the same thing.</li>
          <li>Test that the agent followed it, and publish the score.</li>
        </ol>
        <DemoRenderer name="pratyahara" caption="Pāṇini named sets of sounds with two letters, more than two thousand years before design tokens did." />
      </div>

      <h2 style={{ marginTop: '3.5rem' }}>Facts</h2>
      <dl className="facts" style={{ maxWidth: '44rem', marginTop: '1.2rem' }}>
        <dt>Now</dt><dd>Staff Design Engineer (VP), JPMorgan Chase, Bengaluru</dd>
        <dt>Education</dt><dd>M.Tech Software Engineering, BITS Pilani (2016); BCA, BIT Mesra (2012)</dd>
        <dt>Stack</dt><dd>TypeScript, React, Next.js, design tokens, MCP, LLM evaluation, WebGPU, accessibility (WCAG)</dd>
        <dt>Open to</dt><dd>Staff Design Engineer, UX Engineer, Design Technologist and Applied AI roles, in Europe and beyond</dd>
        {site.showRelocation && (<><dt>Can start</dt><dd>3 months after an offer</dd><dt>Work permit</dt><dd>Germany: qualifies for the EU Blue Card</dd></>)}
      </dl>
      <div className="card" style={{ marginTop: '1.2rem', maxWidth: '44rem' }}><TimeOverlap /></div>

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
