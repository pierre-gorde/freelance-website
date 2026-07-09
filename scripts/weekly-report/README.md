# Rapport hebdo analytics

Envoie chaque lundi à 9h (heure de Paris) un email récapitulatif des stats Umami de la
semaine écoulée : visites, visiteurs, pages vues, taux de rebond, durée moyenne, top
pages, sources de trafic et clics (events), avec comparaison vs semaine précédente.

Déclenché par `.github/workflows/weekly-report.yml` (deux crons UTC + garde-fou « 9h à
Paris » pour absorber les changements d'heure été/hiver). Envoi via l'API Resend.

L'accès API classique d'Umami Cloud est réservé au plan Pro : le script passe donc par
la **Share URL** (gratuite) du site — l'endpoint public `/api/share/{shareId}` fournit
un token accepté par les endpoints stats (`x-umami-share-token`). Flux non documenté
officiellement : si Umami le casse, le workflow échouera avec une erreur explicite dans
`resolveShareAccess` et il faudra soit réparer, soit migrer (GoatCounter a une API
gratuite officielle).

## Fichiers

```
weekly-report/
├── index.ts          Orchestration : fenêtre de la semaine → fetch → mail
├── week.ts           Calcul de la dernière semaine complète en heure de Paris
├── umami.ts          Client API Umami Cloud (stats + metrics)
├── format.ts         Construction du sujet et du HTML du mail
├── email.ts          Envoi via l'API Resend
├── report.const.ts   URLs, timezone, limites, couleurs du mail
└── sample.const.ts   Données factices pour le mode --sample
```

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `UMAMI_SHARE_URL` | Share URL du site (Umami > Websites > Edit > Share URL, ex. `https://cloud.umami.is/share/xxx/pierregorde.com`) |
| `RESEND_API_KEY` | Clé API Resend |
| `REPORT_EMAIL_FROM` | Expéditeur (domaine vérifié dans Resend, ex. `rapport@pierregorde.com`) |
| `REPORT_EMAIL_TO` | Destinataire du rapport |

Toutes sont attendues en secrets GitHub Actions (repo > Settings > Secrets and
variables > Actions).

## Mise en place (une fois)

1. **Umami Cloud** — créer un compte sur [umami.is](https://umami.is), ajouter le site
   `pierregorde.com`, copier le **website ID** dans
   [src/lib/analytics.const.ts](../../src/lib/analytics.const.ts) (`UMAMI_WEBSITE_ID`).
   Activer la **Share URL** (Websites > Edit > Enable share URL) → secret GitHub
   `UMAMI_SHARE_URL`. Note : la Share URL rend le dashboard public (lien non devinable).
2. **Resend** — créer un compte sur [resend.com](https://resend.com), vérifier le
   domaine `pierregorde.com` (DNS chez Cloudflare), créer une API key → secret
   `RESEND_API_KEY`. Renseigner `REPORT_EMAIL_FROM` et `REPORT_EMAIL_TO`.
3. Pousser sur `main`, puis tester via **Actions > Rapport hebdo analytics > Run
   workflow** (le déclenchement manuel ignore le garde-fou horaire).

## Commandes

| Commande | Action |
|---|---|
| `npm run report:sample` | Génère `weekly-report-preview.html` avec des données factices, sans réseau |
| `npm run report:weekly` | Envoi réel (nécessite les 5 variables d'environnement) |

En local, Node ≥ 22.6 suffit (`--experimental-strip-types`) ; le workflow CI utilise
Node 24 qui exécute le TypeScript nativement.
