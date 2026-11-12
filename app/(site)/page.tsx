import Link from 'next/link';
import { getPosts, getWork } from '@/lib/content';
import { PostList } from '@/components/Cards';
import RoleSwitch from '@/components/RoleSwitch';
import AskButton from '@/components/AskButton';
import TrackLink from '@/components/TrackLink';
import DemoRenderer from '@/components/demos/DemoRenderer';
import HeadlineStrings from '@/components/HeadlineStrings';
import TimeSaved from '@/components/TimeSaved';
import Kolam from '@/components/Kolam';
import WorkIndex from '@/components/WorkIndex';
import EmailBig from '@/components/EmailBig';
import { site } from '@/lib/site';

const lede = "I'm Sai Prakash. I ship LLM products, build the tooling that lets coding agents use a design system properly, and measure whether it works. Twelve years between design and code, eleven of them at SAP, now at JPMorgan Chase.";

export default function Home() {
  const work = getWork();
  const posts = getPosts().slice(0, 6);

  return (
    <>
      <section className="khero" aria-label="Introduction">
        <div className="wrap khero-grid">
          <div>
            <HeadlineStrings />
            <p className="lede" style={{ color: 'var(--ink)', marginTop: '1.6rem' }}>{lede}</p>
            <div className="row" style={{ marginTop: '1.4rem' }}>
              <Link className="btn" href="/work">See the work</Link>
              <TrackLink className="btn ghost" href="/cv" event="cta_cv" data={{ where: 'hero' }}>One-page CV</TrackLink>
              <AskButton className="btn ghost" label="Ask about Sai" />
            </div>
            <p className="small" style={{ marginTop: '1rem' }}>Recruiting? <TrackLink href={`mailto:${site.email}`} event="cta_email" data={{ where: 'hero' }}>Email me</TrackLink>.</p>
          </div>
          <Kolam />
        </div>
        <div className="wrap khero-facts">
          <RoleSwitch />
          <dl className="facts">
            <dt>Now</dt><dd>Staff Design Engineer (VP), JPMorgan Chase</dd>
            <dt>Open to</dt><dd>Staff Design Engineer and Applied AI roles</dd>
            <dt>Based in</dt><dd>Bengaluru, open to Europe and beyond</dd>
          </dl>
        </div>
      </section>

      <section className="proof" aria-labelledby="proof-h">
        <div className="wrap proof-grid">
          <div data-track="applied-ai">
            <h2 id="proof-h">A 218-minute task now takes 37.</h2>
            <p className="proof-sub">Liquidity Co-Pilot, shipped at JPMorgan Chase. Drag it yourself.</p>
            <TimeSaved />
            <p><Link href="/work/liquidity-co-pilot">Read how it was built</Link></p>
          </div>
          <div className="proof-side">
            <div data-track="applied-ai">
              <p className="stat">90 <span aria-hidden="true">to</span><span className="visually-hidden">to</span> 20</p>
              <p>minutes per document. PromptForge is now the commercial bank&apos;s tool for golden data. <Link href="/work/promptforge">How</Link></p>
            </div>
            <div data-track="design-engineering">
              <p className="stat">Web ready</p>
              <p>Checks that grade what coding agents build against the design system. Android and iOS are in progress. <Link href="/work/design-system-checks">How</Link></p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="demo-h">
        <div className="wrap">
          <h2 id="demo-h" className="h-big">Watch an agent get it wrong, then right.</h2>
          <div className="demo-wide">
            <div>
              <p className="lede">Same prompt, two agents. One guesses. One reads the design system first. Four checks grade both.</p>
              <p>A designer reads the guideline and an agent reads the spec. When the two disagree, the agent ships the bug. My work is making them one source, then proving the agent followed it.</p>
              <p><Link href="/playground">Run a real model in your browser</Link></p>
              <p><Link href="/system">See the system this site is made of</Link></p>
            </div>
            <DemoRenderer name="checks-compare" caption="Illustrative example. The playground runs a real model in your browser." />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="work-h">
        <div className="wrap">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
            <h2 id="work-h" className="h-big">Work</h2>
            <Link href="/work">All case studies</Link>
          </div>
          <WorkIndex work={work.slice(0, 6)} />
        </div>
      </section>

      {posts.length > 0 && <section className="section" aria-labelledby="writing-h">
        <div className="wrap">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.6rem' }}>
            <h2 id="writing-h" className="h-big">Writing</h2>
            <Link href="/writing">All articles</Link>
          </div>
          <PostList posts={posts} />
        </div>
      </section>}

      <section className="close" aria-labelledby="hire-h">
        <div className="wrap">
          <h2 id="hire-h">Hiring a Staff Design Engineer or an Applied AI Engineer? Write to me.</h2>
          <EmailBig />
          <div className="row">
            <TrackLink className="btn" href="/hire" event="cta_hire_page" data={{ where: 'home' }}>Read the two-minute summary</TrackLink>
            <TrackLink className="btn ghost" href="/cv" event="cta_cv" data={{ where: 'home' }}>One-page CV</TrackLink>
            <TrackLink className="btn ghost" href={site.linkedin} event="cta_linkedin" data={{ where: 'home' }}>LinkedIn</TrackLink>
            <TrackLink className="btn ghost" href={site.github} event="cta_github" data={{ where: 'home' }}>GitHub</TrackLink>
          </div>
        </div>
      </section>
    </>
  );
}
