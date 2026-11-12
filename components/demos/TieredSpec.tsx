'use client';
import { useState } from 'react';

const tiers = [
  { id: 'registry', name: 'Registry', what: 'Every component, one line each' },
  { id: 'core', name: 'Core spec', what: 'Props, variants, rules. Kept under 12 KB' },
  { id: 'full', name: 'Full spec', what: 'Edge cases, states, examples' },
  { id: 'tokens', name: 'Tokens', what: 'Exact colour, space and type values' },
  { id: 'sheet', name: 'Contact sheet', what: 'Pictures of every state, for visual checks' },
];
const tasks: Record<string, { label: string; loads: string[] }> = {
  find: { label: 'Find a component', loads: ['registry'] },
  build: { label: 'Build a screen', loads: ['registry', 'core'] },
  edge: { label: 'Handle an edge case', loads: ['registry', 'core', 'full'] },
  exact: { label: 'Match exact values', loads: ['registry', 'core', 'tokens'] },
  visual: { label: 'Check it visually', loads: ['registry', 'core', 'sheet'] },
};

export default function TieredSpec() {
  const [task, setTask] = useState('build');
  const loads = tasks[task].loads;
  return (
    <>
      <div className="demo-head">
        <p>What is the agent doing?</p>
        <div className="seg" role="group" aria-label="Agent task" style={{ flexWrap: 'wrap', borderRadius: 18 }}>
          {Object.entries(tasks).map(([k, t]) => (
            <button key={k} type="button" aria-pressed={task === k} onClick={() => setTask(k)}>{t.label}</button>
          ))}
        </div>
      </div>
      <ol className="checks demo-body" aria-live="polite">
        {tiers.map((t) => {
          const on = loads.includes(t.id);
          return (
            <li key={t.id} className={on ? 'ok' : ''} style={{ color: on ? 'var(--ink)' : 'var(--ink-2)', textDecoration: on ? 'none' : 'line-through' }}>
              <span className="mark" aria-hidden="true" style={{ background: on ? 'var(--indigo)' : 'var(--line)' }}>{on ? '↓' : ''}</span>
              <span><span className="visually-hidden">{on ? 'Loaded: ' : 'Not loaded: '}</span>{t.name}<small>{t.what}</small></span>
            </li>
          );
        })}
      </ol>
      <div className="tally"><span>Tiers in context</span><strong>{loads.length} of {tiers.length}</strong></div>
    </>
  );
}
