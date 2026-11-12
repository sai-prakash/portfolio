import Link from 'next/link';
import { getPosts, getWork } from '@/lib/content';
import { CaseCard, PostList } from '@/components/Cards';
import RoleSwitch from '@/components/RoleSwitch';
import AskButton from '@/components/AskButton';
import TrackLink from '@/components/TrackLink';
import DemoRenderer from '@/components/demos/DemoRenderer';
import HeadlineStrings from '@/components/HeadlineStrings';

export default function Home() {
  const work = getWork();
  const posts = getPosts().slice(0, 6);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <HeadlineStrings />
          <div className="hero-grid">
            <div>
              <p className="lede" style={{ color: 'var(--ink)' }}>
                I&apos;m Sai Prakash. I ship LLM products, build the tooling that lets coding agents use a design system properly, and measure whether it works. Twelve years between design and code, eleven of them at SAP, now at JPMorgan Chase.
              </p>
              <div className="row" style={{ marginTop: '1.6rem' }}>
                <Link className="btn" href="/work">See the work</Link>
                <AskButton className="btn ghost" label="Ask about Sai" />
                <Link className="btn ghost" href="/playground">Try the playground</Link>
              </div>
            </div>
            <div>
              <RoleSwitch />
              <dl className="facts">
                <dt>Now</dt><dd>Staff Design Engineer (VP), JPMorgan Chase</dd>
                <dt>Open to</dt><dd>Staff Design Engineer and Applied AI roles</dd>
                <dt>Based in</dt><dd>Bengaluru, open to Europe and beyond</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="proof-h" style={{ paddingTop: '1rem' }}>
        <div className="wrap">
          <h2 id="proof-h" className="visually-hidden">Results</h2>
          <div className="stats">
            <div data-track="applied-ai">
              <p className="label">Liquidity Co-Pilot, shipped</p>
              <p className="stat">83%</p>
              <p className="muted">less time on a liquidity task: 218 minutes became 37. <Link href="/work/liquidity-co-pilot">How</Link></p>
            </div>
            <div data-track="applied-ai">
              <p className="label">PromptForge, in production</p>
              <p className="stat">78%</p>
              <p className="muted">less time per document, now used in the commercial bank for golden data. <Link href="/work/promptforge">How</Link></p>
            </div>
            <div data-track="design-engineering">
              <p className="label">Design system checks</p>
              <p className="stat">Web ready</p>
              <p className="muted">Grading agent-generated code against the system; Android and iOS in progress. <Link href="/work/design-system-checks">How</Link></p>
            </div>
          </div>
        </div>
      </section>


      <section className="section" aria-labelledby="idea-h">
        <div className="wrap hero-grid" style={{ marginTop: 0 }}>
          <div>
            <h2 id="idea-h" style={{ fontSize: 'var(--fs-2xl)' }}>Every rule now has two readers.</h2>
            <p className="lede" style={{ marginTop: '1rem' }}>A designer reads the guideline. An agent reads the spec. When the two disagree, the agent ships the bug. My work is making them one source, and proving the agent followed it.</p>
            <p><Link href="/writing/your-design-system-has-a-new-reader">Why this matters now</Link></p>
            <p><Link href="/system">See the system this site is made of</Link></p>
          </div>
          <DemoRenderer name="two-readers" />
        </div>
      </section>

      <section className="section" aria-labelledby="demo-h">
        <div className="wrap hero-grid" style={{ marginTop: 0 }}>
          <div>
            <h2 id="demo-h" style={{ fontSize: 'var(--fs-2xl)' }}>Watch an agent get it wrong, then right.</h2>
            <p className="lede" style={{ marginTop: '1rem' }}>Same prompt, two agents. One guesses; one reads the design system first. Four checks grade both.</p>
            <p><Link href="/playground">Run a model yourself in the playground</Link></p>
          </div>
          <DemoRenderer name="checks-compare" caption="Illustrative example. The playground runs a real model in your browser." />
        </div>
      </section>

      <section className="section" aria-labelledby="work-h">
        <div className="wrap">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.6rem' }}>
            <h2 id="work-h" style={{ fontSize: 'var(--fs-2xl)' }}>Case studies</h2>
            <Link href="/work">All work</Link>
          </div>
          <div className="grid-3">{work.slice(0, 6).map((c) => <CaseCard key={c.slug} c={c} />)}</div>
        </div>
      </section>

      <section className="section" aria-labelledby="writing-h">
        <div className="wrap">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.6rem' }}>
            <h2 id="writing-h" style={{ fontSize: 'var(--fs-2xl)' }}>Writing</h2>
            <Link href="/writing">All articles</Link>
          </div>
          {posts.length ? <PostList posts={posts} /> : <p className="muted">New articles are on the way.</p>}
        </div>
      </section>

      <section className="section" aria-labelledby="hire-h">
        <div className="wrap">
          <h2 id="hire-h" style={{ fontSize: 'var(--fs-2xl)', maxWidth: '20ch' }}>Hiring? Here&apos;s the two-minute version.</h2>
          <p className="lede" style={{ marginTop: '1rem' }}>Role fit, what I&apos;ve shipped, how I work and how to reach me, on one page.</p>
          <TrackLink className="btn" href="/hire" event="cta_hire_page" data={{ where: 'home' }}>Read the recruiter summary</TrackLink>
        </div>
      </section>
    </>
  );
}
