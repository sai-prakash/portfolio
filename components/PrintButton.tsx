'use client';
import { track } from '@vercel/analytics';

export default function PrintButton() {
  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        try { track('cv_download'); } catch {}
        window.print();
      }}
    >
      Save as PDF
    </button>
  );
}
