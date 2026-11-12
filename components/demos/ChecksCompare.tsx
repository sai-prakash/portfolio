'use client';
import { useState } from 'react';

const runs = {
  without: {
    code: [
      ['bad', '<div'], ['', ' className="btn"\n     style={{ background: '], ['bad', '"#0a5bd3"'], ['', ' }}\n     onClick={approve}>\n  Approve payment\n'], ['bad', '</div>'], ['', '\n'], ['bad', '<input placeholder="Reference" />'],
    ],
    checks: [
      [false, 'Uses system components', 'A div is acting as a button. Use Button.'],
      [false, 'Uses design tokens', 'Hard-coded #0a5bd3. Use the primary action colour token.'],
      [false, 'Every field has a label', 'The input relies on placeholder text.'],
      [false, 'Works with a keyboard', 'The div can’t be reached with Tab.'],
    ],
  },
  with: {
    code: [
      ['good', '<Button variant="primary"'], ['', ' onClick={approve}>\n  Approve payment\n'], ['good', '</Button>'], ['', '\n'], ['good', '<TextField label="Reference" />'], ['', '\n\n'],
    ],
    checks: [
      [true, 'Uses system components', 'Button and TextField from the system.'],
      [true, 'Uses design tokens', 'Colour comes from the Button variant.'],
      [true, 'Every field has a label', 'TextField renders a visible label.'],
      [true, 'Works with a keyboard', 'Native button with the system focus ring.'],
    ],
  },
} as const;

export default function ChecksCompare() {
  const [run, setRun] = useState<'without' | 'with'>('without');
  const r = runs[run];
  const passed = r.checks.filter((c) => c[0]).length;
  return (
    <>
      <div className="demo-head">
        <p>Prompt: add a payment approval form with a reference field</p>
        <div className="seg" role="group" aria-label="Which agent run to show">
          <button type="button" aria-pressed={run === 'without'} onClick={() => setRun('without')}>Without the system</button>
          <button type="button" aria-pressed={run === 'with'} onClick={() => setRun('with')}>With the system</button>
        </div>
      </div>
      <pre className="code" aria-label="Code the agent generated">
        {r.code.map(([cls, text], i) => (cls ? <span key={i} className={cls}>{text}</span> : <span key={i}>{text}</span>))}
      </pre>
      <ul className="checks demo-body" aria-live="polite" style={{ paddingTop: 0, paddingBottom: 0 }}>
        {r.checks.map(([ok, name, why]) => (
          <li key={name} className={ok ? 'ok' : 'fail'}>
            <span className="mark" aria-hidden="true">{ok ? '✓' : '✕'}</span>
            <span><span className="visually-hidden">{ok ? 'Pass: ' : 'Fail: '}</span>{name}<small>{why}</small></span>
          </li>
        ))}
      </ul>
      <div className="tally"><span>Checks passed</span><strong>{passed} of {r.checks.length}</strong></div>
    </>
  );
}
