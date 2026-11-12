'use client';
import { useEffect, useState } from 'react';
import { EGGS, getFound, type EggId } from '@/lib/eggs';
import { site } from '@/lib/site';
import TrackLink from './TrackLink';

export default function EggCount() {
  const [found, setFound] = useState<EggId[] | null>(null);
  useEffect(() => {
    const sync = () => setFound(getFound());
    sync();
    window.addEventListener('egg', sync);
    return () => window.removeEventListener('egg', sync);
  }, []);
  if (!found) return null;
  const all = found.length === EGGS.length;
  return (
    <div className="egg-count">
      <details>
        <summary>Easter eggs: {found.length} of {EGGS.length} found</summary>
        <ul>
          {EGGS.map((e) => {
            const got = found.includes(e.id);
            return (
              <li key={e.id}>
                {got ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="visually-hidden">Found: </span>{e.title}
                  </>
                ) : (
                  <>{e.hint}</>
                )}
              </li>
            );
          })}
        </ul>
      </details>
      {all && (
        <p className="egg-done">
          You explore like an engineer. Let&apos;s talk.{' '}
          <TrackLink className="btn small" href={`mailto:${site.email}`} event="cta_email" data={{ where: 'eggs' }}>Email {site.email}</TrackLink>
        </p>
      )}
    </div>
  );
}
