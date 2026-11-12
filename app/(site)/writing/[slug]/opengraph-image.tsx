import { ogImage, ogSize } from '@/components/og';
import { getPost, getPosts } from '@/lib/content';
export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Article by Sai Prakash';
export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  return ogImage(p?.title ?? 'Writing', 'Writing');
}
