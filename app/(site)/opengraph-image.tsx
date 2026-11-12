import { ogImage, ogSize } from '@/components/og';
export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Sai Prakash: Built for people. Read by agents. Proven in production.';
export default function Image() {
  return ogImage('Built for people. Read by agents. Proven in production.', 'Staff Design Engineer · Applied AI');
}
