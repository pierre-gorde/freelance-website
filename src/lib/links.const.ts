import type { LocaleCode } from './locale.const';

export type NavLink = {
  href: string;
  label: string;
  labelOverrides?: Partial<Record<LocaleCode, string>>;
};

export const PRIMARY_NAV_LINKS: readonly NavLink[] = [
  { href: '/projets', label: 'Projets', labelOverrides: { 'fr-MU': 'Bann proze' } },
  { href: '/methode', label: 'Méthode', labelOverrides: { 'fr-MU': 'Metod' } },
  { href: '/a-propos', label: 'À propos', labelOverrides: { 'fr-MU': 'Lor mwa' } },
  { href: '/faq', label: 'FAQ', labelOverrides: { 'fr-MU': 'Bann kestion' } },
] as const;

export const PERSONA_LINKS: readonly NavLink[] = [
  { href: '/cto-renfort', label: 'Chef de projet, CTO' },
  { href: '/sans-equipe-tech', label: "Pas d'équipe tech" },
] as const;
