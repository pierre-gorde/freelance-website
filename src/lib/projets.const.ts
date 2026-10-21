import type { ImageMetadata } from 'astro';

import captureAgregata from '../assets/projets/agregata.jpg';
import captureBdl from '../assets/projets/bdl-capital-management.jpg';
import captureFftri from '../assets/projets/fftri-race-simulator.jpg';
import captureHotelave from '../assets/projets/hotelave.jpg';
import captureMargoo from '../assets/projets/margoo.jpg';
import captureScalex from '../assets/projets/scalex-invest.jpg';
import captureSlowAdventures from '../assets/projets/slow-adventures.jpg';
import captureUblo from '../assets/projets/ublo.jpg';
import captureVouloirDire from '../assets/projets/vouloir-dire.jpg';

export type ProjetTone = 'cyan' | 'orange' | 'paper' | 'pale' | 'ink';

export type Projet = {
  slug: string;
  titre: string;
  /** Nom court affiché dans le bandeau des clients. */
  client: string;
  secteur: string;
  stamp: string;
  tone: ProjetTone;
  periode: string;
  /** Années affichées sur la carte. */
  annees: string;
  resume: string;
  /** Phrase courte de la carte, tirée du résumé. */
  accroche: string;
  /** Fait marquant, repris de la fiche. */
  fait: string;
  contexte: string;
  stack: string[];
  livrables: string[];
  schema: string;
  url: string;
  capture: ImageMetadata;
  captureAlt: string;
};

type SchemaTone = 'primary' | 'neutral' | 'external';

const BOX_WIDTH = 120;
const BOX_HEIGHT = 40;

const SVG_ATTRS = 'fill="none" xmlns="http://www.w3.org/2000/svg" role="img"';

const box = (x: number, y: number, label: string, sub: string, tone: SchemaTone) => {
  const cy = sub ? y + 15 : y + 20;
  return `<g class="sch-node sch-node--${tone}"><rect x="${x}" y="${y}" width="${BOX_WIDTH}" height="${BOX_HEIGHT}" rx="6"/>
  <text class="sch-label" x="${x + BOX_WIDTH / 2}" y="${cy}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  ${sub ? `<text class="sch-sub" x="${x + BOX_WIDTH / 2}" y="${y + 29}" text-anchor="middle" dominant-baseline="middle">${sub}</text>` : ''}</g>`;
};

const arrow = (id: string, x1: number, y1: number, x2: number, y2: number) =>
  `<line class="sch-arrow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id})"/>`;

const markerDef = (id: string) =>
  `<defs><marker id="${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path class="sch-head" d="M0 0L8 3L0 6z"/></marker></defs>`;

