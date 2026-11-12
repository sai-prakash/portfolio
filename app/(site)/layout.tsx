import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@fontsource/eczar/500.css';
import '@fontsource/eczar/600.css';
import '@fontsource/eczar/700.css';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import './interactions.css';
import './home.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AskSai from '@/components/AskSai';
import Eggs from '@/components/Eggs';
import AgentView from '@/components/AgentView';
import ContactDock from '@/components/ContactDock';
import Spotlight from '@/components/Spotlight';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';
import { themeScript } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s — Sai Prakash' },
  description: site.description,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml', 'text/plain': '/llms.txt' } },
  openGraph: { type: 'website', siteName: site.name, title: site.title, description: site.description, url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  authors: [{ name: site.name, url: site.url }],
};

export const viewport: Viewport = { themeColor: '#12163A' };

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  jobTitle: 'Staff Design Engineer',
  worksFor: { '@type': 'Organization', name: 'JPMorgan Chase' },
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
  email: `mailto:${site.email}`,
  sameAs: [site.linkedin, site.github],
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'BITS Pilani' }, { '@type': 'CollegeOrUniversity', name: 'Birla Institute of Technology, Mesra' }],
  knowsAbout: ['Design systems', 'AI agents', 'Model Context Protocol', 'LLM evaluation', 'Accessibility', 'WebGPU', 'React', 'Next.js', 'Applied AI'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <AskSai />
        <Eggs />
        <AgentView />
        <ContactDock />
        <Spotlight />
        <JsonLd data={person} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
