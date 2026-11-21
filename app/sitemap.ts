import type { MetadataRoute } from 'next';
import { getPosts, getTags, getWork, writingLive } from '@/lib/content';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().slice(0, 10);
  const pub = (s: string) => s === 'published';
  return [
    ...['', '/work', ...(writingLive() ? ['/writing'] : []), '/about', '/hire', '/cv', '/playground', '/system', '/accessibility'].map((p) => ({ url: `${site.url}${p}`, lastModified: now, priority: p === '' ? 1 : 0.8 })),
    ...getWork().filter((w) => pub(w.status)).map((w) => ({ url: `${site.url}/work/${w.slug}`, lastModified: now, priority: 0.8 })),
    ...(writingLive() ? getPosts() : []).filter((p) => pub(p.status)).map((p) => ({ url: `${site.url}/writing/${p.slug}`, lastModified: p.updatedAt ?? p.publishedAt, priority: 0.7 })),
    ...(writingLive() ? getTags() : []).map((t) => ({ url: `${site.url}/writing/tag/${t.slug}`, lastModified: now, priority: 0.4 })),
  ];
}
