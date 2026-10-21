export type LocaleCode = 'fr' | 'fr-MU';
export type FlagCountry = 'fr' | 'mu';
export type CurrencyCode = 'EUR' | 'MUR';

export type LocaleConfig = {
  /** Code passé aux helpers astro:i18n — valeur de Astro.currentLocale. */
  code: LocaleCode;
  /** Segment d'URL (null = locale par défaut, à la racine). */
  pathPrefix: string | null;
  hreflang: string;
  ogLocale: string;
  flag: FlagCountry;
  /** aria-label du lien qui mène VERS cette locale. */
  switchLabel: string;
  /** Code affiché à côté du drapeau dans le sélecteur. */
  shortLabel: string;
  currency: CurrencyCode;
  tjmAmount: number;
  tjmDisplay: string;
  hourlyAmount: number;
  hourlyDisplay: string;
  /** L'embed Cal.com n'accepte qu'un hexadécimal : équivalent sRGB du --orange de la locale. */
  calBrandColor: string;
};

export const LOCALES: readonly LocaleConfig[] = [
  {
    code: 'fr',
    pathPrefix: null,
    hreflang: 'fr',
    ogLocale: 'fr_FR',
    flag: 'fr',
    switchLabel: 'Voir la version française',
    shortLabel: 'FR',
    currency: 'EUR',
    tjmAmount: 700,
    tjmDisplay: '700 € HT / jour',
    hourlyAmount: 100,
    hourlyDisplay: '100 € HT / heure',
    calBrandColor: '#ec6e38',
  },
  {
    code: 'fr-MU',
    pathPrefix: 'mu',
    hreflang: 'fr-MU',
    ogLocale: 'fr_MU',
    flag: 'mu',
    switchLabel: 'Voir la version mauricienne',
    shortLabel: 'MU',
    currency: 'MUR',
    // Tarif entreprises mauriciennes : 600 € / jour et 85 € / heure (600 / 7, arrondi),
    // convertis au taux rond assumé de 50 Rs pour 1 €.
    tjmAmount: 30_000,
    tjmDisplay: 'Rs 30 000 HT / zour',
    hourlyAmount: 4_250,
    hourlyDisplay: 'Rs 4 250 HT / ler',
    calBrandColor: '#46b86e',
  },
] as const;

export const DEFAULT_LOCALE = LOCALES[0];
