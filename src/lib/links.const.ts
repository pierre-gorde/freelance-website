import type { LocaleCode } from './locale.const';

export type NavLink = {
  href: string;
  label: string;
  labelOverrides?: Partial<Record<LocaleCode, string>>;
};

export const PRIMARY_NAV_LINKS: readonly NavLink[] = [
  { href: '/methode', label: 'Méthode', labelOverrides: { 'fr-MU': 'Metod' } },
  { href: '/projets', label: 'Projets', labelOverrides: { 'fr-MU': 'Bann proze' } },
  { href: '/posts', label: 'Posts', labelOverrides: { 'fr-MU': 'Bann post' } },
  { href: '/faq', label: 'FAQ', labelOverrides: { 'fr-MU': 'Bann kestion' } },
  { href: '/a-propos', label: 'À propos', labelOverrides: { 'fr-MU': 'Lor mwa' } },
] as const;

export const PERSONA_LINKS: readonly NavLink[] = [
  {
    href: '/porteur-projet',
    label: 'Porteur de projet',
    labelOverrides: { 'fr-MU': 'Porter proze' },
  },
  { href: '/cto-renfort', label: 'CTO / lead dev' },
  { href: '/dirigeant', label: 'Dirigeant', labelOverrides: { 'fr-MU': 'Patron' } },
] as const;