const note = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'middle') =>
  `<text class="sch-note" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;

export const PROJETS: Projet[] = [
  {
    slug: 'agregata',
    titre: 'Agregata AI',
    client: 'Agregata AI',
    secteur: 'FinTech, SaaS',
    stamp: 'FinTech',
    tone: 'orange',
    periode: "2025 – aujourd'hui",
    annees: 'depuis 2025',
    url: 'https://www.agregata.ai',
    capture: captureAgregata,
    captureAlt: "Page d'accueil d'agregata.ai",
    resume:
      "Plateforme SaaS de gestion et d'analyse de trésorerie que j'ai construite de zéro pour Agregata AI. Architecture fullstack TypeScript, infrastructure AWS Fargate, workers BullMQ séparés, connecteurs comptables automatisés et agents IA intégrés.",
    accroche:
      'Une plateforme de trésorerie construite de zéro. Un connecteur installé chez le client lit la comptabilité EBP ou Sage et supprime les exports manuels.',
    fait: 'Construite de zéro, déployée sur AWS',
    contexte:
      'Plateforme développée pour des PME et TPE qui gèrent leur trésorerie manuellement via Excel. Fullstack TypeScript de bout en bout, du schéma Prisma au déploiement ECS Fargate, en passant par les workers de traitement de données et les agents IA conversationnels. Un connecteur comptable on-premise, installé sur un poste du client, supprime les exports manuels de comptabilité.',
    stack: [
      'React',
      'MUI',
      'NestJS',
      'Prisma',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'AWS ECS',
      'Terraform',
      'TypeScript',
      'Go',
      'Wails',
    ],
    livrables: [
      'Plateforme de trésorerie : lignes réelles et prévisionnelles, scénarios, hypothèses',
      'Architecture workers BullMQ en processus séparés (import CSV/ZIP + recalcul)',
      "Agents IA conversationnels pour l'analyse financière (NestJS + LLM)",
      'Synchronisation bancaire via Bridge API (open banking)',
      'Connecteur comptable on-premise : agent Windows Go, installeur Wails, supervision et auto-update',
      'Infrastructure AWS ECS Fargate pilotée par Terraform, CI/CD GitHub Actions',
      'Frontend React 18 + MUI, internationalisation FR/EN, auth JWT cookies HTTP-only',
    ],
    schema: `<svg viewBox="0 0 720 360" ${SVG_ATTRS}>${markerDef('p0')}
  ${box(60, 20, 'Bridge API', '', 'external')}
  ${box(220, 20, 'AI Agents', 'LLM', 'external')}
  ${box(500, 20, 'AWS S3', 'Fichiers', 'external')}
  ${arrow('p0', 240, 110, 120, 60)}
  ${arrow('p0', 260, 110, 270, 60)}
  ${arrow('p0', 400, 170, 540, 60)}
  ${box(20, 110, 'React', 'MUI + Zustand', 'primary')}
  ${arrow('p0', 140, 130, 178, 130)}
  ${box(180, 110, 'NestJS', 'API + WS', 'primary')}
  ${arrow('p0', 300, 130, 338, 130)}
  ${box(340, 110, 'PostgreSQL', 'Prisma ORM', 'neutral')}
  ${arrow('p0', 460, 130, 498, 130)}
  ${box(500, 110, 'AWS ECS', 'Fargate', 'external')}
  ${arrow('p0', 240, 150, 240, 178)}
  ${box(180, 180, 'Redis', 'BullMQ', 'primary')}
  ${arrow('p0', 300, 200, 338, 200)}
  ${box(340, 180, 'Worker', 'Import CSV', 'primary')}
  ${arrow('p0', 460, 200, 498, 200)}
  ${box(500, 180, 'Worker', 'Recalcul', 'primary')}
  <rect class="sch-zone" x="10" y="258" width="340" height="80" rx="6"/>
  ${note(340, 272, 'Poste client (on-premise)', 'end')}
  ${box(20, 283, 'Agent Go', 'Service Windows', 'primary')}
  ${note(179, 294, 'Lecture seule')}
  ${arrow('p0', 140, 303, 218, 303)}
  ${box(220, 283, 'SQL Server', 'Comptable EBP / Sage', 'external')}
  ${arrow('p0', 85, 283, 195, 152)}
  ${note(130, 241, 'HTTPS : imports, heartbeat, auto-update', 'start')}
</svg>`,
  },
  {
    slug: 'slow-adventures',
    titre: 'Slow Adventures',
    client: 'Slow Adventures',
    secteur: 'Tourisme',
    stamp: 'Tourisme',
    tone: 'pale',
    periode: 'mars 2025',
    annees: '2025',
    url: 'https://slowadventures.fr',
    capture: captureSlowAdventures,
    captureAlt: "Page d'accueil de slowadventures.fr",
    resume:
      "Accompagnement complet de la création d'activité d'une travel planner spécialisée dans les Amériques, de la vision produit jusqu'à la livraison du site. Ateliers brainstorming, business, UX/UI, puis développement Astro SSG mobile-first.",
    accroche:
      'Du positionnement au site livré pour une travel planner : ateliers produit et UX, puis un site Astro pensé pour le mobile.',
    fait: "Plus de 80 % du trafic vient d'Instagram",
    contexte:
      "Elena Dolla lance son activité de travel planner en solo. Mission à spectre large : structurer le positionnement, clarifier l'offre et les personas, concevoir l'expérience utilisateur, puis développer et livrer le site. Plus de 80 % du trafic vient d'Instagram Stories : le site doit transformer ce trafic mobile en appels découverte sans friction.",
    stack: ['Astro', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Netlify'],
    livrables: [
      'Ateliers de brainstorming et de positionnement (offre, personas, différenciation)',
      'Atelier business : pricing, parcours client, critères de succès MVP',
      'Atelier UX/UI : wireframes, parcours mobile-first, système de design',
      'Site one-page SSG Astro, mobile-first, Core Web Vitals optimisés (LCP < 2.5s)',
      'Animations GSAP au scroll (fade-in, parallax hero)',
      'Intégration Calendly (discovery calls) + capture email Brevo + GA4',
      'CI/CD GitHub Actions → Netlify avec headers de sécurité',
    ],
    schema: `<svg viewBox="0 0 620 200" ${SVG_ATTRS}>${markerDef('psa')}
  ${box(20, 80, 'Astro SSG', 'TypeScript', 'primary')}
  ${arrow('psa', 140, 100, 178, 100)}
  ${box(180, 80, 'Netlify', 'CDN / Deploy', 'primary')}
  ${arrow('psa', 300, 100, 338, 100)}
  ${box(340, 80, 'Navigateur', 'Mobile-first', 'neutral')}
  ${arrow('psa', 240, 120, 240, 153)}
  ${box(180, 155, 'Calendly', 'Discovery calls', 'external')}
  ${arrow('psa', 400, 120, 440, 153)}
  ${box(400, 155, 'Brevo', 'GA4', 'external')}
