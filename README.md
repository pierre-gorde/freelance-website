# pierregorde.com

Site marketing de l'activité freelance solo de Pierre Gordé, dev TypeScript senior.

Le site n'est pas un portfolio : c'est un site de vente, conçu pour convertir des prospects qualifiés (porteurs de projet financés, CTO en recherche de renfort, dirigeants tech-enabled) en RDV gratuit, puis en mission.

## Stack

- **[Astro 6](https://astro.build)** — rendu statique, TypeScript strict.
- **[Tailwind CSS v4](https://tailwindcss.com)** — tokens via `@theme` dans `src/styles/tokens.css`.
- **[Cloudflare Pages](https://pages.cloudflare.com)** — déploiement statique edge.
- **[Cal.com](https://cal.com)** — prise de rendez-vous (alternative open source à Calendly).
- **[Plausible](https://plausible.io)** — analytics RGPD-friendly sans cookies (à brancher).

## Démarrer

```bash
npm install
npm run dev
```

Le serveur dev tourne sur `http://localhost:4321`.

## Commandes

| Commande          | Action                                              |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Lance le serveur de dev (HMR).                      |
| `npm run build`   | Build statique vers `./dist/`.                      |
| `npm run preview` | Sert le build local pour vérification avant deploy. |
| `npm run check`   | Type-check + diagnostic Astro.                      |
| `npm run format`  | Formate les fichiers source avec Prettier.          |
| `npm run lint`    | Vérifie le format + type-check.                     |

## Structure

```
site/
├── public/                Assets statiques (favicon, polices auto-hostées, etc.)
├── src/
│   ├── components/
│   │   ├── layout/        Header, Footer, Container
│   │   └── ui/            Button, PrimaryCta, primitives partagées
│   ├── layouts/
│   │   ├── BaseLayout     Squelette HTML, meta SEO, Open Graph
│   │   └── SiteLayout     Header + main + Footer wrapping
│   ├── lib/
│   │   ├── site.const.ts  Constantes site (URLs, TJM, email)
│   │   ├── seo.const.ts   Defaults SEO et OG
│   │   └── links.const.ts Liens de navigation
│   ├── pages/             Routes (file-based)
│   └── styles/
│       ├── global.css     Import Tailwind + base styles
│       └── tokens.css     Tokens design (palette OKLCH, typo, spacing)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Conventions

- **TypeScript strict** sur tous les fichiers (héritage `astro/tsconfigs/strict`).
- **Tokens centralisés** : aucune couleur en dur. Tout passe par `var(--color-*)` ou les tokens Tailwind générés depuis `tokens.css`.
- **Constantes** : magic numbers / strings extraites dans `src/lib/*.const.ts` en SCREAMING_SNAKE_CASE.
- **Public / private explicites** sur les classes (si présentes) — pas le cas pour les Astro components.
- **Pas de commentaires QUOI**, seulement le POURQUOI non évident.
- **Format Prettier** + plugin Astro avant chaque push (`npm run format`).
- **Commits conventionnés** :
  - `✨ feat(scope): …`
  - `🐛 fix(scope): …`
  - `♻️ refactor(scope): …`
  - `🔧 chore(scope): …`
  - `📝 docs(scope): …`
  - `💄 style(scope): …`

## Déploiement

- Hébergement : **Cloudflare Pages** (auto-deploy sur push `main`).
- Domaine : **pierregorde.com** via Cloudflare Registrar.
- DNS + CDN gérés par Cloudflare.
- Email pro : `contact@pierregorde.com` via Google Workspace.

## Sources de vérité documentaires

Le site est l'aboutissement d'une démarche structurée dans `../docs/` :

- `../docs/briefs/` — Brief produit.
- `../docs/prfaq-freelance.md` — Working Backwards / PRFAQ.
- `../docs/research/` — Market research (volume, TJM, écosystèmes, compétitif).
- `../docs/marketing-psychology-application.md` — Frameworks de persuasion appliqués.
- `../docs/prds/` — PRD complet du site.
- `../PRODUCT.md` — Synthèse du contexte pour les agents impeccable.
