'use client';
import { useState } from 'react';
export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn ghost small" onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch {} }}>
      <span aria-live="polite">{done ? 'Copied' : label}</span>
    </button>
  );
}
