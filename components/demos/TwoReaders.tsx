'use client';
import { useState } from 'react';

const human = (
  <>
    <p style={{ margin: 0, fontWeight: 700 }}>Button guideline</p>
    <p style={{ margin: '0.5rem 0 0' }}>Use the primary button for the main action on a page. Keep it rare so it stands out, and write labels that say what will happen, like “Approve payment”, not “OK”.</p>
  </>
);
const agent = `button:
  one_primary_per_view: true
  variants: [primary, secondary]
  label:
    form: verb + object
    banned: [OK, Submit, Click here]
  check: buttons-say-what-they-do`;

/** Drag, tap or use arrow keys to move the seam between the two readers of one rule. */
export default function TwoReaders() {
  const [pos, setPos] = useState(50);
  return (
    <>
      <div className="demo-head">
        <p>One rule, two readers</p>
        <span className="small muted">A designer reads the left. An agent reads the right.</span>
      </div>
      <div className="seam-wrap" style={{ minHeight: 230 }}>
        <div className="layer seam" style={{ gridTemplateColumns: '1fr' }}>
          <div className="agent" aria-label="What the agent reads">{agent}</div>
        </div>
        <div className="layer" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="seam" style={{ gridTemplateColumns: '1fr', height: '100%' }}>
            <div className="human" style={{ borderRight: '3px solid var(--haldi)' }} aria-label="What the designer reads">{human}</div>
          </div>
        </div>
      </div>
      <div className="demo-body">
        <label htmlFor="seam-range" className="small" style={{ fontWeight: 600 }}>Move the seam</label>
        <input id="seam-range" className="seam-range" type="range" min={0} max={100} step={5} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-valuetext={`${pos}% designer view`} />
        <p className="small muted" style={{ margin: '0.4rem 0 0' }}>When the two disagree, the agent ships the bug. So both come from one source.</p>
      </div>
    </>
  );
}
