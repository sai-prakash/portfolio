// Builds public/search-index.json: the passages the in-browser guide retrieves from.
// Runs before every build (npm "prebuild"). Respects draft status like the site does.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const showDrafts = process.env.SHOW_DRAFTS === '1';
const out = [];

function clean(md) {
  return md
    .replace(/<EditorNote>[\s\S]*?<\/EditorNote>/g, '')
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<\/?[A-Z][^>]*>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function chunk(kind, dir, urlBase) {
  const full = path.join(root, 'content', dir);
  if (!fs.existsSync(full)) return;
  for (const f of fs.readdirSync(full).filter((x) => x.endsWith('.mdx'))) {
    const { data, content } = matter(fs.readFileSync(path.join(full, f), 'utf8'));
    if (!showDrafts && data.status !== 'published') continue;
    const slug = f.replace(/\.mdx$/, '');
    const url = `${urlBase}/${slug}`;
    const title = String(data.title);
    const intro = [data.headline, data.description].filter(Boolean).join(' ');
    if (intro) out.push({ id: `${slug}#intro`, kind, title, heading: title, url, text: intro });
    const sections = content.split(/\n(?=## )/);
    for (const s of sections) {
      const m = s.match(/^## (.+)/);
      const heading = m ? m[1].trim() : title;
      const text = clean(m ? s.slice(m[0].length) : s);
      if (text.split(' ').length < 12) continue;
      // split long sections into ~180-word passages
      const words = text.split(' ');
      for (let i = 0; i < words.length; i += 180) {
        out.push({ id: `${slug}#${out.length}`, kind, title, heading, url: url + (m ? '#' + heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : ''), text: words.slice(i, i + 200).join(' ') });
      }
    }
  }
}

chunk('case study', 'work', '/work');
chunk('article', 'posts', '/writing');

// Facts a recruiter asks about, from content/about.json
const about = JSON.parse(fs.readFileSync(path.join(root, 'content', 'about.json'), 'utf8'));
for (const [i, fact] of about.facts.entries()) {
  out.push({ id: `about#${i}`, kind: 'about', title: 'About Sai', heading: fact.topic, url: '/hire', text: fact.text });
}

fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'search-index.json'), JSON.stringify(out));
console.log(`search index: ${out.length} passages`);
