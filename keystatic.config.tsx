import { config, collection, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';
import { DEMOS } from './components/demos/registry';

/**
 * Content model.
 * - Articles and case studies are MDX files in /content, edited at /keystatic.
 * - Interactive demos are React components registered in components/demos/registry.ts.
 *   Editors insert them from the "+" menu as a "Live demo" block; any other web demo
 *   (Vercel, CodePen, StackBlitz, Observable) goes in an "Embed" block.
 */

const storage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? ({ kind: 'github', repo: 'sai-prakash/portfolio' } as const)
    : ({ kind: 'local' } as const);

const track = fields.select({
  label: 'Who is this for',
  description: 'Drives the role switch on the home page.',
  options: [
    { label: 'Applied AI', value: 'applied-ai' },
    { label: 'Design engineering', value: 'design-engineering' },
    { label: 'Both', value: 'both' },
  ],
  defaultValue: 'both',
});

const status = fields.select({
  label: 'Status',
  description: 'Only "Published" shows on the live site. Drafts show on preview deployments.',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
});

const components = {
  Demo: block({
    label: 'Live demo',
    description: 'An interactive demo built into this site.',
    schema: {
      name: fields.select({
        label: 'Demo',
        options: Object.entries(DEMOS).map(([value, d]) => ({ label: d.label, value })),
        defaultValue: Object.keys(DEMOS)[0],
      }),
      caption: fields.text({ label: 'Caption' }),
    },
  }),
  Embed: block({
    label: 'Embed',
    description: 'Any web-based demo by URL, shown in a sandboxed frame.',
    schema: {
      src: fields.url({ label: 'URL', validation: { isRequired: true } }),
      title: fields.text({ label: 'Title (read by screen readers)', validation: { length: { min: 1 } } }),
      height: fields.integer({ label: 'Height in pixels', defaultValue: 480 }),
    },
  }),
  BeforeAfter: block({
    label: 'Before / after',
    schema: {
      label: fields.text({ label: 'What was measured' }),
      before: fields.number({ label: 'Before', validation: { isRequired: true } }),
      after: fields.number({ label: 'After', validation: { isRequired: true } }),
      unit: fields.text({ label: 'Unit', defaultValue: 'min' }),
    },
  }),
  Figure: block({
    label: 'Image',
    schema: {
      src: fields.image({ label: 'Image', directory: 'public/images', publicPath: '/images/' }),
      alt: fields.text({ label: 'Alt text', validation: { length: { min: 1 } } }),
      caption: fields.text({ label: 'Caption' }),
    },
  }),
  Callout: wrapper({
    label: 'Callout',
    schema: {
      tone: fields.select({
        label: 'Tone',
        options: [
          { label: 'Note', value: 'note' },
          { label: 'Key point', value: 'key' },
          { label: 'Warning', value: 'warn' },
        ],
        defaultValue: 'note',
      }),
    },
  }),
  EditorNote: wrapper({
    label: 'Editor note (never published)',
    description: 'Reminders for yourself. Hidden on the live site.',
    schema: {},
  }),
};

export default config({
  storage,
  ui: {
    brand: { name: 'Sai Prakash' },
    navigation: { Content: ['posts', 'work'] },
  },
  collections: {
    posts: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'status', 'publishedAt'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Search description',
          description: '140–160 characters. Shown in Google results and link previews.',
          multiline: true,
          validation: { length: { min: 50, max: 180 } },
        }),
        publishedAt: fields.date({ label: 'Published', validation: { isRequired: true } }),
        updatedAt: fields.date({ label: 'Updated' }),
        status,
        track,
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
        content: fields.mdx({ label: 'Article', extension: 'mdx', components }),
      },
    }),
    work: collection({
      label: 'Case studies',
      slugField: 'title',
      path: 'content/work/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'status', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        headline: fields.text({ label: 'One-line outcome', description: 'e.g. "A 218-minute task now takes 37."' }),
        description: fields.text({ label: 'Search description', multiline: true }),
        org: fields.text({ label: 'Where' }),
        role: fields.text({ label: 'My role' }),
        period: fields.text({ label: 'When' }),
        state: fields.select({
          label: 'Project state',
          options: [
            { label: 'In production', value: 'production' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'In build', value: 'build' },
            { label: 'Open source', value: 'oss' },
          ],
          defaultValue: 'shipped',
        }),
        metric: fields.text({ label: 'Headline number', description: 'e.g. 83%' }),
        metricLabel: fields.text({ label: 'What the number means' }),
        order: fields.integer({ label: 'Order on the work page', defaultValue: 10 }),
        status,
        track,
        content: fields.mdx({ label: 'Case study', extension: 'mdx', components }),
      },
    }),
  },
});
