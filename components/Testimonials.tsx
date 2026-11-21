import { facts } from '@/lib/facts';

/** Renders only recommendations Sai has approved in content/facts.json. With none, it renders nothing. */
export default function Testimonials() {
  const quotes = facts.recommendations.filter((r) => r.approved === true && r.quote && r.name);
  if (!quotes.length) return null;
  return (
    <section aria-labelledby="rec-h" style={{ marginTop: '3.5rem' }}>
      <h2 id="rec-h">What people say</h2>
      <div className="grid-3" style={{ marginTop: '1.2rem' }}>
        {quotes.map((r) => (
          <figure className="card" key={r.name}>
            <blockquote style={{ margin: 0 }}>{r.quote}</blockquote>
            <figcaption className="small muted" style={{ marginTop: '0.8rem' }}>{r.name}, {r.relation}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