</svg>`,
  },
  {
    slug: 'fftri-race-simulator',
    titre: 'FFTri Race Simulator',
    client: 'FFTri',
    secteur: 'Sport, événementiel',
    stamp: 'JO Paris 2024',
    tone: 'cyan',
    periode: 'mars – juil. 2024',
    annees: '2024',
    url: 'https://triathlon-race-simulator.com/fr',
    capture: captureFftri,
    captureAlt: "Écran d'accueil du Race Simulator de la Fédération Française de Triathlon",
    resume:
      'Simulateur de course multijoueur en temps réel pour la Fédération Française de Triathlon, projeté sur les stands du Village des Jeux Olympiques de Paris 2024 sur vélos et tapis connectés.',
    accroche:
      'Un simulateur de course multijoueur en temps réel, projeté dans le Village des Jeux de Paris 2024.',
    fait: '5 disciplines, vélos et tapis connectés',
    contexte:
      "Commandé par la FFTri pour les JO de Paris 2024. Les participants pédalent ou courent sur des équipements connectés dans le Village Olympique, leur position s'affiche en temps réel sur une carte 3D Cesium avec vue POV caméra.",
    stack: [
      'Next.js',
      'TypeScript',
      'Socket.io',
      'Cesium',
      'Agora',
      'RxJS',
      'Chart.js',
      'Airtable',
    ],
    livrables: [
      'Synchronisation temps réel des équipements connectés (vélos, tapis) via Socket.io',
      'Carte 3D immersive avec Cesium : altitude, tracé de course, positions des participants',
      'Vue caméra POV dynamique par participant',
      'Streaming vidéo multi-flux via Agora RTC',
      'Page de résultats post-course avec classement et données de performance',
      'Support multi-disciplines : triathlon, cyclisme, course à pied, natation, aquathlon',
      'Déploiement continu staging + production, projectable sur grands écrans',
    ],
    schema: `<svg viewBox="0 0 720 230" ${SVG_ATTRS}>${markerDef('pfft')}
  ${box(20, 50, 'Vélos', 'Connectés', 'neutral')}
  ${box(20, 150, 'Tapis', 'Connectés', 'neutral')}
  ${arrow('pfft', 140, 70, 188, 100)}
  ${arrow('pfft', 140, 170, 188, 120)}
  ${box(190, 90, 'Socket.io', 'Temps réel', 'primary')}
  ${arrow('pfft', 310, 110, 348, 110)}
  ${box(350, 90, 'Next.js 14', 'App', 'primary')}
  ${arrow('pfft', 470, 110, 508, 110)}
  ${box(510, 90, 'Écran JO', 'Village Paris', 'neutral')}
  ${arrow('pfft', 410, 130, 350, 163)}
  ${arrow('pfft', 410, 130, 470, 163)}
  ${box(290, 165, 'Cesium', 'Carte 3D', 'external')}
  ${box(430, 165, 'Agora', 'Streaming', 'external')}
  ${note(410, 22, 'API course')}
  ${box(350, 30, 'Kinomap API', '', 'external')}
  ${arrow('pfft', 410, 90, 410, 72)}
