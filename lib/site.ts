export const site = {
  name: 'Sai Prakash',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://saiprakash.design').replace(/\/$/, ''),
  title: 'Sai Prakash — Staff Design Engineer and Applied AI Engineer',
  tagline: 'Built for people. Read by agents. Proven in production.',
  description:
    'Sai Prakash ships LLM products, builds the tooling that lets coding agents use a design system properly, and measures whether it works. Staff Design Engineer at JPMorgan Chase, Bengaluru.',
  email: 'saiprak@gmail.com',
  linkedin: 'https://www.linkedin.com/in/prakashsai/',
  github: 'https://github.com/sai-prakash',
  location: 'Bengaluru, India',
  // Booking link for recruiters. Leave empty to fall back to email.
  calendar: '',
  // Your usual working hours in Bengaluru (IST, UTC+5:30), used by the time-zone overlap on /hire.
  workHours: { start: 9, end: 18 },
  // Show relocation details (start date, EU Blue Card) on /hire. Off until you decide to say it publicly.
  showRelocation: false,
} as const;

export const tracks = {
  'applied-ai': 'Applied AI',
  'design-engineering': 'Design engineering',
  both: 'Both',
} as const;
export type Track = keyof typeof tracks;
