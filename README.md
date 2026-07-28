# pierregorde.com

Site marketing de l'activité freelance solo de Pierre Gordé, dev TypeScript senior.

Ce n'est pas un portfolio : c'est un **site de vente**, conçu pour convertir des prospects qualifiés (porteurs de projet financés, CTO en recherche de renfort, dirigeants tech-enabled) en RDV gratuit, puis en mission.

## Stack

| Outil | Rôle |
|---|---|
| [Astro 6](https://astro.build) | Rendu statique SSG, TypeScript strict |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first, tokens via `@theme` |
| [Cloudflare Pages](https://pages.cloudflare.com) | Déploiement statique edge |
| [Cal.com](https://cal.com) | Prise de RDV intégrée |
| [Umami Cloud](https://umami.is) | Analytics RGPD-friendly sans cookies + events de clic |
| [Resend](https://resend.com) | Envoi du rapport hebdo analytics par email |
| [Microlink](https://microlink.io) | Screenshots sites clients (pré-résolus au build) |

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — positionnement, preuves sociales, personas |
| `/a-propos` | Profil, stack technique, parcours |
| `/methode` | Approche de travail, livrables, modalités |
| `/projets` | Sélection de 9 missions clients avec schémas d'architecture |
| `/projets/[slug]` | Détail mission — contexte, livrables, stack, aperçu site |
| `/porteur-projet` | Landing persona porteur de projet financé |
| `/cto-renfort` | Landing persona CTO en recherche de renfort |
| `/dirigeant` | Landing persona dirigeant à digitaliser |
| `/faq` | Questions fréquentes — méthode, collaboration, IA |
| `/posts` | Articles (à venir) |
| `/mentions-legales` | Mentions légales |

Chaque route existe aussi sous `/mu/…` : la variante mauricienne (voir « i18n » ci-dessous).

## i18n

Deux locales via l'i18n natif Astro (`astro.config.mjs`) :

| Locale | URL | Devise | Particularité |
|---|---|---|---|
| `fr` (défaut) | `/` | `700 € HT / jour` | — |
| `fr-MU` | `/mu/…` | `Rs 35 000 HT / zour` | Français + touches de kreol morisien |

- **Pages `/mu/`** : wrappers de 3 lignes dans `src/pages/mu/` qui réimportent la page FR
  comme composant — `Astro.currentLocale` est déduit de l'URL, pas du fichier.
- **Helpers** (`src/lib/i18n.ts`) : `useLocale(Astro.currentLocale)` fournit `t()` (override
  ponctuel par locale, greppable via `'fr-MU':`), `l()` (liens internes localisés) et `tjm`.
- **Sélecteur** : `LocaleSwitcher.astro` — select à drapeaux dans le Header (`<details>`,
  drapeau actif = langue de la page, menu listant toutes les locales) + chips FR/MU dans le
  drawer mobile. Pur lien — l'URL porte l'état, pas de localStorage.
- **SEO** : self-canonical par variante + hreflang `fr`/`fr-MU`/`x-default` (`BaseLayout`),
  sitemap i18n.
- **404** : servie depuis le build FR ; le clin d'oeil kreol sous `/mu/*` est un enhancement
  JS dans `404.astro`.

Ajouter une locale : une entrée dans `LOCALES` (`src/lib/locale.const.ts`), un drapeau dans
`Flag.astro`, un dossier de wrappers `src/pages/<prefix>/`, la locale dans `astro.config.mjs`
(bloc `i18n` + sitemap) et les routes dans `tests/qa-full.spec.ts`.

## Démarrer

```bash
npm install
npm run dev
# http://localhost:4321
```

## Commandes

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de dev avec HMR |
| `npm run build` | Build statique vers `./dist/` |
| `npm run preview` | Sert le build local avant deploy |
| `npm run check` | Type-check + diagnostic Astro |
| `npm run format` | Formate avec Prettier |
| `npm run lint` | Format + type-check |
| `npm run report:sample` | Aperçu HTML du rapport hebdo (données factices) |
| `npm run report:weekly` | Envoi réel du rapport hebdo (voir [scripts/weekly-report/](scripts/weekly-report/README.md)) |

## Structure

```
src/
├── components/
│   ├── layout/         Header, Footer, Container, LocaleSwitcher
│   └── ui/             Button, PrimaryCta, Reveal, Flag, DailyReportMockup…
├── layouts/
│   ├── BaseLayout      Squelette HTML, meta SEO, Open Graph, hreflang
│   └── SiteLayout      Header + main + Footer wrapping
├── lib/
│   ├── projets.const.ts  Données des 9 projets clients + schémas SVG
│   ├── projets.paths.ts  getStaticPaths partagé FR//mu/ (screenshots mémoïsés)
│   ├── site.const.ts     Constantes site (URLs, email, forfait)
│   ├── locale.const.ts   Config des locales (codes, drapeaux, devise, TJM)
│   ├── i18n.ts           Helpers useLocale / t / l / localizePath
│   ├── seo.const.ts      Defaults SEO et OG
│   ├── links.const.ts    Liens de navigation
│   └── analytics.const.ts  ID Umami + noms des events de clic
├── pages/              Routes file-based (voir tableau ci-dessus)
│   └── mu/             Wrappers de la variante mauricienne
└── styles/
    ├── global.css      Import Tailwind + base styles
    └── tokens.css      Tokens design (palette OKLCH, typo, spacing)

scripts/
└── weekly-report/      Rapport analytics hebdo par email (cron GitHub Actions)
```

## Conventions

- **TypeScript strict** — héritage `astro/tsconfigs/strict`, pas de `any`.
- **Tokens OKLCH** — aucune couleur en dur. Tout passe par `var(--color-*)`.
- **Constantes** — magic strings dans `src/lib/*.const.ts` en SCREAMING_SNAKE_CASE.
- **Pas de commentaires QUOI** — uniquement le POURQUOI non évident.
- **Commits conventionnés** : `<emoji> <type>(<scope>): <description>` ([gitmoji](https://gitmoji.dev)).

## Déploiement

- Hébergement : **Cloudflare Pages** — auto-deploy sur push `main`.
- Domaine : **pierregorde.com** via Cloudflare Registrar.
- Email : `contact@pierregorde.com` via Google Workspace.

## Analytics

- **Umami Cloud** injecté par `BaseLayout` en production uniquement, et seulement si
  `UMAMI_WEBSITE_ID` est renseigné dans `src/lib/analytics.const.ts`.
- Clics trackés via `data-umami-event` : CTA RDV (`cta-rdv`), email (`contact-email`),
  LinkedIn (`linkedin`), GitHub (`github`), sélecteur de langue (`locale-switch`).
- Rapport hebdo automatique chaque lundi 9h : voir [scripts/weekly-report/](scripts/weekly-report/README.md).
