export const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';

// ID fourni par Umami Cloud après création du site (Settings > Websites > Edit).
// Tant qu'il est vide, le script de tracking n'est pas injecté.
export const UMAMI_WEBSITE_ID = '1bbd18ec-96ff-43de-9580-27e35fb04785';
// Seul le domaine de prod est suivi : ni localhost, ni les URL de prévisualisation Cloudflare.
export const UMAMI_DOMAINS = 'pierregorde.com';

export const EVENT_CTA_RDV = 'cta-rdv';
export const EVENT_LOCALE_SWITCH = 'locale-switch';
export const EVENT_CONTACT_EMAIL = 'contact-email';
export const EVENT_LINKEDIN = 'linkedin';
export const EVENT_GITHUB = 'github';
export const EVENT_SOURCE_CODE = 'source-code';
export const EVENT_PROJET = 'projet';
export const EVENT_CLIENT = 'client';
