// Shared helper: start `next start` on a free port and return { url, stop }. Used by the PDF, screenshot and audit scripts.
import { spawn } from 'node:child_process';
import net from 'node:net';

const free = () => new Promise((res) => { const s = net.createServer().listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });

export async function serve() {
  const port = process.env.PORT ? Number(process.env.PORT) : await free();
  const proc = spawn('npx', ['next', 'start', '-p', String(port)], { stdio: 'ignore' });
  const url = `http://localhost:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(url)).ok) return { url, stop: () => proc.kill() }; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  proc.kill();
  throw new Error('server did not start');
}
