'use client';
import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { tracks, type Track } from '@/lib/site';

/** Sets html[data-role]; CSS hides items whose data-track doesn't match. Remembered per visitor. */
export default function RoleSwitch() {
  const [role, setRole] = useState<Track>('both');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('role') as Track | null;
      if (saved && saved in tracks) setRole(saved);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.role = role;
  }, [role]);
  function choose(r: Track) {
    setRole(r);
    try { localStorage.setItem('role', r); } catch {}
    try { track('role_switch', { role: r }); } catch {}
  }
  return (
    <fieldset className="switch">
      <legend>Hiring for</legend>
      {(Object.keys(tracks) as Track[]).map((k) => (
        <span key={k}>
          <input type="radio" name="role" id={`role-${k}`} checked={role === k} onChange={() => choose(k)} />
          <label htmlFor={`role-${k}`}>{tracks[k]}</label>
        </span>
      ))}
    </fieldset>
  );
}
