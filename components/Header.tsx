import Link from 'next/link';
import TrackLink from './TrackLink';
import { writingLive } from '@/lib/content';

export default function Header() {
  const links = [
    { href: '/work', label: 'Work' },
    ...(writingLive() ? [{ href: '/writing', label: 'Writing' }] : []),
    { href: '/about', label: 'About' },
    { href: '/cv', label: 'CV' },
  ];
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/">Sai Prakash</Link>
        <nav aria-label="Main">
          <ul className="nav">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="header-cta">
          <TrackLink className="btn small" href="/hire#contact" event="cta_meet" data={{ where: 'header' }}>Contact</TrackLink>
        </div>
      </div>
    </header>
  );
}
