import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Track } from './site';

const ROOT = path.join(process.cwd(), 'content');
const showDrafts = process.env.SHOW_DRAFTS === '1' || process.env.NODE_ENV === 'development';

export type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  status: 'draft' | 'published';
  track: Track;
  tags: string[];
  body: string;
  readingMinutes: number;
};

export type CaseStudy = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  org: string;
  role: string;
  period: string;
  state: 'production' | 'shipped' | 'build' | 'oss';
  metric: string;
  metricLabel: string;
  order: number;
  status: 'draft' | 'published';
  track: Track;
  body: string;
};

function readDir(dir: string) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(full, f), 'utf8');
      const { data, content } = matter(raw);
      return { slug: f.replace(/\.mdx$/, ''), data, content };
    });
}

const toDate = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v) : undefined);

export function getPosts(): Post[] {
  return readDir('posts')
    .map(({ slug, data, content }) => ({
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ''),
      publishedAt: toDate(data.publishedAt) ?? '2026-01-01',
      updatedAt: toDate(data.updatedAt),
      status: (data.status ?? 'draft') as Post['status'],
      track: (data.track ?? 'both') as Track,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      body: content,
      readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
    }))
    .filter((p) => showDrafts || p.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

export function getWork(): CaseStudy[] {
  return readDir('work')
    .map(({ slug, data, content }) => ({
      slug,
      title: String(data.title ?? slug),
      headline: String(data.headline ?? ''),
      description: String(data.description ?? ''),
      org: String(data.org ?? ''),
      role: String(data.role ?? ''),
      period: String(data.period ?? ''),
      state: (data.state ?? 'shipped') as CaseStudy['state'],
      metric: String(data.metric ?? ''),
      metricLabel: String(data.metricLabel ?? ''),
      order: Number(data.order ?? 10),
      status: (data.status ?? 'draft') as CaseStudy['status'],
      track: (data.track ?? 'both') as Track,
      body: content,
    }))
    .filter((w) => showDrafts || w.status === 'published')
    .sort((a, b) => a.order - b.order);
}

export function getCase(slug: string) {
  return getWork().find((w) => w.slug === slug);
}

export function getTags() {
  const counts = new Map<string, number>();
  for (const p of getPosts()) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count, slug: tagSlug(tag) }));
}

export const tagSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const stateLabel: Record<CaseStudy['state'], string> = {
  production: 'In production',
  shipped: 'Shipped',
  build: 'In build',
  oss: 'Open source',
};

export function formatDate(d: string) {
  return new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
