'use client';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

const IST = 5.5;
const fmt = (h: number) => { const hh = Math.floor(((h % 24) + 24) % 24); const mm = Math.round((h - Math.floor(h)) * 60); return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`; };

/** Sai's working hours, shown in the visitor's time zone, with the overlap against a 9–18 local day. */
export default function TimeOverlap() {
  const [v, setV] = useState<null | { zone: string; start: number; end: number; overlap: number }>(null);
  useEffect(() => {
    const offset = -new Date().getTimezoneOffset() / 60;
    const shift = offset - IST;
    const start = site.workHours.start + shift, end = site.workHours.end + shift;
    const norm = (h: number) => ((h % 24) + 24) % 24;
    let overlap = 0;
    for (let t = 0; t < 24; t += 0.5) { const local = norm(t + shift); if (t >= site.workHours.start && t < site.workHours.end && local >= 9 && local < 18) overlap += 0.5; }
    setV({ zone: Intl.DateTimeFormat().resolvedOptions().timeZone, start, end, overlap });
  }, []);
  if (!v) return <p className="muted small">Working out the overlap with your time zone…</p>;
  return (
    <p style={{ margin: 0 }}>
      In your time zone ({v.zone}), Sai&apos;s working day is <b>{fmt(v.start)}–{fmt(v.end)}</b>.{' '}
      {v.overlap > 0 ? <>That&apos;s <b>{v.overlap} hours</b> of overlap with a 09:00–18:00 day where you are.</> : <>There&apos;s no overlap with a 09:00–18:00 day where you are; early or late calls work.</>}
    </p>
  );
}
