export const IDENTITY = 'I build the design-system spec that coding agents read, and the checks that show they followed it.';

export const site = {
  name: 'Sai Prakash',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://saiprakash.design').replace(/\/$/, ''),
  title: 'Sai Prakash, Staff Design Engineer',
  tagline: 'Built for people. Read by agents. Proven in production.',
  description:
    'Sai Prakash is a Staff Design Engineer. He builds the design-system specs that coding agents read and the checks that show they followed them. Based in Bengaluru, open to Europe.',
  email: 'saiprak@gmail.com',
  linkedin: 'https://www.linkedin.com/in/prakashsai/',
  github: 'https://github.com/sai-prakash',
  location: 'Bengaluru, India',
  // Your usual working hours in Bengaluru (IST, UTC+5:30), used by the time-zone overlap on /hire.
  workHours: { start: 9, end: 18 },
} as const;

export const tracks = {
  'applied-ai': 'Applied AI',
  'design-engineering': 'Design engineering',
  both: 'Both',
} as const;
export type Track = keyof typeof tracks;
