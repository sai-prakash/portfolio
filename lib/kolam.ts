/**
 * Pulli kolam: dots on a lattice, and lines that loop around every dot without touching one.
 * Between two neighbouring dots the lines cross; at an open side the line curves around the dot.
 * trace() walks the pattern and returns each closed line as an SVG path, with the places it turns.
 */
export type Dot = { c: number; r: number };
export type Turn = { at: number; c: number; r: number };
export type Loop = { d: string; length: number; turns: Turn[] };

const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];
const AX = [1, -1, -1, 1];
const AY = [1, 1, -1, -1];

export const key = (c: number, r: number) => `${c},${r}`;

export function trace(dots: Set<string>, s: number, pad: number): Loop[] {
  const q = s / 4;
  const rad = q * Math.SQRT2;
  const lineLen = q * Math.SQRT2;
  const arcLen = (Math.PI / 2) * rad;
  const seen = new Set<string>();
  const loops: Loop[] = [];
  const f = (n: number) => Math.round(n * 100) / 100;
  for (const id of dots) {
    const [c0, r0] = id.split(',').map(Number);
    for (let k0 = 0; k0 < 4; k0++) {
      if (seen.has(`${id},${k0}`)) continue;
      let c = c0, r = r0, k = k0, cw = true, len = 0;
      const turns: Turn[] = [];
      let d = `M${f(pad + c * s + AX[k] * q)} ${f(pad + r * s + AY[k] * q)}`;
      let guard = 0;
      do {
        seen.add(`${key(c, r)},${k}`);
        const j = cw ? (k + 1) % 4 : k;
        const nc = c + DX[j], nr = r + DY[j];
        if (dots.has(key(nc, nr))) {
          const nk = cw ? (j + 1) % 4 : (j + 2) % 4;
          d += `L${f(pad + nc * s + AX[nk] * q)} ${f(pad + nr * s + AY[nk] * q)}`;
          len += 2 * lineLen;
          c = nc; r = nr; k = nk; cw = !cw;
        } else {
          const nk = cw ? (k + 1) % 4 : (k + 3) % 4;
          d += `A${f(rad)} ${f(rad)} 0 0 ${cw ? 1 : 0} ${f(pad + c * s + AX[nk] * q)} ${f(pad + r * s + AY[nk] * q)}`;
          turns.push({ at: len + arcLen / 2, c, r });
          len += arcLen;
          k = nk;
        }
      } while (!(c === c0 && r === r0 && k === k0) && ++guard < 20000);
      loops.push({ d: d + 'Z', length: len, turns });
    }
  }
  return loops.sort((a, b) => b.length - a.length);
}

/** A diamond of dots, the classic starting shape: 1, 3, 5 … n … 5, 3, 1. */
export function diamond(n: number, size: number): Set<string> {
  const out = new Set<string>();
  const m = (size - 1) / 2, h = (n - 1) / 2;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (Math.abs(c - m) + Math.abs(r - m) <= h) out.add(key(c, r));
  return out;
}
