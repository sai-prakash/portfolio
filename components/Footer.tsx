import Link from 'next/link';
import { site } from '@/lib/site';
import TrackLink from './TrackLink';
import EggCount from './EggCount';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <h2>Bring a hard AI problem. I&apos;ll bring a way to measure it.</h2>
        <p style={{ marginTop: '1rem', maxWidth: '36rem' }}>
          Open to Staff design engineering and applied AI roles. Thirty minutes is usually enough to know if there&apos;s a fit.
        </p>
        <div className="row" style={{ marginTop: '1.5rem' }}>
          <TrackLink className="btn" href={`mailto:${site.email}`} event="cta_email" data={{ where: 'footer' }}>Email {site.email}</TrackLink>
          <TrackLink className="btn ghost" href={site.linkedin} event="cta_linkedin" data={{ where: 'footer' }}>LinkedIn</TrackLink>
          <TrackLink className="btn ghost" href={site.github} event="cta_github" data={{ where: 'footer' }}>GitHub</TrackLink>
        </div>
        <EggCount />
        <ul className="footer-links">
          <li><Link href="/cv">CV</Link></li>
          <li><Link href="/system">Design system</Link></li>
          <li><Link href="/accessibility">Accessibility</Link></li>
          <li><Link href="/work">Work</Link></li>
          <li><Link href="/playground">Playground</Link></li>
          <li><Link href="/feed.xml">RSS</Link></li>
          <li><Link href="/llms.txt">llms.txt for AI agents</Link></li>
          <li>Views here are my own, not my employer&apos;s.</li>
        </ul>
      </div>
    </footer>
  );
}
