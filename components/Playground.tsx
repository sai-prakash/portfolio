'use client';
import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { getEngine, hasWebGPU, MODELS } from '@/lib/ai/engine';
import { PRESETS, SYSTEM_PROMPT, feedbackFor, parseUI, runChecks, type Check, type UINode } from '@/lib/playground';

const badgeTone: Record<string, [string, string]> = {
  info: ['var(--indigo-wash)', 'var(--indigo)'],
  success: ['var(--pass-wash)', 'var(--pass)'],
  warning: ['var(--haldi-wash)', '#7A5200'],
  danger: ['var(--kumkum-wash)', 'var(--kumkum)'],
};

function Render({ node }: { node: UINode }): ReactNode {
  const p = (node.props ?? {}) as Record<string, any>;
  const kids = Array.isArray(node.children)
    ? node.children.map((c, i) => <Fragment key={i}>{typeof c === 'object' && c ? <Render node={c} /> : String(c ?? '')}</Fragment>)
    : node.children;
  switch (node.type) {
    case 'Stack': return <div className="ds-stack">{kids}</div>;
    case 'Row': return <div className="ds-row">{kids}</div>;
    case 'Card': return <div className="ds-card">{kids}</div>;
    case 'Heading': {
      const level = Math.min(3, Math.max(1, Number(p.level) || 1));
      const size = { 1: '1.7rem', 2: '1.35rem', 3: '1.1rem' }[level];
      return <p className="ds-heading" style={{ fontSize: size }}>{kids}</p>;
    }
    case 'Text': return <p className="ds-text" style={{ color: p.tone === 'muted' ? 'var(--ink-2)' : undefined }}>{kids}</p>;
    case 'Button': return <button type="button" className={`ds-button ${p.variant === 'secondary' ? 'secondary' : ''}`}>{kids}</button>;
    case 'TextField': return <label className="ds-field"><span>{p.label || <em style={{ color: 'var(--kumkum)' }}>(no label)</em>}</span><input type={['email', 'number'].includes(p.type) ? p.type : 'text'} placeholder={p.placeholder} /></label>;
    case 'Stat': return <div className="ds-stat"><span className="small muted">{p.label}</span><b>{p.value}</b></div>;
    case 'Badge': {
      const [bg, fg] = badgeTone[p.tone] ?? ['#fff', 'var(--kumkum)'];
      return <span className="ds-badge" style={{ background: bg, color: fg, border: badgeTone[p.tone] ? 0 : '2px dashed var(--kumkum)' }}>{kids}</span>;
    }
    default: return <div className="unknown">Not a system component: &lt;{node.type}&gt; {typeof node.children === 'string' ? node.children : ''}</div>;
  }
}

type Attempt = { ui: UINode | null; raw: string; checks: Check[] };

