export const dynamic = 'force-static';
import fs from 'node:fs';
import path from 'node:path';
import { getPosts, getWork } from '@/lib/content';
import { site } from '@/lib/site';

// llms.txt: a plain-text map of the site for AI agents and answer engines.
export function GET() {
  const about = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'about.json'), 'utf8')) as { facts: { topic: string; text: string }[] };
  const work = getWork().filter((w) => w.status === 'published');
  const posts = getPosts().filter((p) => p.status === 'published');
  const body = `# ${site.name}

> ${site.description}

${about.facts.map((f) => `- ${f.topic}: ${f.text}`).join('\n')}

## Case studies
${work.map((w) => `- [${w.title}](${site.url}/work/${w.slug}): ${w.headline}`).join('\n')}

## Articles
${posts.map((p) => `- [${p.title}](${site.url}/writing/${p.slug}): ${p.description}`).join('\n') || '- Coming soon'}

## Contact
- Email: ${site.email}
- LinkedIn: ${site.linkedin}
- GitHub: ${site.github}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
