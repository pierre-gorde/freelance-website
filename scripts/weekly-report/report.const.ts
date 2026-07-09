export const RESEND_API_URL = 'https://api.resend.com/emails';
export const UMAMI_DASHBOARD_URL = 'https://cloud.umami.is';

export const REPORT_TIMEZONE = 'Europe/Paris';
export const REPORT_LOCALE = 'fr-FR';
export const TOP_ROWS_LIMIT = 8;

export const SITE_LABEL = 'pierregorde.com';
export const EMAIL_SUBJECT_PREFIX = 'Rapport hebdo';
export const DIRECT_REFERRER_LABEL = 'Accès direct';

// Emails HTML : pas de système de theme possible, les couleurs vivent ici.
// Palette alignée sur les tokens du site (vert primary-700, gris neutres).
export const EMAIL_COLORS = {
  text: '#1f2733',
  muted: '#5f6b7a',
  accent: '#1a5231',
  border: '#e4e8ec',
  bgSubtle: '#f6f8f7',
} as const;
