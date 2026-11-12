'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@vercel/analytics';
import { site } from '@/lib/site';
import TrackLink from './TrackLink';

const HIDDEN = ['/cv', '/hire', '/keystatic'];

export default function ContactDock() {
  const path = usePathname() || '/';
  const [dismissed, setDismissed] = useState(true);
  const [past, setPast] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try { setDismissed(sessionStorage.getItem('dock-dismissed') === '1'); } catch { setDismissed(false); }
  }, []);

  useEffect(() => {
    const check = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPast(max > 0 && window.scrollY / max > 0.35);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [path]);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (dismissed || !past || HIDDEN.some((p) => path === p || path.startsWith(p + '/'))) return null;

  async function copy() {
    try { track('cta_copy_email', { where: 'dock' }); } catch {}
    try { await navigator.clipboard.writeText(site.email); } catch {
      const t = document.createElement('textarea');
      t.value = site.email; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch {}
      t.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <aside className="dock" aria-label="Contact">
      <span className="dock-q">Hiring?</span>
      <button type="button" className="dock-btn" onClick={copy}><span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span></button>
      <TrackLink className="dock-btn dock-link" href="/cv" event="cta_cv" data={{ where: 'dock' }}>CV</TrackLink>
      <button
        type="button"
        className="dock-x"
        aria-label="Dismiss"
        onClick={() => { setDismissed(true); try { sessionStorage.setItem('dock-dismissed', '1'); } catch {} }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </aside>
  );
}
