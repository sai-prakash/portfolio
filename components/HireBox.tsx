import { site } from '@/lib/site';
import TrackLink from './TrackLink';
import AskButton from './AskButton';

export default function HireBox({ where }: { where: string }) {
  return (
    <div className="hire-box">
      <p style={{ fontFamily: 'var(--f-display)', fontSize: '1.3rem', color: '#fff', lineHeight: 1.2 }}>Working on something like this?</p>
      <p>I&apos;m open to Staff design engineering and applied AI roles.</p>
      <TrackLink className="btn" href={`mailto:${site.email}`} event="cta_email" data={{ where }}>Email Sai</TrackLink>
      <div style={{ marginTop: '0.6rem' }}><AskButton className="btn ghost small" label="Ask a question first" /></div>
    </div>
  );
}