</svg>`,
  },
  {
    slug: 'hotelave',
    titre: 'HotelAve',
    client: 'HotelAve',
    secteur: 'Hôtellerie',
    stamp: 'SaaS B2B',
    tone: 'cyan',
    periode: 'oct. 2022 – nov. 2023',
    annees: '2022 – 2023',
    url: 'https://www.singlepaneapp.com/',
    capture: captureHotelave,
    captureAlt: "Page d'accueil de singlepaneapp.com",
    resume:
      "Développement frontend d'un SaaS hôtelier sous Angular, avec API GraphQL. Déploiement AWS Amplify, authentification Cognito avec MFA, et intégration SSO DUO.",
    accroche:
      "Le front d'un SaaS hôtelier en Angular, branché sur une API GraphQL et déployé sur AWS.",
    fait: 'Connexion MFA et SSO pour les comptes entreprise',
    contexte:
      "Mission frontend sur un produit SaaS B2B à destination des hôtels. Stack AWS complète : Amplify pour le déploiement, Cognito pour l'authentification avec MFA, et intégration d'un SSO DUO pour les clients enterprise.",
    stack: ['Angular', 'GraphQL', 'AWS Amplify', 'AWS Cognito', 'SSO DUO'],
    livrables: [
      'Développement des interfaces Angular du SaaS',
      "Intégration de l'API GraphQL côté client",
      'Déploiement continu sur AWS Amplify',
      'Authentification AWS Cognito avec MFA obligatoire',
      'Intégration SSO DUO pour les comptes enterprise',
    ],
    schema: `<svg viewBox="0 0 660 220" ${SVG_ATTRS}>${markerDef('p1')}
  ${box(20, 90, 'Angular', 'SaaS Front', 'primary')}
  ${arrow('p1', 140, 110, 178, 110)}
  ${box(180, 90, 'GraphQL', 'API', 'primary')}
  ${arrow('p1', 300, 110, 338, 110)}
  ${box(340, 90, 'AWS Cognito', 'Auth + MFA', 'external')}
  ${arrow('p1', 460, 110, 498, 110)}
  ${box(500, 90, 'AWS Amplify', 'Déploiement', 'external')}
  ${arrow('p1', 400, 130, 400, 163)}
  ${box(340, 165, 'SSO DUO', 'Enterprise', 'neutral')}
</svg>`,
  },
  {
    slug: 'vouloir-dire',
    titre: 'Vouloir Dire',
    client: 'Vouloir Dire',
    secteur: 'Plateforme, accessibilité',
    stamp: 'Accessibilité',
    tone: 'paper',
    periode: 'mai 2022 – nov. 2023',
    annees: '2022 – 2023',
    url: 'https://vouloir-dire.fr/',
    capture: captureVouloirDire,
    captureAlt: "Page d'accueil de vouloir-dire.fr",
    resume:
      "Plateforme de mise en relation entre clients et interprètes en langue des signes. Migration Angular 6 → 13, refonte de l'API Express vers NestJS, développement de nouvelles fonctionnalités.",
    accroche:
      'Une plateforme qui met en relation des clients et des interprètes en langue des signes.',
    fait: 'Angular 6 → 13 sans interruption de service',
    contexte:
      "Mission fullstack d'un an et demi sur une plateforme sociale à fort enjeu d'accessibilité. Stack Angular + NestJS + GraphQL. Migration majeure du frontend et de l'API en parallèle.",
    stack: ['Angular', 'NestJS', 'GraphQL', 'Prisma', 'PostgreSQL'],
    livrables: [
      'Migration Angular 6 → 13 sans interruption de service',
      "Refonte de l'API Express vers NestJS",
      'Schéma GraphQL et résolveurs pour les nouvelles fonctionnalités',
      'Migrations de base de données PostgreSQL via Prisma',
      'Nouvelles fonctionnalités front (réservation, profil interprète, messagerie)',
    ],
    schema: `<svg viewBox="0 0 580 180" ${SVG_ATTRS}>${markerDef('p2')}
  ${box(20, 70, 'Angular', 'Frontend', 'primary')}
  ${arrow('p2', 140, 90, 178, 90)}
  ${box(180, 70, 'NestJS', 'GraphQL API', 'primary')}
  ${arrow('p2', 300, 90, 338, 90)}
  ${box(340, 70, 'PostgreSQL', 'Prisma ORM', 'neutral')}
  ${note(240, 146, 'Migration Express → NestJS')}
  <g class="sch-legacy"><rect x="160" y="155" width="160" height="22" rx="4"/>
  <text x="240" y="166" text-anchor="middle" dominant-baseline="middle">Express (legacy)</text></g>
