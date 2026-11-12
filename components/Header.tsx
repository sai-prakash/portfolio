import Link from 'next/link';
import AskButton from './AskButton';
import TrackLink from './TrackLink';
import ThemeToggle from './ThemeToggle';
import { getPosts } from '@/lib/content';

const links = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/playground', label: 'Playground' },
  { href: '/hire', label: 'Hiring?' },
  { href: '/cv', label: 'CV' },
];

export default function Header() {
  const hasPosts = getPosts().length > 0;
  const nav = links.filter((l) => l.href !== '/writing' || hasPosts);
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/">Sai Prakash</Link>
        <nav aria-label="Main">
          <ul className="nav">
            {nav.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="header-cta">
          <ThemeToggle />
          <AskButton />
          <TrackLink className="btn small" href="/hire#contact" event="cta_meet" data={{ where: 'header' }}>Meet Sai</TrackLink>
        </div>
      </div>
    </header>
  );
}
