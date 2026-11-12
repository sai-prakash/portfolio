'use client';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { site } from '@/lib/site';

/** The address itself is the button: one tap copies it. */
export default function EmailBig() {
  const [done, setDone] = useState(false);
  return (
    <div className="email-big">
      <button
        type="button"
        onClick={async () => {
          try { await navigator.clipboard.writeText(site.email); setDone(true); setTimeout(() => setDone(false), 2600); } catch { window.location.href = `mailto:${site.email}`; }
          try { track('cta_copy_email', { where: 'close' }); } catch {}
        }}
      >
        <span className="visually-hidden">Copy email address </span>{site.email}
      </button>
      <p aria-live="polite">{done ? 'Copied. Paste it into a new message.' : 'Tap the address to copy it.'}</p>
    </div>
  );
}
