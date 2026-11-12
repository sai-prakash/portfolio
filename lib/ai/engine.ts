'use client';
// Lazy WebLLM loader. Nothing is downloaded until a visitor asks for the model.
import type { MLCEngine, InitProgressReport } from '@mlc-ai/web-llm';

export const MODELS = {
  guide: { id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC', label: 'Qwen2.5 0.5B' },
  playground: { id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC', label: 'Qwen2.5 1.5B' },
} as const;
export type ModelKey = keyof typeof MODELS;

const engines = new Map<string, Promise<MLCEngine>>();

export async function hasWebGPU(): Promise<boolean> {
  try {
    const gpu = (navigator as any).gpu;
    if (!gpu) return false;
    const adapter = await gpu.requestAdapter();
    // The q4f16 models need 16-bit shader support.
    return !!adapter && !!adapter.features?.has?.('shader-f16');
  } catch {
    return false;
  }
}

export function getEngine(key: ModelKey, onProgress?: (p: InitProgressReport) => void) {
  const id = MODELS[key].id;
  if (!engines.has(id)) {
    engines.set(
      id,
      import('@mlc-ai/web-llm').then(({ CreateMLCEngine }) => CreateMLCEngine(id, { initProgressCallback: onProgress })).catch((e) => {
        engines.delete(id);
        throw e;
      }),
    );
  }
  return engines.get(id)!;
}

export function isLoaded(key: ModelKey) {
  return engines.has(MODELS[key].id);
}
