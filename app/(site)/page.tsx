import Link from 'next/link';
import { getPosts, getWork, writingLive } from '@/lib/content';
import { PostList } from '@/components/Cards';
import TrackLink from '@/components/TrackLink';
import DemoRenderer from '@/components/demos/DemoRenderer';
import Kolam from '@/components/Kolam';
import WorkIndex from '@/components/WorkIndex';
import EmailBig from '@/components/EmailBig';
import FactsStrip from '@/components/FactsStrip';
import { site, IDENTITY } from '@/lib/site';
import { facts } from '@/lib/facts';

const HERO = ['liquidity-co-pilot', 'promptforge', 'design-system-checks'];

export default function Home() {
  const work = getWork();
  const heroes = HERO.map((s) => work.find((w) => w.slug === s)).filter((w): w is NonNullable<typeof w> => Boolean(w));
  const programme = work.filter((w) => w.slug === 'design-systems-for-agents');
  const oss = work.filter((w) => w.slug === 'ds-bench-de');
  const posts = writingLive() ? getPosts().slice(0, 3) : [];

  return (
    <>
      <section className="khero" aria-label="Introduction">
        <div className="wrap khero-grid">
          <div>
            <p className="label">Sai Prakash · Staff Design Engineer</p>
            <h1 className="identity">{IDENTITY}</h1>
            <p className="lede" style={{ marginTop: '1.4rem' }}>Twelve years between design and code, now at JPMorgan Chase. I have shipped two LLM products that analysts at a large bank use for real decisions, and I build the tooling and tests that let agents use a design system properly.</p>
            <div className="row" style={{ marginTop: '1.4rem' }}>
              <Link className="btn" href="/work">See the work</Link>
              <TrackLink className="textlink" href={`mailto:${site.email}`} event="cta_email" data={{ where: 'hero' }}>Email me</TrackLink>
              {facts.calendarUrl && <TrackLink className="textlink" href={facts.calendarUrl} event="cta_booking" data={{ where: 'hero' }}>Book 30 minutes</TrackLink>}
              <TrackLink className="textlink" href="/cv" event="cta_cv" data={{ where: 'hero' }}>CV</TrackLink>
            </div>
          </div>
          <Kolam />
        </div>
        <div className="wrap"><FactsStrip className="home-facts" /></div>
      </section>

      <section className="section" aria-labelledby="demo-h">
        <div className="wrap">
          <h2 id="demo-h" className="h-big">Watch an agent get it wrong, then right.</h2>
          <div className="demo-wide">
            <div>
              <p className="lede">Same prompt, two agents. One guesses. One reads the design system first. Checks grade both.</p>
              <p>A designer reads the guideline and an agent reads the spec. When the two disagree, the agent ships the bug. My work is making them one source, then proving the agent followed it.</p>
              <p><Link href="/playground">Run a real model in your browser</Link></p>
            </div>
            <DemoRenderer name="checks-compare" caption="Illustrative example. The playground runs a real model in your browser." />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="work-h">
        <div className="wrap">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
            <h2 id="work-h" className="h-big">Selected work</h2>
            <Link href="/work">All work</Link>
          </div>
          <WorkIndex work={[...heroes, ...programme, ...oss]} />
        </div>
      </section>

      {posts.length > 0 && (
        <section className="section" aria-labelledby="writing-h">
          <div className="wrap">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.6rem' }}>
              <h2 id="writing-h" className="h-big">Writing</h2>
              <Link href="/writing">All articles</Link>
            </div>
            <PostList posts={posts} />
          </div>
        </section>
      )}

      <section className="close" aria-labelledby="hire-h">
        <div className="wrap">
          <h2 id="hire-h">Hiring a Staff Design Engineer or an Applied AI Engineer? Write to me.</h2>
          <EmailBig />
          <div className="row">
            <TrackLink className="btn" href="/hire" event="cta_hire_page" data={{ where: 'home' }}>Read the two-minute summary</TrackLink>
            <TrackLink className="textlink" href="/cv" event="cta_cv" data={{ where: 'home' }}>CV</TrackLink>
            <TrackLink className="textlink" href={site.linkedin} event="cta_linkedin" data={{ where: 'home' }}>LinkedIn</TrackLink>
            <TrackLink className="textlink" href={site.github} event="cta_github" data={{ where: 'home' }}>GitHub</TrackLink>
          </div>
        </div>
      </section>
    </>
  );
}
