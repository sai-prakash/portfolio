import type { Metadata } from 'next';
import Link from 'next/link';
import SelfAudit from '@/components/SelfAudit';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Accessibility: built for every reader',
  description: 'How this site is built for keyboard, screen reader and low-vision users, with the WCAG criteria behind each choice and a live audit of the page in your browser.',
  alternates: { canonical: '/accessibility' },
};

const items = [
  ['Works without a mouse', 'Every control, including the demos and the playground, can be reached and used with a keyboard, in reading order.', '2.1.1 · 2.4.3'],
  ['Skip link and landmarks', 'The first Tab reaches "Skip to content". Header, navigation, main content and footer are marked up as such.', '2.4.1'],
  ['Focus you can always see', 'A clear focus ring on every control.', '2.4.7'],
  ['Contrast, measured', 'Every text colour meets 4.5:1 against its background, in light and dark themes. The audit below measures it live.', '1.4.3'],
  ['Never colour alone', 'Check results and statuses say Pass, Fail or a word like Draft, so nothing depends on seeing red or green.', '1.4.1'],
  ['Text that grows', 'Type is set in rem and the layout reflows to one column instead of scrolling sideways.', '1.4.4 · 1.4.10'],
  ['No dragging required', 'The two-readers seam is a slider you can move with arrow keys.', '2.5.7'],
  ['Motion and sound on your terms', 'Nothing plays sound on its own; the headline is silent until you turn sound on. If you ask for reduced motion, nothing moves on its own.', '2.2.2 · 2.3.3'],
  ['Names, roles and labels', 'Every control has a name, every field a label, every toggle a state.', '4.1.2 · 3.3.2'],
];

export default function AccessibilityPage() {
  return (
    <div className="wrap section">
      <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em', maxWidth: '14ch' }}>Built for every reader.</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>Screen readers were reading interfaces long before AI agents did, and the structure that serves one serves the other. This site aims to meet WCAG 2.1 AA.</p>
      <div className="hero-grid" style={{ marginTop: '2.5rem' }}>
        <ul className="post-list">
          {items.map(([t, d, w]) => (
            <li key={t}><span className="small muted">WCAG {w}</span><div><h2 style={{ fontSize: '1.3rem' }}>{t}</h2><p>{d}</p></div></li>
          ))}
        </ul>
        <div className="aside-sticky">
          <SelfAudit />
          <p className="small muted">Known limits: the in-browser model needs WebGPU; without it, the guide quotes passages and the playground shows recorded runs. Found a problem? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
          <p className="small"><Link href="/writing/accessibility-is-a-design-system-feature">Why accessibility belongs in the design system</Link></p>
        </div>
      </div>
    </div>
  );
}
