import type { Metadata } from 'next';
import Playground from '@/components/Playground';

export const metadata: Metadata = {
  title: 'Playground: an in-browser LLM builds UI, checks grade it',
  description: 'A small language model runs in your browser with WebGPU, builds UI from this site’s design system, and six automated checks grade the result. Feed the failures back and watch it fix them.',
  alternates: { canonical: '/playground' },
};

export default function PlaygroundPage() {
  return (
    <div className="wrap section">
      <h1 style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.03em', maxWidth: '16ch' }}>Watch an agent get it wrong, then right.</h1>
      <p className="lede" style={{ marginTop: '1rem' }}>
        A small model builds UI using only this site&apos;s design system. Six checks grade the output. Feed the failures back and it tries again. With WebGPU the model runs on your device; without it, you see recorded runs graded by the same checks.
      </p>
      <div style={{ marginTop: '2.5rem' }}><Playground /></div>
    </div>
  );
}
