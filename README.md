# pierregorde.com

Site marketing de l'activité freelance solo de Pierre Gordé, développeur TypeScript freelance.

Ce n'est pas un portfolio : c'est un **site de vente**. Cible prioritaire : le chef de projet ou le CTO d'une startup ou d'une PME qui cherche un freelance pour le projet que son équipe n'a pas le temps de prendre. Objectif : un échange de 30 minutes réservé sur Cal.com, puis une mission.

## Stack

| Outil | Rôle |
|---|---|
| [Astro 6](https://astro.build) | Rendu statique SSG, TypeScript strict, images optimisées (`astro:assets`) |
| [Tailwind CSS v4](https://tailwindcss.com) | Reset de base ; le style passe par les tokens CSS et les styles scopés des composants |
| [GSAP 3](https://gsap.com) + ScrollTrigger | Animations au défilement (bundlé, pas de CDN) |
| [Archivo](https://fonts.google.com/specimen/Archivo) | Police variable auto-hébergée (`@fontsource-variable/archivo`, axes largeur et graisse) |
| [Cloudflare Pages](https://pages.cloudflare.com) | Déploiement statique edge, redirections dans `public/_redirects` |
| [Cal.com](https://cal.com) | Prise de RDV intégrée |
| [Umami Cloud](https://umami.is) | Analytics sans cookies + events de clic |
| [Resend](https://resend.com) | Envoi du rapport hebdo analytics par email |

## Pages

| Route | Description |
|---|---|
| `/` | Home : hero et compte-rendu qui s'écrit, bandeau clients, projets en bande horizontale, démarrage, compte-rendu, qui je suis |
| `/projets` | Les 9 projets, cartes de même hauteur |
| `/projets/[slug]` | Fiche projet : contexte, livrables, stack, capture du site, schéma d'architecture |
| `/methode` | Compte-rendu du soir, déroulé d'une mission, modalités, IA |
| `/a-propos` | Parcours, stack réelle, pourquoi le solo |
| `/faq` | Questions fréquentes, groupées |
| `/cto-renfort` | Page de la cible prioritaire : chef de projet, CTO, lead dev |
| `/sans-equipe-tech` | Porteurs de projet et dirigeants sans équipe tech (remplace `/porteur-projet` et `/dirigeant`, redirigées en 301) |
| `/posts` | Vide pour l'instant : hors navigation, `noindex`, hors sitemap |
| `/mentions-legales` | Mentions légales (`noindex`, hors sitemap) |

Chaque route existe aussi sous `/mu/…` : la variante mauricienne (voir « i18n » ci-dessous).

## Design

Charte pop-art tirée du portrait illustré : papier et encre, orange de la peau, cyan du t-shirt, trame de points, bordures noires de 2 px et ombres dures. Tokens dans `src/styles/tokens.css`, classes partagées (`.btn`, `.stamp`, `.chip`, `.tone-*`, `.display`) dans `src/styles/global.css`.

### Animations

- **Au-dessus de la ligne de flottaison** : animations CSS uniquement (`SlamTitle`, portrait qui s'imprime en trame). Le texte n'est jamais masqué en attendant le JS, le LCP reste immédiat.
- **Au défilement** : `src/scripts/motion.ts`, piloté par attributs, chargé sur toutes les pages.

  | Attribut | Effet |
  |---|---|
  | `data-slam` | Les mots du titre se posent un par un |
  | `data-rise` | Les enfants montent en léger désordre |
  | `data-stamp` | Le tampon s'écrase |
  | `data-pop` | Pastilles et numéros qui sautent |
  | `data-flip` | Les cartes pivotent (étapes) |
  | `data-line` | Le trait se dessine avec le défilement |
  | `data-wipe="diag\|left\|right"` | La section se dévoile en balayage |
  | `data-tilt="from,to"` | Rotation liée au défilement |
  | `data-print` | L'image s'imprime en trame de points |
  | `data-draw` | Schéma d'architecture : flèches tracées, boîtes posées |
  | `data-burst`, `data-magnet`, `data-wordmark`, `data-page-progress` | Étoile du bloc final, boutons aimantés, grand nom du pied de page, barre de progression |

- **Home** : `src/scripts/home.ts` (compte-rendu tapé, portrait qui suit la souris, bandeau clients qui accélère avec le défilement, bande projets épinglée sur desktop).
- **Transitions de page** : View Transitions natives entre pages (`@view-transition`), la carte projet se transforme en en-tête de fiche.
- **`prefers-reduced-motion`** : tout est coupé, la page reste complète et statique.

## i18n

Deux locales via l'i18n natif Astro (`astro.config.mjs`) :

| Locale | URL | Tarif | Particularité |
|---|---|---|---|
| `fr` (défaut) | `/` | `700 € HT / jour`, `100 € HT / heure` | |
| `fr-MU` | `/mu/…` | `Rs 30 000 HT / zour`, `Rs 4 250 HT / ler` (600 € et 85 € à 50 Rs) | Français + touches de kreol morisien |

- **Pages `/mu/`** : wrappers de 3 lignes dans `src/pages/mu/` qui réimportent la page FR
  comme composant. `Astro.currentLocale` est déduit de l'URL, pas du fichier.
- **Helpers** (`src/lib/i18n.ts`) : `useLocale(Astro.currentLocale)` fournit `t()` (override
  ponctuel par locale, greppable via `'fr-MU':`), `l()` (liens internes localisés), `tjm` et `hourly`.
- **Sélecteur** : `LocaleSwitcher.astro`, pastilles FR/MU dans le pied de page et dans le menu
  mobile. Pur lien : l'URL porte l'état, pas de localStorage.
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
| `npx playwright test` | Tests de bout en bout (preview lancée sur le port 4321) |
| `npm run report:sample` | Aperçu HTML du rapport hebdo (données factices) |
| `npm run report:weekly` | Envoi réel du rapport hebdo (voir [scripts/weekly-report/](scripts/weekly-report/README.md)) |

## Structure

```
src/
├── assets/             Portrait, photo, avatar, captures des sites clients (optimisés au build)
├── components/
│   ├── home/           Sections de la home (Hero, ClientsBand, ProjetStrip, ReportShowcase, About)
│   ├── layout/         Header, Footer, LocaleSwitcher
│   ├── projets/        ProjetCard, ProjetSchema, ProjetsSelection
│   ├── report/         DailyReport (le compte-rendu du soir)
│   └── ui/             PrimaryCta, SlamTitle, PageHero, Steps, Engagements, FaqList, FaqSection, FinalCta, Flag, CopyEmail
├── layouts/
│   ├── BaseLayout      Squelette HTML, police, meta SEO, Open Graph, hreflang, Cal.com, motion
│   └── SiteLayout      Header + main + Footer
├── lib/
│   ├── projets.const.ts  Les 9 projets : textes, tampon, couleur, fait marquant, capture, schéma SVG
│   ├── projets.paths.ts  getStaticPaths partagé FR et /mu/
│   ├── faq.const.ts      Questions fréquentes, réutilisées par la FAQ et les pages profils
│   ├── report.const.ts   Exemples de comptes-rendus
│   ├── site.const.ts     Constantes site (URLs, email, durées, devis)
│   ├── locale.const.ts   Config des locales (codes, drapeaux, devise, tarifs)
│   ├── motion.const.ts   Réglages communs des animations
│   ├── i18n.ts           Helpers useLocale / t / l / localizePath
│   ├── typo.ts           Espaces insécables de la typographie française
│   ├── seo.const.ts      Defaults SEO et OG
│   ├── links.const.ts    Liens de navigation
│   └── analytics.const.ts  ID Umami, domaine suivi, noms des events
├── pages/              Routes file-based (voir tableau ci-dessus)
│   └── mu/             Wrappers de la variante mauricienne
├── scripts/            motion.ts (toutes les pages), home.ts (home)
└── styles/
    ├── global.css      Reset Tailwind, classes partagées, transitions de page
    └── tokens.css      Tokens design (palette OKLCH, typo, ombres, espacements)

scripts/
└── weekly-report/      Rapport analytics hebdo par email (cron GitHub Actions)
```

## Conventions

- **TypeScript strict** : héritage `astro/tsconfigs/strict`, pas de `any`.
- **Tokens OKLCH** : aucune couleur en dur, tout passe par les variables de `tokens.css`
  (exceptions commentées : drapeaux, couleur de marque Cal.com qui n'accepte que l'hexadécimal).
- **Constantes** : magic strings dans `src/lib/*.const.ts` en SCREAMING_SNAKE_CASE.
- **Textes** : pas de tiret cadratin (un test le vérifie), pas de date de disponibilité ni de chiffre absent des fiches projets.
- **Pas de commentaires QUOI** : uniquement le POURQUOI non évident.
- **Commits conventionnés** : `<emoji> <type>(<scope>): <description>` ([gitmoji](https://gitmoji.dev)).

## Déploiement

- Hébergement : **Cloudflare Pages**, auto-deploy sur push `main`, URL de prévisualisation par branche.
- Build en `format: 'file'` : `/methode` est servi depuis `methode.html`, sans redirection vers `/methode/`.
- Domaine : **pierregorde.com** via Cloudflare Registrar.
- Email affiché : `gordepierre@gmail.com`. Le domaine n'a pas de MX : aucune adresse en `@pierregorde.com` ne reçoit de mail.

## Analytics

- **Umami Cloud** injecté par `BaseLayout` en production, limité au domaine `pierregorde.com`
  (`data-domains`) : ni localhost ni les prévisualisations ne sont comptés.
- Clics trackés via `data-umami-event` : CTA RDV (`cta-rdv`, avec `place` = emplacement du bouton),
  fiche projet (`projet`), nom du bandeau clients (`client`), email (`contact-email`),
  LinkedIn (`linkedin`), GitHub (`github`), code source (`source-code`), langue (`locale-switch`).
- Rapport hebdo automatique chaque lundi 9h : voir [scripts/weekly-report/](scripts/weekly-report/README.md).
