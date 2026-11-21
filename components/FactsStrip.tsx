import { facts } from '@/lib/facts';
import { site } from '@/lib/site';

export interface Fact { label: string; value: string }

/** Everything here comes from content/facts.json or the site config. A null field is hidden, never guessed. */
export function factList(): Fact[] {
  const out: Fact[] = [{ label: 'Based in', value: `${site.location} (IST, UTC+5:30)` }];
  if (facts.workAuth.EU) out.push({ label: 'Work permit', value: `EU ${facts.workAuth.EU}` });
  for (const k of ['UK', 'US', 'CA'] as const) if (facts.workAuth[k]) out.push({ label: `Work permit, ${k}`, value: facts.workAuth[k]! });
  if (facts.relocation) out.push({ label: 'Relocation', value: facts.relocation });
  if (facts.noticePeriod) out.push({ label: 'Notice period', value: facts.noticePeriod });
  const langs = ['English, full professional', facts.germanCEFR ? `German, ${facts.germanCEFR}` : null, facts.otherLanguages].filter(Boolean);
  out.push({ label: 'Languages', value: langs.join(' · ') });
  return out;
}

export default function FactsStrip({ className = '' }: { className?: string }) {
  return (
    <dl className={`facts-strip ${className}`}>
      {factList().map((f) => (
        <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
      ))}
    </dl>
  );
}
