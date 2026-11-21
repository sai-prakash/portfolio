// Prints /cv to a tagged A4 PDF with real Unicode text (Chromium), so ATS parsers read it cleanly.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const OUT = 'public/Sai_Prakash_Staff_Design_Engineer.pdf';
const { url, stop } = await serve();
try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${url}/cv`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, tagged: true, outline: true, margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' } });
  await browser.close();
  console.log(`Wrote ${OUT}`);
} finally { stop(); }
