import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true;
  return {
    rules: isProd ? [{ userAgent: '*', allow: '/', disallow: ['/keystatic', '/api/'] }] : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
