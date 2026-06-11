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
| [Plausible](https://plausible.io) | Analytics RGPD-friendly sans cookies |
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
| `/rdv` | Prise de RDV Cal.com |
| `/posts` | Articles (à venir) |
| `/mentions-legales` | Mentions légales |

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

## Structure

```
src/
├── components/
│   ├── layout/         Header, Footer, Container
│   └── ui/             Button, PrimaryCta, Reveal, DailyReportMockup…
├── layouts/
│   ├── BaseLayout      Squelette HTML, meta SEO, Open Graph
│   └── SiteLayout      Header + main + Footer wrapping
├── lib/
│   ├── projets.const.ts  Données des 9 projets clients + schémas SVG
│   ├── site.const.ts     Constantes site (URLs, TJM, email)
│   ├── seo.const.ts      Defaults SEO et OG
│   └── links.const.ts    Liens de navigation
├── pages/              Routes file-based (voir tableau ci-dessus)
└── styles/
    ├── global.css      Import Tailwind + base styles
    └── tokens.css      Tokens design (palette OKLCH, typo, spacing)
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
