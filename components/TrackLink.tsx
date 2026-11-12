'use client';
import { track } from '@vercel/analytics';
import type { AnchorHTMLAttributes } from 'react';

/** A link that records a conversion event in Vercel Analytics (custom events need a Pro plan; page views work on every plan). */
export default function TrackLink({
  event,
  data,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { event: string; data?: Record<string, string> }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        try {
          track(event, { ...data, href: props.href ?? '' });
        } catch {}
        props.onClick?.(e);
      }}
    />
  );
}
