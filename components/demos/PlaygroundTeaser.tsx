import Link from 'next/link';
export default function PlaygroundTeaser() {
  return (
    <div className="demo-body">
      <p style={{ margin: 0 }}>A small model runs in your browser, builds UI from this site&apos;s design system, and six checks grade the result. No server, no API key.</p>
      <div className="row" style={{ marginTop: '1rem' }}>
        <Link className="btn" href="/playground">Open the playground</Link>
      </div>
    </div>
  );
}
