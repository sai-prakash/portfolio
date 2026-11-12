import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'CV: Sai Prakash, Staff Design Engineer and Applied AI Engineer',
  description: 'One-page CV for Sai Prakash: shipped LLM products, agent-readable design systems, twelve years across design and engineering at SAP and JPMorgan Chase.',
  alternates: { canonical: '/cv' },
};

const host = site.url.replace(/^https?:\/\//, '');

export default function CV() {
  return (
    <div className="wrap section cv">
      <div className="cv-actions no-print row">
        <PrintButton />
        <Link className="btn ghost" href="/hire">Back to the two-minute version</Link>
      </div>

      <header className="cv-head">
        <h1>Sai Prakash</h1>
        <p className="cv-role">Staff Design Engineer · Applied AI Engineer</p>
        <p className="cv-contact">
          {site.location} · <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.linkedin}>linkedin.com/in/prakashsai</a> · <a href={site.github}>github.com/sai-prakash</a> · <a href={site.url}>{host}</a>
        </p>
      </header>

      <section aria-labelledby="cv-summary">
        <h2 id="cv-summary">Summary</h2>
        <p>Twelve years between design and production code. I ship LLM products that a bank uses every day, build the tooling that lets coding agents use a design system properly, and measure whether it works. Open to Staff Design Engineer, UX Engineer, Design Technologist and Applied AI Engineer roles in Europe and beyond.</p>
      </section>

      <section aria-labelledby="cv-exp">
        <h2 id="cv-exp">Experience</h2>

        <div className="cv-job">
          <h3>JPMorgan Chase, Bengaluru <span>Vice President, Staff Design Engineer · Manhattan Design System</span></h3>
          <ul>
            <li>Making the design system readable by coding agents: tiered specs agents load as needed, an MCP server, and agent documentation used across design, product and engineering.</li>
            <li>Built checks that grade agent-generated code against the system; started as a linter that won an internal hackathon and was taken to design leadership. Web ready, Android and iOS in progress.</li>
            <li>Gave designers direct model access through an SDK, a playground and an API.</li>
          </ul>
        </div>

        <div className="cv-job">
          <h3>JPMorgan Chase, Bengaluru <span>Senior UX Engineer · Corporate &amp; Investment Bank</span></h3>
          <ul>
            <li>Shipped <strong>Liquidity Co-Pilot</strong>, an AI assistant that cut a liquidity task from 218 minutes to 37 (83% less time).</li>
            <li>Shipped <strong>PromptForge</strong>, LLM document extraction that cut processing from 90 to 20 minutes per document (78%); now the commercial bank&apos;s tool for creating and verifying golden data.</li>
            <li>Built a Figma-to-SALT pipeline that turns design files into design-system code.</li>
          </ul>
        </div>

        <div className="cv-job">
          <h3>SAP, Bengaluru <span>UI Developer → Lead Product Designer → Innovation Architect · 11 years</span></h3>
          <ul>
            <li>Worked on SAP&apos;s living style guide; led design for mobile experience and Business Objects prototyping.</li>
            <li>Moved from front-end code into design leadership and innovation prototyping.</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="cv-skills">
        <h2 id="cv-skills">Skills</h2>
        <dl className="cv-skills">
          <dt>Applied AI</dt><dd>LLM product design and build, evaluation and grading, retrieval, MCP servers, agent tooling, in-browser models (WebLLM, WebGPU)</dd>
          <dt>Design engineering</dt><dd>Design systems, design tokens, React, TypeScript, Next.js, accessibility (WCAG 2.1 AA), Figma plugins and pipelines</dd>
          <dt>Ways of working</dt><dd>Taking prototypes to production in a regulated bank, teaching teams, writing decisions down</dd>
        </dl>
      </section>

      <section aria-labelledby="cv-edu">
        <h2 id="cv-edu">Education</h2>
        <p>M.Tech, Software Engineering, BITS Pilani, 2016 (work-integrated) · BCA, BIT Mesra, 2012</p>
      </section>

      <p className="cv-foot muted">Case studies, live demos and writing: {host}</p>
    </div>
  );
}
