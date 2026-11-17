# pierregorde.com

Contexte business (positionnement, cible, objectifs) : voir `../CLAUDE.md`, non répété ici.
Doc détaillée du site (routes, attributs d'animation, i18n, analytics) : `README.md`.

## Métier

Site de vente, pas un portfolio, de l'activité freelance de Pierre Gordé (développeur web TypeScript).
Cible prioritaire : chef de projet ou CTO de startup/PME (`/cto-renfort`) ; seconde cible : dirigeants
sans équipe tech (`/sans-equipe-tech`). Conversion visée : un échange de 30 min réservé via l'embed Cal.com.
Deux variantes : France (`/`, tarifs en euros) et île Maurice (`/mu`, roupies, touches de kreol morisien).

## Stack

- Astro 6.4 en SSG pur (aucun adapter, aucun SSR), TypeScript strict (`astro/tsconfigs/strict`).
- Tailwind CSS 4.3 via `@tailwindcss/vite`, utilisé comme reset : aucune classe utilitaire, le style
  passe par les tokens CSS et les `<style>` scopés des composants.
- GSAP 3.15 + ScrollTrigger (bundlé), police Archivo variable auto-hébergée (`@fontsource-variable`).
- `@astrojs/sitemap`, i18n natif Astro, View Transitions natives (`@view-transition`, pas de ClientRouter).
- Playwright 1.60 (chromium), Prettier 3 + `prettier-plugin-astro`. Node >= 22.12 (`engines`).
- Services tiers : Cal.com (embed RDV), Umami Cloud (analytics), Resend (email du rapport hebdo).

## Commandes

Gestionnaire : **npm** (`package-lock.json`), pas de yarn ni pnpm.

```bash
npm install
npm run dev              # http://localhost:4321
npm run build            # build statique vers dist/
npm run preview          # sert dist/ sur le port 4321
npm run check            # astro check (diagnostics + types)
npm run lint             # astro check + prettier --check (n'écrit rien)
npm run format           # prettier --write sur src/ et scripts/
npx playwright test      # e2e : serveur à lancer avant (voir Pièges)
npm run report:sample    # aperçu HTML du rapport hebdo, données factices, sans réseau
npm run report:weekly    # ENVOI RÉEL de l'email : ne jamais lancer sans demande explicite
```

Avant un push : `npm run format && npm run lint`.

## Architecture

```
src/pages/                Routes FR (file-based), 404.astro
src/pages/mu/             Wrappers /mu de 3 lignes qui réimportent la page FR
src/layouts/              BaseLayout (head, SEO, hreflang, JSON-LD, Umami, Cal.com, motion), SiteLayout
src/components/home/      Sections de la home (Hero, ClientsBand, ProjetStrip, ReportShowcase, About)
src/components/layout/    Header, Footer, LocaleSwitcher
src/components/projets/   ProjetCard, ProjetsSelection, ProjetSchema (schéma d'archi SVG)
src/components/report/    DailyReport, le compte-rendu du soir
src/components/ui/        Briques partagées (PrimaryCta, PageHero, SlamTitle, FaqList, FinalCta, Flag...)
src/lib/                  Contenus et constantes (*.const.ts), i18n.ts, typo.ts, projets.paths.ts
src/scripts/              motion.ts (animations au scroll, toutes les pages), home.ts (home seule)
src/styles/               tokens.css (design tokens OKLCH), global.css (classes partagées, transitions)
src/assets/               Portraits et captures des projets, optimisés au build (astro:assets)
public/                   _redirects (Cloudflare), robots.txt, favicons, og.png
scripts/weekly-report/    Rapport analytics hebdo Umami vers Resend (README dédié)
tests/qa-full.spec.ts     Suite Playwright unique
```

Contenus éditoriaux : `projets.const.ts` (les 10 projets : textes, capture, schéma SVG), `faq.const.ts`,
`report.const.ts`, `site.const.ts` (URLs, email, Cal.com, durées), `locale.const.ts` (locales et tarifs).

## Workflow git

- `main` : unique branche distante, branche de production. Pas de staging ni de pre-production.
- Cible des PR : `main`. Une seule PR dans l'historique (#1, `feature/v2` vers `main`) ; les commits
  suivants ont été poussés directement sur `main`.
- Repo GitHub **public**, et le site lie son code source (`SOURCE_CODE_URL`) : tout commit est lisible
  par les prospects.

## Déploiement

- Cloudflare Pages relié au repo : auto-deploy de `main` sur pierregorde.com, URL de prévisualisation
  par branche (source : README ; aucune config Cloudflare dans le repo, pas de `wrangler.toml`).
- `build.format: 'file'` + `trailingSlash: 'never'` : `/methode` est servi depuis `methode.html`.
- Redirections 301 dans `public/_redirects`, à doubler pour les chemins `/mu/...`.
- Aucune variable d'environnement au build : tout est en constantes. Umami n'est injecté qu'en
  `import.meta.env.PROD` et ne compte que le domaine de prod (ni localhost, ni previews).
- GitHub Actions : un seul workflow, `weekly-report.yml` (cron lundi 7h17 UTC + `workflow_dispatch`,
  Node 24). Secrets attendus : `UMAMI_SHARE_URL`, `RESEND_API_KEY`, `REPORT_EMAIL_FROM`, `REPORT_EMAIL_TO`.
- Aucune CI sur les PR ni sur `main` : lint et tests ne tournent qu'en local.

## Conventions

- **i18n** : `const { t, l, tjm, hourly } = useLocale(Astro.currentLocale)` (`src/lib/i18n.ts`).
  Texte FR avec override ponctuel `t('Contexte', { 'fr-MU': 'Kontex' })` (greppable via `'fr-MU':`),
  liens internes via `l('/chemin')`, tarifs via `tjm` / `hourly`, jamais en dur.
- **Nouvelle page** : fichier FR dans `src/pages/`, wrapper dans `src/pages/mu/` (réexporter
  `getStaticPaths` pour une route dynamique, cf. `mu/projets/[slug].astro`), `canonicalPath` sans
  préfixe de locale, route ajoutée à `ROUTES` dans `tests/qa-full.spec.ts`.
- **Page noindex** : prop `noindex` du layout ET entrée dans `NOINDEX_PATHS` (`astro.config.mjs`),
  sinon elle reste dans le sitemap.
- **Nouvelle locale** : procédure en fin de section i18n du README.
- **Couleurs** : tokens de `src/styles/tokens.css`, redéfinis pour Maurice sous `:root:lang(fr-MU)`
  avec les mêmes noms (`--orange` y est vert). Exceptions assumées et commentées : drapeaux
  (`Flag.astro`), `calBrandColor` hex (`locale.const.ts`), `EMAIL_COLORS` du mail hebdo.
  `--status-decide` et `--status-blocked` restent identiques dans les deux versions.
- **Classes partagées** (`global.css`) : `.wrap`, `.display`, `.btn*`, `.stamp`, `.chip`, `.tone-*`.
- **Animations** : au-dessus de la ligne de flottaison, CSS uniquement et texte jamais masqué en
  attendant le JS (LCP). Au scroll : attributs `data-*` lus par `motion.ts` (liste dans le README).
  Tout est coupé sous `prefers-reduced-motion`.
- **Typo** : aucun tiret cadratin (U+2014) dans les textes visibles. Espaces insécables avant
  `? ! : ;` via `frenchSpacing()` (`src/lib/typo.ts`), déjà appliqué par SlamTitle, PageHero,
  FinalCta, FaqList, DailyReport et CopyEmail.
- **Contenu** : ni date de disponibilité, ni chiffre absent des fiches projets.
- **Analytics** : clics suivis par `data-umami-event`, noms dans `analytics.const.ts`. Tout CTA de RDV
  passe par `PrimaryCta` avec un `place` unique (remonté dans l'event `cta-rdv`).
- **Projets** : sans champ `client`, un projet est un produit perso (Dodokaz) et reste hors du
  bandeau clients. Ordre de la bande home : `HOME_PROJET_SLUGS`.

## Pièges

- `npx playwright test` ne démarre aucun serveur (`webServer: undefined`) : lancer d'abord
  `npm run build && npm run preview` sur le port 4321.
- Le test du bandeau clients attend exactement 9 liens : ajouter ou retirer un projet avec `client`
  impose de mettre à jour `tests/qa-full.spec.ts`.
- Le test anti tiret cadratin ne parcourt que les routes FR ; `/mu/methode` ne doit contenir aucun `€`
  dans `<main>`.
- `Astro.url.pathname` vaut `/methode.html` au build et `getRelativeLocaleUrl` renvoie `/mu/` avec
  slash final : passer par `stripLocalePrefix()` / `localizePath()` de `i18n.ts`.
- Un seul `404.html` (build FR) sert aussi `/mu/*` : la version kreol est un script client dans
  `404.astro`.
- `calBrandColor` (hex, `locale.const.ts`) doit suivre `--orange` de chaque locale : changer l'un sans
  l'autre désaccorde l'embed Cal.com.
- `EXPERIENCE_YEARS` est calculé au build : le chiffre n'avance qu'au premier déploiement de l'année.
- `scripts/weekly-report/` tourne en CI sans `npm install`, via le type stripping de Node : aucune
  dépendance npm, imports relatifs avec extension `.ts`, syntaxe TypeScript effaçable (ni `enum`,
  ni `namespace`).
- Prettier ne couvre que `src/` et `scripts/` : `tests/` et les configs racine échappent à `lint`.
- Aucune version de Node n'est fixée pour Cloudflare (ni `.nvmrc` ni `.node-version`) : la version
  utilisée au build dépend du dashboard.
- Le domaine pierregorde.com n'a pas de MX : aucune adresse `@pierregorde.com` ne reçoit de mail,
  l'email affiché est `CONTACT_EMAIL` (`site.const.ts`).
- `UMAMI_WEBSITE_ID` en clair dans `analytics.const.ts` est public par nature (script client), ce
  n'est pas un secret.
