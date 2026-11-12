import Link from 'next/link';
import { stateLabel, type CaseStudy } from '@/lib/content';

/** One small drawing per case study: the shape of the result, not a screenshot. */
function Glyph({ slug }: { slug: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const h = { ...p, stroke: 'var(--haldi)' };
  let body;
  switch (slug) {
    case 'liquidity-co-pilot':
      body = (<><path d="M10 28h100" {...p} strokeDasharray="1 8" /><path d="M10 28h100" {...p} opacity=".25" /><path className="g-draw" d="M10 54h17" {...h} strokeWidth={9} /><path d="M10 14v52" {...p} /></>);
      break;
    case 'promptforge':
      body = (<><rect x="10" y="10" width="40" height="60" rx="4" {...p} /><path d="M18 24h24M18 34h24M18 44h16" {...p} opacity=".45" /><path className="g-draw" d="M58 40h14" {...h} /><rect x="78" y="14" width="32" height="12" rx="6" {...h} /><rect x="78" y="34" width="32" height="12" rx="6" {...h} /><rect x="78" y="54" width="32" height="12" rx="6" {...h} /></>);
      break;
    case 'design-system-checks':
      body = (<>{[0, 1, 2].map((i) => <circle key={i} cx={24 + i * 36} cy="24" r="10" {...p} />)}{[0, 1, 2].map((i) => <circle key={i} cx={24 + i * 36} cy="58" r="10" {...p} />)}<path className="g-draw" d="M19 24l4 4 7-8M55 24l4 4 7-8M91 24l4 4 7-8M19 58l4 4 7-8M55 58l4 4 7-8" {...h} /><path d="M92 54l8 8M100 54l-8 8" {...p} stroke="var(--kumkum)" /></>);
      break;
    case 'agent-readable-design-system':
      body = (<><path className="g-draw" d="M60 10l40 14-40 14-40-14z" {...h} /><path d="M20 40l40 14 40-14" {...p} strokeDasharray="5 6" /><path d="M20 54l40 14 40-14" {...p} strokeDasharray="5 6" opacity=".5" /></>);
      break;
    case 'designer-model-access':
      body = (<><circle cx="22" cy="40" r="10" {...p} /><path className="g-draw" d="M32 40h22M54 40c14 0 14-24 30-24M54 40c14 0 14 24 30 24M54 40h30" {...h} /><circle cx="96" cy="16" r="8" {...p} /><circle cx="96" cy="40" r="8" {...p} /><circle cx="96" cy="64" r="8" {...p} /></>);
      break;
    case 'design-system-code-agent':
      body = (<><path d="M30 16L10 40l20 24M90 16l20 24-20 24" {...p} /><rect className="g-draw" x="44" y="22" width="32" height="14" rx="3" {...h} /><rect x="44" y="44" width="14" height="14" rx="3" {...h} /><rect x="62" y="44" width="14" height="14" rx="3" {...h} /></>);
      break;
    default:
      body = (<><circle cx="60" cy="40" r="4" fill="var(--haldi)" stroke="none" /><path className="g-draw" d="M60 40c-30-30-30 30 0 0c30-30 30 30 0 0c-30 30 30 30 0 0c-30-30 30-30 0 0" {...p} /></>);
  }
  return <svg className="glyph" viewBox="0 0 120 80" aria-hidden="true">{body}</svg>;
}

export default function WorkIndex({ work }: { work: CaseStudy[] }) {
  return (
    <ol className="work-index">
      {work.map((c) => (
        <li key={c.slug} data-track={c.track}>
          <Link href={`/work/${c.slug}`}>
            <Glyph slug={c.slug} />
            <span className="wi-main">
              <span className="wi-title">{c.headline || c.title}</span>
              <span className="wi-sub">{c.title}, {c.org}</span>
            </span>
            <span className="wi-meta">
              {c.metric ? <span className="wi-metric">{c.metric}<small>{c.metricLabel}</small></span> : null}
              <span className={`pill ${c.state}`}>{stateLabel[c.state]}</span>
              {c.status === 'draft' && <span className="pill draft">Draft</span>}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
