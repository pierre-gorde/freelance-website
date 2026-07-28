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
    // Équivalent rond assumé du TJM 700 € (taux réel ~54, taux implicite 50).
    tjmAmount: 35_000,
    tjmDisplay: 'Rs 35 000 HT / zour',
  },
] as const;

export const DEFAULT_LOCALE = LOCALES[0];
