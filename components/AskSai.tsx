'use client';
import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { retrieve, type Passage } from '@/lib/ai/retrieve';
import { getEngine, hasWebGPU, isLoaded, MODELS } from '@/lib/ai/engine';

type Msg = { role: 'user' | 'bot'; text: string; sources?: Passage[]; mode?: 'model' | 'search' };
type ModelState = 'checking' | 'unsupported' | 'off' | 'loading' | 'ready' | 'error';

const SUGGESTIONS = [
  'What has Sai shipped?',
  'What does he do with design systems and agents?',
  'Has he worked on LLM evaluation?',
  'How do I contact him?',
];

const SYSTEM = `You are the guide on Sai Prakash's portfolio website. Answer the visitor's question using ONLY the numbered sources.
Rules: write 2 to 4 plain sentences about Sai in the third person. Do not invent numbers, employers, dates or skills.
If the sources do not answer the question, say you don't know and suggest emailing Sai at saiprak@gmail.com.`;

function extractive(q: string, hits: Passage[]) {
  if (!hits.length) return "I couldn't find that on this site. Email Sai at saiprak@gmail.com and he'll answer directly.";
  const sentences = hits[0].text.split(/(?<=[.!?])\s+/).slice(0, 3).join(' ');
  return sentences;
}

export default function AskSai() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState<ModelState>('checking');
  const [progress, setProgress] = useState({ pct: 0, text: '' });
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      openerRef.current = document.activeElement;
      setOpen(true);
      const q = (e as CustomEvent).detail?.question;
      if (q) setTimeout(() => ask(q), 50);
    };
    window.addEventListener('ask-sai:open', onOpen);
    return () => window.removeEventListener('ask-sai:open', onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 30);
    if (model === 'checking') hasWebGPU().then((ok) => setModel(ok ? (isLoaded('guide') ? 'ready' : 'off') : 'unsupported'));
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [msgs]);

  function close() {
    setOpen(false);
    (openerRef.current as HTMLElement | null)?.focus?.();
  }

  async function loadModel() {
    setModel('loading');
    try { track('ai_model_load', { model: MODELS.guide.id }); } catch {}
    try {
      await getEngine('guide', (p) => setProgress({ pct: Math.round((p.progress ?? 0) * 100), text: p.text }));
      setModel('ready');
    } catch (e) {
      console.error(e);
      setModel('error');
    }
  }

  async function ask(q: string) {
    q = q.trim();
    if (!q || busy) return;
    setInput('');
    setBusy(true);
    try { track('ai_question', { mode: model === 'ready' ? 'model' : 'search' }); } catch {}
    const hits = await retrieve(q, 4);
    setMsgs((m) => [...m, { role: 'user', text: q }]);
    if (model !== 'ready' || !hits.length) {
      setMsgs((m) => [...m, { role: 'bot', text: extractive(q, hits), sources: hits.slice(0, 3), mode: 'search' }]);
      setBusy(false);
      return;
    }
    setMsgs((m) => [...m, { role: 'bot', text: '', sources: hits.slice(0, 3), mode: 'model' }]);
    try {
      const engine = await getEngine('guide');
      const context = hits.map((h, i) => `[${i + 1}] ${h.title} — ${h.heading}: ${h.text}`).join('\n\n');
      const stream = await engine.chat.completions.create({
        stream: true,
        temperature: 0.2,
        max_tokens: 220,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `Sources:\n${context}\n\nQuestion: ${q}` },
        ],
      });
      let acc = '';
      for await (const chunk of stream) {
        acc += chunk.choices[0]?.delta?.content ?? '';
        const text = acc;
        setMsgs((m) => [...m.slice(0, -1), { ...m[m.length - 1], text }]);
      }
    } catch (e) {
      console.error(e);
      setMsgs((m) => [...m.slice(0, -1), { role: 'bot', text: extractive(q, hits), sources: hits.slice(0, 3), mode: 'search' }]);
    }
    setBusy(false);
  }

  if (!open) return null;
  return (
    <div className="ask-panel" role="dialog" aria-modal="false" aria-labelledby="ask-title">
      <div className="ask-head">
        <h2 id="ask-title">Ask about Sai</h2>
        <button type="button" className="btn ghost small" onClick={close}>Close</button>
      </div>
      <div className="ask-log" ref={logRef} aria-live="polite">
        {msgs.length === 0 && (
          <div>
            <p style={{ marginTop: 0 }}>Answers come from this site&apos;s case studies and articles, with links to the source.</p>
            <div className="suggest">
              {SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'bot' && m.mode === 'search' && <p className="small muted" style={{ margin: '0 0 0.3rem' }}>From the site:</p>}
            <p>{m.text || '…'}</p>
            {m.sources?.length ? (
              <ul className="sources">
                {m.sources.map((s) => <li key={s.id}><a href={s.url} onClick={() => close()}>{s.title}{s.heading !== s.title ? ` — ${s.heading}` : ''}</a></li>)}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
      {model === 'loading' && (
        <>
          <div className="progress" aria-hidden="true"><i style={{ width: `${progress.pct}%` }} /></div>
          <p className="ask-status" role="status">Loading the model into your browser: {progress.pct}%. It&apos;s cached after the first time.</p>
        </>
      )}
      {model === 'off' && (
        <p className="ask-status">
          Answers are quoted from the site. For written answers, <button type="button" className="btn ghost small" onClick={loadModel}>load {MODELS.guide.label}</button> in your browser. It runs on your device; nothing is sent to a server.
        </p>
      )}
      {model === 'ready' && <p className="ask-status">{MODELS.guide.label} is running in your browser. It can be wrong; the links are the source.</p>}
      {model === 'unsupported' && <p className="ask-status">Your browser doesn&apos;t support WebGPU, so answers are quoted from the site.</p>}
      {model === 'error' && <p className="ask-status">The model couldn&apos;t load on this device, so answers are quoted from the site.</p>}
      <form className="ask-form" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <label htmlFor="ask-input" className="visually-hidden">Your question</label>
        <input id="ask-input" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question" autoComplete="off" />
        <button className="btn small" type="submit" disabled={busy || !input.trim()}>Ask</button>
      </form>
    </div>
  );
}