</svg>`,
  },
  {
    slug: 'ublo',
    titre: 'Ublo',
    client: 'Ublo',
    secteur: 'Immobilier',
    stamp: 'Immobilier',
    tone: 'ink',
    periode: 'oct. 2021 – mai 2022',
    annees: '2021 – 2022',
    url: 'https://www.ublo.immo/',
    capture: captureUblo,
    captureAlt: "Page d'accueil d'ublo.immo",
    resume:
      "Développement fullstack d'un outil de gestion locative pour bailleurs. API NestJS, interface React Admin, base PostgreSQL avec TypeORM. Mission en équipe mixte, avec revue de code.",
    accroche:
      'Un outil de gestion locative pour bailleurs : API NestJS, interface React Admin, tests de bout en bout.',
    fait: '4 développeurs juniors coordonnés',
    contexte:
      "Coordination d'une équipe de 4 développeurs juniors sur un outil SaaS de gestion locative en remote 4j/semaine. Cadrage des chantiers, revues de PR, accompagnement technique quotidien.",
    stack: ['NestJS', 'React Admin', 'React', 'PostgreSQL', 'TypeORM', 'Cypress'],
    livrables: [
      'API NestJS pour la gestion des biens, locataires et contrats',
      'Interface React Admin pour les bailleurs',
      'Modèles de données PostgreSQL via TypeORM',
      'Tests end-to-end Cypress sur les parcours critiques',
      'Revues de code et accompagnement des développeurs juniors',
    ],
    schema: `<svg viewBox="0 0 540 200" ${SVG_ATTRS}>${markerDef('p3')}
  ${box(20, 70, 'React Admin', 'Interface', 'primary')}
  ${arrow('p3', 140, 90, 178, 90)}
  ${box(180, 70, 'NestJS', 'API REST', 'primary')}
  ${arrow('p3', 300, 90, 338, 90)}
  ${box(340, 70, 'PostgreSQL', 'TypeORM', 'neutral')}
  ${arrow('p3', 240, 110, 240, 143)}
  ${box(180, 145, 'Cypress', 'Tests E2E', 'external')}
</svg>`,
  },
  {
    slug: 'scalex-invest',
    titre: 'ScaleX Invest',
    client: 'ScaleX Invest',
    secteur: 'FinTech, data',
    stamp: 'Data',
    tone: 'orange',
    periode: 'mars – juil. 2021',
    annees: '2021',
    url: 'https://www.scalex-invest.com/',
    capture: captureScalex,
    captureAlt: "Page d'accueil de scalex-invest.com",
    resume:
      "API d'agrégation de données financières provenant d'APIs tierces et de flux SFTP. Calcul de modèles financiers, exposition en GraphQL, et rendu SSR via GatsbyJS.",
    accroche:
      'Une API qui agrège des données financières de plusieurs sources et calcule des modèles de scoring.',
    fait: 'APIs tierces et flux SFTP, une seule API GraphQL',
    contexte:
      "Mission courte mais techniquement dense sur une plateforme d'évaluation de startups tech cotées. Agrégation multi-sources, calcul de scoring financier, et front SSR pour performance sur volume de données important.",
    stack: ['NestJS', 'Node.js', 'GraphQL', 'GatsbyJS', 'PostgreSQL'],
    livrables: [
      'Connecteurs NestJS vers APIs tierces et flux SFTP',
      'Pipeline de calcul de modèles financiers',
      'Schéma GraphQL exposant les données agrégées',
      'Front GatsbyJS en SSR pour les fiches entreprises',
      'Base PostgreSQL pour la persistance des scores calculés',
    ],
    schema: `<svg viewBox="0 0 680 220" ${SVG_ATTRS}>${markerDef('p4')}
  ${box(20, 50, 'APIs tierces', '', 'neutral')}
  ${box(20, 150, 'SFTP', 'Flux données', 'neutral')}
  ${arrow('p4', 140, 70, 188, 105)}
  ${arrow('p4', 140, 170, 188, 125)}
  ${box(190, 90, 'NestJS', 'Agrégation', 'primary')}
  ${arrow('p4', 310, 110, 348, 110)}
  ${box(350, 90, 'GraphQL', 'API', 'primary')}
  ${arrow('p4', 470, 110, 508, 110)}
  ${box(510, 90, 'GatsbyJS', 'SSR Front', 'primary')}
  ${arrow('p4', 240, 130, 240, 163)}
  ${box(180, 165, 'PostgreSQL', 'Scores', 'neutral')}
