// The CV PDF must parse in order (names, titles, dates, email), carry no photo/DOB/marital status, and fit two pages.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const PDF = 'public/Sai_Prakash_Staff_Design_Engineer.pdf';
if (!fs.existsSync(PDF)) { console.error(`${PDF} missing. Run npm run cv:pdf`); process.exit(1); }

let text, pages;
const t = spawnSync('pdftotext', ['-layout', PDF, '-'], { encoding: 'utf8' });
if (t.status === 0) {
  text = t.stdout;
  pages = Number(/Pages:\s+(\d+)/.exec(spawnSync('pdfinfo', [PDF], { encoding: 'utf8' }).stdout)?.[1]);
} else { // no poppler: PyMuPDF gives the same extraction-order view
  const py = spawnSync('python3', ['-I', '-c', 'import pymupdf,sys;d=pymupdf.open(sys.argv[1]);print(d.page_count);print("\\f".join(p.get_text() for p in d))', PDF], { encoding: 'utf8' });
  if (py.status !== 0) { console.error('Need pdftotext (poppler) or PyMuPDF to check the PDF.'); process.exit(1); }
  const [n, ...rest] = py.stdout.split('\n');
  pages = Number(n); text = rest.join('\n');
}

const problems = [];
const order = ['Sai Prakash', 'Staff Design Engineer', 'saiprak@gmail.com', 'Summary', 'Experience', 'JPMorgan Chase', 'SAP', 'Skills', 'Education'];
let at = -1;
for (const s of order) { const i = text.indexOf(s, at + 1); if (i < 0) problems.push(`missing or out of order: "${s}"`); else at = i; }
if (pages > 2) problems.push(`${pages} pages, max 2`);
if (/[�\u0000]/.test(text)) problems.push('garbled characters in text layer');
if (/date of birth|marital|\bDOB\b/i.test(text)) problems.push('contains DOB or marital status');
if (/\bNaN\b|undefined/.test(text)) problems.push('NaN/undefined in text');
if (problems.length) { console.error('CV PDF check FAILED:\n  - ' + problems.join('\n  - ')); process.exit(1); }
console.log(`CV PDF ok: ${pages} page(s), text order verified.`);
