function lum(hex: string) {
  const c = hex.slice(1).match(/../g)!.map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

export type RGBA = [number, number, number, number];

let probe: CanvasRenderingContext2D | null = null;
/** Parses any computed CSS colour (rgb, color(srgb ...), oklab ...) into 0-255 RGBA. */
export function parseCssColor(s: string): RGBA | null {
  const m = s.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) {
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [+m[1], +m[2], +m[3], a];
  }
  if (typeof document === 'undefined') return null;
  try {
    probe ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (!probe) return null;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = '#000';
    probe.fillStyle = s;
    probe.fillRect(0, 0, 1, 1);
    const d = probe.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  } catch {
    return null;
  }
}

export function toHex(c: [number, number, number] | RGBA) {
  return '#' + [c[0], c[1], c[2]].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function composite(top: RGBA, under: [number, number, number]): [number, number, number] {
  const a = top[3];
  return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a)];
}

/** First non-transparent background walking up from el, blended over whatever is beneath. */
export function effectiveBackground(el: Element): [number, number, number] {
  const layers: RGBA[] = [];
  for (let n: Element | null = el; n; n = n.parentElement) {
    const c = parseCssColor(getComputedStyle(n).backgroundColor);
    if (c && c[3] > 0) {
      layers.push(c);
      if (c[3] >= 0.99) break;
    }
  }
  let base: [number, number, number] = [255, 255, 255];
  const paper = parseCssColor(getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#fff');
  if (paper) base = [paper[0], paper[1], paper[2]];
  for (let i = layers.length - 1; i >= 0; i--) base = composite(layers[i], base);
  return base;
}
