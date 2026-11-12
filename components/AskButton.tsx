'use client';
export function openAsk(question?: string) {
  window.dispatchEvent(new CustomEvent('ask-sai:open', { detail: { question } }));
}
export default function AskButton({ className = 'btn ghost small', label = 'Ask about Sai', question }: { className?: string; label?: string; question?: string }) {
  return (
    <button type="button" className={className} onClick={() => openAsk(question)} aria-haspopup="dialog">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v6A1.5 1.5 0 0 1 12.5 11H7l-3 3v-3h-.5A1.5 1.5 0 0 1 2 9.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
      <span className="ask-btn-label">{label}</span>
    </button>
  );
}
