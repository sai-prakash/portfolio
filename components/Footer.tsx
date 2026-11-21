import Link from 'next/link';
import { site } from '@/lib/site';
import { facts } from '@/lib/facts';
import { getWork, writingLive } from '@/lib/content';
import TrackLink from './TrackLink';
import ThemeToggle from './ThemeToggle';
import CommandPalette from './CommandPalette';
import { AgentToggle } from './AgentView';
import AskButton from './AskButton';

export default function Footer() {
  const live = writingLive();
  const calendar = facts.calendarUrl;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-cta">
          <h2>Bring a hard AI problem. I&apos;ll bring a way to measure it.</h2>
          <p style={{ marginTop: '1rem', maxWidth: '36rem' }}>Open to Staff design engineering and applied AI roles. Thirty minutes is usually enough to know if there&apos;s a fit.</p>
          <div className="row" style={{ marginTop: '1.5rem' }}>
            <TrackLink className="btn" href={`mailto:${site.email}`} event="cta_email" data={{ where: 'footer' }}>Email {site.email}</TrackLink>
            {calendar && <TrackLink className="textlink" href={calendar} event="cta_booking" data={{ where: 'footer' }}>Book 30 minutes</TrackLink>}
            <TrackLink className="textlink" href={site.linkedin} event="cta_linkedin" data={{ where: 'footer' }}>LinkedIn</TrackLink>
            <TrackLink className="textlink" href={site.github} event="cta_github" data={{ where: 'footer' }}>GitHub</TrackLink>
          </div>
        </div>
        <ul className="footer-links">
          <li><Link href="/work">Work</Link></li>
          {live && <li><Link href="/writing">Writing</Link></li>}
          <li><Link href="/about">About</Link></li>
          <li><Link href="/cv">CV</Link></li>
          <li><Link href="/playground">Playground</Link></li>
          <li><Link href="/system">Design system</Link></li>
          <li><Link href="/accessibility">Accessibility</Link></li>
          {live && <li><Link href="/feed.xml">RSS</Link></li>}
          <li><Link href="/llms.txt">llms.txt</Link></li>
        </ul>
        <div className="footer-tools" role="group" aria-label="Site tools">
          <CommandPalette cases={getWork().map((c) => ({ slug: c.slug, title: c.headline || c.title }))} hasPosts={live} />
          <AgentToggle />
          <ThemeToggle />
          <AskButton className="textlink" label="Ask about Sai" />
        </div>
        <p className="small muted">Views here are my own, not my employer&apos;s.</p>
      </div>
    </footer>
  );
}
