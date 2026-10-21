import { getRelativeLocaleUrl } from 'astro:i18n';

import { DEFAULT_LOCALE, LOCALES, type LocaleCode, type LocaleConfig } from './locale.const';

export function resolveLocale(currentLocale: string | undefined): LocaleConfig {
  return LOCALES.find((locale) => locale.code === currentLocale) ?? DEFAULT_LOCALE;
}

/**
 * Avec build.format: 'file', Astro.url.pathname vaut '/methode.html' ou '/index.html' au build :
 * on revient à l'URL publique servie par Cloudflare Pages.
 */
function toPublicPath(pathname: string): string {
  const path = pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  return path || '/';
}

export function stripLocalePrefix(rawPathname: string): string {
  const pathname = toPublicPath(rawPathname);
  for (const locale of LOCALES) {
    if (!locale.pathPrefix) continue;
    const prefix = `/${locale.pathPrefix}`;
    if (pathname === prefix || pathname === `${prefix}/`) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

/**
 * getRelativeLocaleUrl retourne '/mu/' pour la racine d'une locale préfixée,
 * malgré trailingSlash: 'never' — on normalise pour rester cohérent partout.
 */
export function localizePath(code: LocaleCode, path: string): string {
  const url = getRelativeLocaleUrl(code, path);
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

type LocaleHelpers = {
  locale: LocaleConfig;
  /** Chaîne FR avec overrides ponctuels par locale : t('Échange gratuit', { 'fr-MU': 'Nou kozé ?' }). */
  t: (fr: string, overrides?: Partial<Record<LocaleCode, string>>) => string;
  /** Localise un lien interne : l('/methode') → '/methode' ou '/mu/methode'. */
  l: (path: string) => string;
  tjm: string;
  hourly: string;
};

export function useLocale(currentLocale: string | undefined): LocaleHelpers {
  const locale = resolveLocale(currentLocale);
  return {
    locale,
    t: (fr, overrides) => overrides?.[locale.code] ?? fr,
    l: (path) => localizePath(locale.code, path),
    tjm: locale.tjmDisplay,
    hourly: locale.hourlyDisplay,
  };
}
