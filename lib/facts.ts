import raw from '@/content/facts.json';

export interface Metric {
  id: string;
  value: string | null;
  kbStatus: 'verified' | 'reported' | 'conflicting' | 'unverified';
  cleared: boolean | null;
  source: string | null;
}
export interface Role { org: string; title: string | null; start: string | null; end: string | null }
export interface Recommendation { quote: string; name: string; relation: string; approved: boolean }
export interface Facts {
  vpSince: string | null;
  roles: Role[];
  noticePeriod: string | null;
  germanCEFR: string | null;
  otherLanguages: string | null;
  workAuth: Record<'EU' | 'UK' | 'US' | 'CA', string | null>;
  relocation: string | null;
  metrics: Metric[];
  ceoAward: string | null;
  patentWording: string | null;
  sapProducts: string | null;
  photo: string | null;
  recommendations: Recommendation[];
  calendarUrl: string | null;
}

export const facts = raw as Facts;

/** A metric renders only when the KB says verified AND Sai has cleared it. Otherwise: null, and the caller hides it. */
export function clearedMetric(id: string): Metric | null {
  const m = facts.metrics.find((x) => x.id === id);
  if (!m || !m.value || m.cleared !== true || m.kbStatus !== 'verified') return null;
  return m;
}
