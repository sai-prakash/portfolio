// Metadata only (no React imports) so Keystatic's config can list demos.
// To add a demo: build it in components/demos/, add it here, and map it in DemoRenderer.tsx.
export const DEMOS = {
  'checks-compare': { label: 'Same prompt, two agents (checks)' },
  'contrast-checker': { label: 'Token contrast checker' },
  'tiered-spec': { label: 'Tiered spec loader' },
  'webgpu-check': { label: 'Does your browser have WebGPU?' },
  'playground-teaser': { label: 'Playground teaser' },
  'two-readers': { label: 'One rule, two readers (seam)' },
  'pratyahara': { label: 'Pāṇini: two letters name a set' },
} as const;

export type DemoName = keyof typeof DEMOS;
