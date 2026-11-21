import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { facts, clearedMetric } from '@/lib/facts';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'CV: Sai Prakash, Staff Design Engineer',
  description: 'CV for Sai Prakash: shipped LLM products at a large bank, design systems that coding agents can read, and twelve years across design and engineering at SAP and JPMorgan Chase.',
  alternates: { canonical: '/cv' },
};

const host = site.url.replace(/^https?:\/\//, '');
const PDF = '/Sai_Prakash_Staff_Design_Engineer.pdf';

/** "2023-01" -> "Jan 2023". Anything else is shown as given; null hides the dates. */
function month(v: string | null): string | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})$/.exec(v);
  if (!m) return v;
  return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m[2]) - 1]} ${m[1]}`;
}
function dates(org: string): string | null {
  const r = facts.roles.find((x) => x.org === org);
  if (!r?.start) return null;
  return `${month(r.start)} to ${r.end ? month(r.end) : 'present'}`;
}

export default function CV() {
  const adoption = clearedMetric('liquidity-adoption');
  const jpm = dates('JPMorgan Chase');
  const sap = dates('SAP');
  return (
    <div className="wrap section cv">
      <div className="cv-actions no-print row">
        <a className="btn" href={PDF} download>Download PDF</a>
        <PrintButton />
        <Link className="textlink" href="/hire">The two-minute version</Link>
      </div>

      <header className="cv-head">
        <h1>Sai Prakash</h1>
        <p className="cv-role">Staff Design Engineer</p>
        <p className="cv-contact">
          {site.location} · <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.linkedin}>linkedin.com/in/prakashsai</a> · <a href={site.github}>github.com/sai-prakash</a> · <a href={site.url}>{host}</a>
        </p>
      </header>

      <section aria-labelledby="cv-summary">
        <h2 id="cv-summary">Summary</h2>
        <p>Twelve years between design and production code. I build the design-system specs that coding agents read and the checks that show they followed them, and I have shipped two LLM products that analysts at a large bank use for real decisions. Open to Staff Design Engineer, UX Engineer, Design Technologist and Applied AI Engineer roles in Europe and beyond.</p>
      </section>

      <section aria-labelledby="cv-exp">
        <h2 id="cv-exp">Experience</h2>

        <div className="cv-job">
          <h3>JPMorgan Chase, Bengaluru <span>Vice President, Staff Design Engineer{facts.vpSince ? `, from ${month(facts.vpSince)}` : ''}{jpm ? ` · ${jpm}` : ''}</span></h3>
          <ul>
            <li>Made a large bank&apos;s design system readable by coding agents: tiered specs loaded as the task needs them, MCP tool design, and agent documentation used across design, product and engineering.</li>
            <li>Built checks that grade agent-generated code against the design system, from a hackathon-winning linter that was taken to design leadership.</li>
            <li>Gave designers direct model access through an SDK, a playground and an API, and owned the UX and research for an internal Figma plugin.</li>
            <li>Shipped <strong>Liquidity Co-Pilot</strong>, a trust-first AI assistant for liquidity and collateral decisions{adoption ? `, with ${adoption.value}` : ', which analysts adopted voluntarily'}.</li>
            <li>Shipped <strong>PromptForge</strong>, LLM document extraction that turned a manual reference-data process into an AI-assisted one. Led its frontend architecture and mentored the two engineers who built it with me.</li>
          </ul>
        </div>

        <div className="cv-job">
          <h3>SAP, Bengaluru <span>Lead Product Designer and Innovation Architect; earlier UI Developer and Design Technologist{sap ? ` · ${sap}` : ''}</span></h3>
          <ul>
            <li>Built a code-based living style guide and design system that automated design-to-development handoff and cut engineering rework.</li>
            <li>Built real-time trading dashboards in D3.js and a global content system for customer success teams across three regions.</li>
            <li>Mentored three junior designers and ran weekly design critiques across two countries.</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="cv-skills">
        <h2 id="cv-skills">Skills</h2>
        <dl className="cv-skills">
          <dt>Applied AI</dt><dd>MCP server and tool design, agentic pipelines, evaluation and benchmark design, retrieval, context engineering</dd>
          <dt>Design engineering</dt><dd>Design systems, design tokens, React, TypeScript, Next.js, Figma plugins, accessibility (WCAG 2.1 AA)</dd>
          <dt>Platform</dt><dd>Python, Node.js, AWS (ECS Fargate, Cognito, Bedrock), CI/CD with GitHub Actions</dd>
        </dl>
      </section>

      <section aria-labelledby="cv-edu">
        <h2 id="cv-edu">Education and languages</h2>
        <p>M.Tech, Software Engineering, BITS Pilani, 2016 (work-integrated) · BCA, BIT Mesra, 2012</p>
        <p>English, full professional{facts.germanCEFR ? ` · German, ${facts.germanCEFR}` : ''}{facts.otherLanguages ? ` · ${facts.otherLanguages}` : ''}</p>
      </section>
    </div>
  );
}