export default function Playground() {
  const [gpu, setGpu] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'live' | 'replay'>('replay');
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [view, setView] = useState(0);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<{ role: 'system' | 'user' | 'assistant'; content: string }[]>([]);

  useEffect(() => { hasWebGPU().then((ok) => { setGpu(ok); }); }, []);

  function show(list: Attempt[]) { setAttempts(list); setView(list.length - 1); }

  function replay(i: number) {
    const preset = PRESETS[i];
    setPrompt(preset.prompt);
    const first = preset.attempts[0];
    show([{ ui: first, raw: JSON.stringify(first, null, 2), checks: runChecks(first) }]);
    setStatus('Recorded first attempt, graded live. Use “Fix with feedback” to see the second attempt.');
  }

  async function generate(feedback?: string) {
    setBusy(true);
    try { track('playground_run', { mode, retry: feedback ? 'yes' : 'no' }); } catch {}
    if (mode === 'replay') {
      const i = PRESETS.findIndex((p) => p.prompt === prompt);
      const preset = PRESETS[i >= 0 ? i : 0];
      if (!feedback) replay(i >= 0 ? i : 0);
      else {
        const second = preset.attempts[1];
        show([...attempts, { ui: second, raw: JSON.stringify(second, null, 2), checks: runChecks(second) }]);
        setStatus('Recorded second attempt after the checks were fed back, graded live.');
      }
      setBusy(false);
      return;
    }
    try {
      const engine = await getEngine('playground', (p) => setStatus(`Loading ${MODELS.playground.label}: ${Math.round((p.progress ?? 0) * 100)}%`));
      const messages = feedback
        ? [...history, { role: 'user' as const, content: feedback }]
        : [{ role: 'system' as const, content: SYSTEM_PROMPT }, { role: 'user' as const, content: prompt }];
      setStatus('Generating in your browser…');
      const res = await engine.chat.completions.create({ messages, temperature: 0.3, max_tokens: 900, response_format: { type: 'json_object' } });
      const raw = res.choices[0]?.message?.content ?? '';
      const ui = parseUI(raw);
      const checks = ui ? runChecks(ui) : [{ id: 'json', name: 'Valid UI JSON', ok: false, detail: 'The model did not return a usable tree.' }];
      setHistory([...messages, { role: 'assistant', content: raw }]);
      show(feedback ? [...attempts, { ui, raw, checks }] : [{ ui, raw, checks }]);
      setStatus(`Attempt ${feedback ? attempts.length + 1 : 1} done.`);
    } catch (e: any) {
      console.error(e);
      setStatus(`The model couldn’t run here (${e?.message ?? 'unknown error'}). Switch to recorded runs.`);
    }
    setBusy(false);
  }

  const current = attempts[view];
  const passed = current?.checks.filter((c) => c.ok).length ?? 0;
  const failed = current ? current.checks.length - passed : 0;

  return (
    <div className="pg">
      <div>
        <fieldset className="switch" style={{ marginBottom: '1rem' }}>
          <legend>How to run it</legend>
          <span><input type="radio" id="m-replay" name="mode" checked={mode === 'replay'} onChange={() => { setMode('replay'); setAttempts([]); }} /><label htmlFor="m-replay">Recorded runs</label></span>
          <span><input type="radio" id="m-live" name="mode" checked={mode === 'live'} disabled={!gpu} onChange={() => { setMode('live'); setAttempts([]); }} /><label htmlFor="m-live">Live model in your browser</label></span>
        </fieldset>
        <p className="small muted" style={{ marginTop: '-0.4rem' }}>
          {gpu === null ? 'Checking for WebGPU…' : gpu ? `Live mode downloads ${MODELS.playground.label} once and runs it on your device.` : 'Live mode needs a browser with WebGPU and 16-bit shaders (recent Chrome or Edge on desktop).'}
        </p>
        <div className="field" style={{ marginTop: '1rem' }}>
          <label htmlFor="pg-prompt">Prompt</label>
          {mode === 'replay' ? (
            <select id="pg-prompt" value={prompt} onChange={(e) => { setPrompt(e.target.value); setAttempts([]); }}>
              {PRESETS.map((p) => <option key={p.prompt}>{p.prompt}</option>)}
            </select>
          ) : (
            <textarea id="pg-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          )}
        </div>
        <div className="row" style={{ marginTop: '1rem' }}>
          <button type="button" className="btn" onClick={() => generate()} disabled={busy || !prompt.trim()}>Generate</button>
          <button type="button" className="btn ghost" onClick={() => current && generate(feedbackFor(current.checks))} disabled={busy || !current || failed === 0}>Fix with feedback</button>
        </div>
        <p role="status" className="small muted" style={{ marginTop: '0.8rem', minHeight: '1.5em' }}>{status}</p>

        {current && (
          <div className="demo" style={{ marginTop: '0.5rem' }}>
            <div className="demo-head">
              <p>Checks</p>
              {attempts.length > 1 && (
                <div className="seg" role="group" aria-label="Attempt">
                  {attempts.map((_, i) => <button key={i} type="button" aria-pressed={view === i} onClick={() => setView(i)}>Attempt {i + 1}</button>)}
                </div>
              )}
            </div>
            <ul className="checks demo-body" style={{ paddingTop: 0, paddingBottom: 0 }}>
              {current.checks.map((c) => (
                <li key={c.id} className={c.ok ? 'ok' : 'fail'}>
                  <span className="mark" aria-hidden="true">{c.ok ? '✓' : '✕'}</span>
                  <span><span className="visually-hidden">{c.ok ? 'Pass: ' : 'Fail: '}</span>{c.name}<small>{c.detail}</small></span>
                </li>
              ))}
            </ul>
            <div className="tally"><span>Checks passed</span><strong>{passed} of {current.checks.length}</strong></div>
          </div>
        )}
      </div>

      <div>
        <p className="label">What the agent built</p>
        <div className="canvas" aria-live="polite">
          {current?.ui ? <Render node={current.ui} /> : <p className="muted" style={{ margin: 0 }}>Pick a prompt and choose Generate. The output renders here with this site&apos;s own components.</p>}
        </div>
        {current && (
          <details style={{ marginTop: '1rem' }}>
            <summary>See the JSON the model returned</summary>
            <pre className="code" style={{ borderRadius: 10, border: '1px solid var(--line)', maxHeight: 360 }}>{current.raw}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
