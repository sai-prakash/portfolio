import { ogImage, ogSize } from '@/components/og';
import { getCase, getWork } from '@/lib/content';
export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Case study by Sai Prakash';
export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }));
}
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  return ogImage(c?.headline || c?.title || 'Work', `Case study · ${c?.title ?? ''}`);
}
