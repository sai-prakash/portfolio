export type Passage = { id: string; kind: string; title: string; heading: string; url: string; text: string };

const STOP = new Set('a an and are as at be but by can do does for from has have he his how i in is it its me my of on or our sai sai\'s so that the their them there this to was what when where which who why will with you your about prakash know knows tell did any much many also like could would should ever been him they them work worked experience does has have'.split(' '));
const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').split(' ').filter((w) => w.length > 1 && !STOP.has(w));

let cache: Promise<{ docs: Passage[]; tf: Map<string, number>[]; df: Map<string, number>; avg: number }> | null = null;

function load() {
  cache ??= fetch('/search-index.json')
    .then((r) => r.json())
    .then((docs: Passage[]) => {
      const tf = docs.map((d) => {
        const m = new Map<string, number>();
        for (const w of tok(`${d.title} ${d.heading} ${d.text}`)) m.set(w, (m.get(w) ?? 0) + 1);
        return m;
      });
      const df = new Map<string, number>();
      for (const m of tf) for (const w of m.keys()) df.set(w, (df.get(w) ?? 0) + 1);
      const avg = tf.reduce((s, m) => s + [...m.values()].reduce((a, b) => a + b, 0), 0) / Math.max(1, tf.length);
      return { docs, tf, df, avg };
    });
  return cache;
}

/** BM25 over the site's own passages. Small enough to run in the browser instantly. */
export async function retrieve(query: string, k = 4): Promise<Passage[]> {
  const { docs, tf, df, avg } = await load();
  const q = tok(query);
  const N = docs.length, k1 = 1.4, b = 0.75;
  const scored = docs.map((d, i) => {
    const m = tf[i];
    const len = [...m.values()].reduce((a, c) => a + c, 0);
    let s = 0;
    for (const w of q) {
      const f = m.get(w) ?? 0;
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(w) ?? 0) + 0.5) / ((df.get(w) ?? 0) + 0.5));
      s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * len) / avg)));
    }
    if (d.kind === 'about') s *= 1.15;
    return { d, s };
  });
  return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k).map((x) => x.d);
}
