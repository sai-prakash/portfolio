'use client';
import dynamic from 'next/dynamic';
import { DEMOS, type DemoName } from './registry';

const map = {
  'checks-compare': dynamic(() => import('./ChecksCompare')),
  'contrast-checker': dynamic(() => import('./ContrastChecker')),
  'tiered-spec': dynamic(() => import('./TieredSpec')),
  'webgpu-check': dynamic(() => import('./WebGPUCheck')),
  'playground-teaser': dynamic(() => import('./PlaygroundTeaser')),
} satisfies Record<DemoName, unknown>;

export default function DemoRenderer({ name, caption }: { name: string; caption?: string }) {
  const Comp = map[name as DemoName];
  const label = DEMOS[name as DemoName]?.label;
  if (!Comp) return <p className="callout warn">Unknown demo “{name}”. Add it to components/demos/registry.ts.</p>;
  return (
    <figure className="demo" aria-label={label}>
      <Comp />
      {caption ? <figcaption className="demo-caption">{caption}</figcaption> : null}
    </figure>
  );
}