</svg>`,
  },
  {
    slug: 'margoo',
    titre: 'Margoo',
    client: 'Margoo',
    secteur: 'E-commerce',
    stamp: 'E-commerce',
    tone: 'ink',
    periode: 'juil. 2020 – 2021',
    annees: '2020 – 2021',
    url: 'https://margoo.fr',
    capture: captureMargoo,
    captureAlt: "Page d'accueil de margoo.fr",
    resume:
      "Collaboration sur la plateforme e-commerce margoo.fr : développement du site, d'un robot de discussion, de l'API et d'une partie du CRM prestataire.",
    accroche:
      "Plusieurs couches d'une plateforme e-commerce : site Gatsby, API NestJS, robot de discussion et modules du CRM.",
    fait: 'Site, API, chatbot et CRM',
    contexte:
      'Intervention sur plusieurs couches du produit : front Gatsby, API NestJS, bot de conversation Botpress, et modules du CRM prestataire.',
    stack: ['GatsbyJS', 'NestJS', 'AngularJS', 'Botpress', 'SQL'],
    livrables: [
      'Développement et maintenance du site web margoo.fr (Gatsby)',
      'API NestJS pour le catalogue produit et les commandes',
      'Robot de discussion Botpress intégré au parcours client',
      'Modules du CRM prestataire (AngularJS)',
      'Base de données SQL partagée entre les services',
    ],
    schema: `<svg viewBox="0 0 660 220" ${SVG_ATTRS}>${markerDef('p5')}
  ${box(20, 90, 'Gatsby', 'Site web', 'primary')}
  ${arrow('p5', 140, 110, 178, 110)}
  ${box(180, 90, 'NestJS', 'API', 'primary')}
  ${arrow('p5', 300, 110, 338, 110)}
  ${box(340, 90, 'SQL', 'Base de données', 'neutral')}
  ${arrow('p5', 240, 130, 240, 163)}
  ${box(180, 165, 'Botpress', 'Chatbot', 'external')}
  ${arrow('p5', 460, 110, 498, 110)}
  ${box(500, 90, 'CRM', 'AngularJS', 'neutral')}
</svg>`,
  },
  {
    slug: 'bdl-capital-management',
    titre: 'BDL Capital Management',
    client: 'BDL Capital Management',
    secteur: 'Banque, assurance',
    stamp: 'Finance',
    tone: 'pale',
    periode: 'fév. 2018 – juin 2020',
    annees: '2018 – 2020',
    url: 'https://www.bdlcm.com/',
    capture: captureBdl,
    captureAlt: "Page d'accueil de bdlcm.com",
    resume:
      "Développement fullstack sur deux ans et demi pour une société de gestion d'actifs parisienne. Applications React, APIs NestJS et Express, base SQL, site WordPress et infrastructure Docker.",
    accroche:
      "Des outils internes pour les analystes d'une société de gestion d'actifs : interfaces React, APIs métier, automatisation.",
    fait: '2 ans et demi de mission',
    contexte:
      "Stack diversifiée : interfaces React pour les analystes, APIs métier en Node.js/NestJS, scripts d'automatisation, et maintenance de l'infrastructure serveur.",
    stack: ['React', 'NestJS', 'Express', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'WordPress'],
    livrables: [
      "Applications React pour les outils internes d'analyse financière",
      'APIs NestJS et Express pour les données de portefeuilles',
      "Scripts JavaScript d'automatisation et de traitement de données",
      'Maintenance et évolutions du site WordPress public',
      'Déploiement et maintenance des serveurs via Docker',
    ],
    schema: `<svg viewBox="0 0 660 220" ${SVG_ATTRS}>${markerDef('p6')}
  ${box(20, 90, 'React', 'Interfaces', 'primary')}
  ${arrow('p6', 140, 110, 178, 110)}
  ${box(180, 90, 'NestJS', 'API métier', 'primary')}
  ${arrow('p6', 300, 110, 338, 110)}
  ${box(340, 90, 'SQL', 'Base de données', 'neutral')}
  ${arrow('p6', 240, 130, 240, 163)}
  ${box(180, 165, 'Express', 'Scripts / jobs', 'neutral')}
  ${note(560, 60, 'Infra')}
  ${box(500, 68, 'Docker', 'Déploiement', 'external')}
  <line class="sch-arrow sch-arrow--dashed" x1="460" y1="110" x2="498" y2="88"/>
</svg>`,
  },
];

/** Projets mis en avant sur la home, dans l'ordre de la bande. */
export const HOME_PROJET_SLUGS = [
  'fftri-race-simulator',
  'agregata',
  'vouloir-dire',
  'ublo',
  'bdl-capital-management',
] as const;

export function getProjet(slug: string): Projet {
  const projet = PROJETS.find((entry) => entry.slug === slug);
  if (!projet) throw new Error(`Projet inconnu : ${slug}`);
  return projet;
}

export function projetHostname(projet: Projet): string {
  return new URL(projet.url).hostname.replace(/^www\./, '');
}
