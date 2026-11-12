'use client';
import { useMemo, useState } from 'react';

// The 14 Śiva Sūtras that open Pāṇini's grammar. Each line ends in a marker (an index, not a sound).
const SUTRAS: [string[], string][] = [
  [['a', 'i', 'u'], 'Ṇ'], [['ṛ', 'ḷ'], 'K'], [['e', 'o'], 'Ṅ'], [['ai', 'au'], 'C'],
  [['ha', 'ya', 'va', 'ra'], 'Ṭ'], [['la'], 'Ṇ'], [['ña', 'ma', 'ṅa', 'ṇa', 'na'], 'M'], [['jha', 'bha'], 'Ñ'],
  [['gha', 'ḍha', 'dha'], 'Ṣ'], [['ja', 'ba', 'ga', 'ḍa', 'da'], 'Ś'], [['kha', 'pha', 'cha', 'ṭha', 'tha', 'ca', 'ṭa', 'ta'], 'V'],
  [['ka', 'pa'], 'Y'], [['śa', 'ṣa', 'sa'], 'R'], [['ha'], 'L'],
];
const KNOWN: Record<string, string> = { 'a-C': 'all vowels', 'ha-L': 'all consonants', 'a-L': 'every sound', 'ya-Ṇ': 'the semivowels', 'jha-Ś': 'the voiced stops', 'ña-M': 'the nasals', 'a-K': 'the simple vowels', 'śa-R': 'the sibilants' };

/** Rule 1.1.71: a sound plus a later marker names every sound in between. */
export default function Pratyahara() {
  const [start, setStart] = useState<[number, number]>([0, 0]);
  const [end, setEnd] = useState(3);
  const set = useMemo(() => {
    const out: string[] = [];
    for (let l = start[0]; l <= end; l++) SUTRAS[l][0].forEach((s, i) => { if (l > start[0] || i >= start[1]) out.push(s); });
    return out;
  }, [start, end]);
  const first = SUTRAS[start[0]][0][start[1]];
  const name = `${first}${SUTRAS[end][1]}`;
  const known = KNOWN[`${first}-${SUTRAS[end][1]}`];
  return (
    <>
      <div className="demo-head">
        <p>Pick a sound, then a red marker</p>
        <span className="small muted">Pāṇini, rule 1.1.71</span>
      </div>
      <div className="demo-body">
        <div className="sutras">
          {SUTRAS.map(([sounds, marker], l) => (
            <div className="sutra" key={l}>
              <span className="n" aria-hidden="true">{l + 1}</span>
              {sounds.map((s, i) => {
                const inSet = l >= start[0] && l <= end && (l > start[0] || i >= start[1]);
                const isStart = l === start[0] && i === start[1];
                return (
                  <button key={i} type="button" className={`snd${inSet ? ' in' : ''}${isStart ? ' start' : ''}`} aria-pressed={isStart}
                    onClick={() => { setStart([l, i]); if (end < l) setEnd(l); }}>{s}</button>
                );
              })}
              <button type="button" className="mk" aria-pressed={end === l} disabled={l < start[0]} aria-label={`Marker ${marker}, line ${l + 1}`}
                onClick={() => setEnd(l)}>{marker}</button>
            </div>
          ))}
        </div>
        <p className="prat-out" aria-live="polite">
          <b>{name}</b> names {set.length} sound{set.length === 1 ? '' : 's'}{known ? `: ${known}` : ''}. <span className="muted">({set.join(' ')})</span>
        </p>
        <p className="small muted" style={{ margin: 0 }}>Two letters name a set, the way a token alias like <code>color.danger</code> does.</p>
      </div>
    </>
  );
}
