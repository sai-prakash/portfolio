import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="wrap section">
      <h1>That page isn&apos;t here.</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>It may have moved. Try the <Link href="/work">work</Link> or <Link href="/about">about</Link> pages, or go <Link href="/">home</Link>.</p>
    </div>
  );
}
