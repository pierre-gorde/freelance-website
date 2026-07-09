import type { MetricRow, WebsiteStats } from './umami.ts';

// Données factices pour prévisualiser le rendu du mail sans compte Umami (--sample).
export const SAMPLE_STATS: WebsiteStats = {
  pageviews: 412,
  visitors: 148,
  visits: 186,
  bounces: 82,
  totaltime: 15480,
  comparison: { pageviews: 305, visitors: 172, visits: 194, bounces: 101, totaltime: 11920 },
};

export const SAMPLE_TOP_PAGES: MetricRow[] = [
  { x: '/', y: 156 },
  { x: '/projets', y: 74 },
  { x: '/methode', y: 52 },
  { x: '/cto-renfort', y: 38 },
  { x: '/a-propos', y: 31 },
];

export const SAMPLE_TOP_REFERRERS: MetricRow[] = [
  { x: null, y: 88 },
  { x: 'linkedin.com', y: 47 },
  { x: 'google.com', y: 33 },
  { x: 'github.com', y: 12 },
];

export const SAMPLE_TOP_EVENTS: MetricRow[] = [
  { x: 'cta-rdv', y: 14 },
  { x: 'contact-email', y: 6 },
  { x: 'linkedin', y: 4 },
];
