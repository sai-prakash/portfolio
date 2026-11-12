'use client';
import { useState } from 'react';

export default function WebGPUCheck() {
  const [result, setResult] = useState<null | { ok: boolean; detail: string }>(null);
  async function run() {
    const gpu = (navigator as any).gpu;
    if (!gpu) return setResult({ ok: false, detail: 'This browser does not expose navigator.gpu. The site falls back to search-only answers.' });
    try {
      const adapter = await gpu.requestAdapter();
      if (!adapter) return setResult({ ok: false, detail: 'WebGPU exists but no adapter was granted (often a blocked or software GPU).' });
      const info = adapter.info || {};
      const f16 = adapter.features?.has?.('shader-f16');
      setResult({ ok: true, detail: `Adapter: ${[info.vendor, info.architecture].filter(Boolean).join(' ') || 'available'}. 16-bit shaders: ${f16 ? 'yes' : 'no'}. Max buffer: ${Math.round((adapter.limits?.maxBufferSize ?? 0) / 1048576)} MB.` });
    } catch (e: any) {
      setResult({ ok: false, detail: `Requesting an adapter failed: ${e?.message ?? e}` });
    }
  }
  return (
    <div className="demo-body">
      <button type="button" className="btn" onClick={run}>Check my browser</button>
      {result && (
        <ul className="checks" aria-live="polite" style={{ marginTop: '0.8rem' }}>
          <li className={result.ok ? 'ok' : 'fail'}>
            <span className="mark" aria-hidden="true">{result.ok ? '✓' : '✕'}</span>
            <span>{result.ok ? 'WebGPU is available' : 'No WebGPU here'}<small>{result.detail}</small></span>
          </li>
        </ul>
      )}
    </div>
  );
}
