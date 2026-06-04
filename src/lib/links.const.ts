export type NavLink = {
  href: string;
  label: string;
};

export const PRIMARY_NAV_LINKS: readonly NavLink[] = [
  { href: '/methode', label: 'Méthode' },
  { href: '/projets', label: 'Projets' },
  { href: '/posts', label: 'Posts' },
  { href: '/faq', label: 'FAQ' },
  { href: '/a-propos', label: 'À propos' },
] as const;

export const PERSONA_LINKS: readonly NavLink[] = [
  { href: '/porteur-projet', label: 'Porteur de projet' },
  { href: '/cto-renfort', label: 'CTO / lead dev' },
  { href: '/dirigeant', label: 'Dirigeant' },
] as const;

export const CTA_RDV_HREF = '/rdv';
export const CTA_RDV_LABEL = 'Réserver un échange gratuit';
