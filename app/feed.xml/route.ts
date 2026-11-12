export const dynamic = 'force-static';
import { getPosts } from '@/lib/content';
import { site } from '@/lib/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const items = getPosts().filter((p) => p.status === 'published').map((p) => `
    <item><title>${esc(p.title)}</title><link>${site.url}/writing/${p.slug}</link><guid>${site.url}/writing/${p.slug}</guid>
    <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)}: writing</title><link>${site.url}/writing</link><description>${esc(site.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
