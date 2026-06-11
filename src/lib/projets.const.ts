export type Projet = {
  slug: string;
  titre: string;
  secteur: string;
  periode: string;
  resume: string;
  contexte: string;
  stack: string[];
  livrables: string[];
  schema: string;
  url?: string;
};

const SVG_ATTRS =
  'fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;"';

const box = (
  id: string,
  x: number,
  y: number,
  label: string,
  sub: string,
  variant: 'primary' | 'neutral' | 'external'
) => {
  const fills: Record<string, string> = {
    primary: '#f0fdf4',
    neutral: '#f9fafb',
    external: '#fff7ed',
  };
  const strokes: Record<string, string> = {
    primary: '#86efac',
    neutral: '#e5e7eb',
    external: '#fed7aa',
  };
  const textColors: Record<string, string> = {
    primary: '#166534',
    neutral: '#374151',
    external: '#92400e',
  };
  const subColors: Record<string, string> = {
    primary: '#4d7c68',
    neutral: '#6b7280',
    external: '#b45309',
  };
  const cy = sub ? y + 15 : y + 20;
  return `<rect x="${x}" y="${y}" width="120" height="40" rx="6" fill="${fills[variant]}" stroke="${strokes[variant]}" stroke-width="1.5"/>
  <text x="${x + 60}" y="${cy}" font-size="12" font-family="system-ui,sans-serif" fill="${textColors[variant]}" text-anchor="middle" dominant-baseline="middle" font-weight="500">${label}</text>
  ${sub ? `<text x="${x + 60}" y="${y + 29}" font-size="10" font-family="system-ui,sans-serif" fill="${subColors[variant]}" text-anchor="middle" dominant-baseline="middle">${sub}</text>` : ''}`;
};

const arrow = (id: string, x1: number, y1: number, x2: number, y2: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9ca3af" stroke-width="1.5" marker-end="url(#${id})"/>`;

const markerDef = (id: string) =>
  `<defs><marker id="${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0 0L8 3L0 6z" fill="#9ca3af"/></marker></defs>`;

export const PROJETS: Projet[] = [
  {
    slug: 'agregata',
    titre: 'Agregata',
    secteur: 'FinTech / SaaS',
    periode: "2025 — aujourd'hui",
    url: 'https://www.agregata.ai',
    resume:
      "Plateforme SaaS de gestion et d'analyse de trésorerie, construite de zéro au sein du collectif Coton. Architecture fullstack TypeScript complète, infrastructure AWS Fargate, workers BullMQ séparés, et agents IA intégrés.",
    contexte:
      'Produit phare du collectif Coton, développé pour des PME et TPE qui gèrent leur trésorerie manuellement via Excel. Fullstack TypeScript de bout en bout — du schéma Prisma au déploiement ECS Fargate, en passant par les workers de traitement de données et les agents IA conversationnels.',
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
    ],
    livrables: [
      'Plateforme de trésorerie : lignes réelles et prévisionnelles, scénarios, hypothèses',
      'Architecture workers BullMQ en processus séparés (import CSV/ZIP + recalcul)',
      "Agents IA conversationnels pour l'analyse financière (NestJS + LLM)",
      'Synchronisation bancaire via Bridge API (open banking)',
      'Infrastructure AWS ECS Fargate pilotée par Terraform, CI/CD GitHub Actions',
      'Frontend React 18 + MUI, internationalisation FR/EN, auth JWT cookies HTTP-only',
    ],
    schema: `<svg viewBox="0 0 720 300" ${SVG_ATTRS}>${markerDef('p0')}
  <!-- Ligne haute : services externes liés à l'API -->
  ${box('p0', 60, 20, 'Bridge API', '', 'external')}
  ${box('p0', 220, 20, 'AI Agents', 'LLM', 'external')}
  ${box('p0', 500, 20, 'AWS S3', 'Fichiers', 'external')}
  <!-- Flèches API → Bridge API et AI Agents (vers le haut) -->
  ${arrow('p0', 240, 110, 120, 60)}
  ${arrow('p0', 260, 110, 270, 60)}
  <!-- Flèche Worker Import → S3 (vers le haut) -->
  ${arrow('p0', 400, 170, 540, 60)}
  <!-- Ligne principale -->
  ${box('p0', 20, 110, 'React', 'MUI + Zustand', 'primary')}
  ${arrow('p0', 140, 130, 178, 130)}
  ${box('p0', 180, 110, 'NestJS', 'API + WS', 'primary')}
  ${arrow('p0', 300, 130, 338, 130)}
  ${box('p0', 340, 110, 'PostgreSQL', 'Prisma ORM', 'neutral')}
  ${arrow('p0', 460, 130, 498, 130)}
  ${box('p0', 500, 110, 'AWS ECS', 'Fargate', 'external')}
  <!-- Flèche API → Redis -->
  ${arrow('p0', 240, 150, 240, 178)}
  <!-- Ligne workers -->
  ${box('p0', 180, 180, 'Redis', 'BullMQ', 'primary')}
  ${arrow('p0', 300, 200, 338, 200)}
  ${box('p0', 340, 180, 'Worker', 'Import CSV', 'primary')}
  ${arrow('p0', 460, 200, 498, 200)}
  ${box('p0', 500, 180, 'Worker', 'Recalcul', 'primary')}
</svg>`,
  },
  {
    slug: 'slow-adventures',
    titre: 'Slow Adventures',
    secteur: 'Tourisme / Travel',
    periode: 'mars 2025',
    url: 'https://slowadventures.fr',
    resume:
      "Accompagnement complet de la création d'activité d'une travel planner spécialisée dans les Amériques — de la vision produit jusqu'à la livraison du site. Ateliers brainstorming, business, UX/UI, puis développement Astro SSG mobile-first.",
    contexte:
      "Elena Dolla lance son activité de travel planner en solo. Mission à spectre large : structurer le positionnement, clarifier l'offre et les personas, concevoir l'expérience utilisateur, puis développer et livrer le site. 80 %+ du trafic vient d'Instagram Stories — le site doit transformer ce trafic mobile en discovery calls sans friction.",
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
  ${box('psa', 20, 80, 'Astro SSG', 'TypeScript', 'primary')}
  ${arrow('psa', 140, 100, 178, 100)}
  ${box('psa', 180, 80, 'Netlify', 'CDN / Deploy', 'primary')}
  ${arrow('psa', 300, 100, 338, 100)}
  ${box('psa', 340, 80, 'Navigateur', 'Mobile-first', 'neutral')}
  ${arrow('psa', 240, 120, 240, 153)}
  ${box('psa', 180, 155, 'Calendly', 'Discovery calls', 'external')}
  ${arrow('psa', 400, 120, 440, 153)}
  <rect x="400" y="155" width="100" height="36" rx="6" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
  <text x="450" y="173" font-size="11" font-family="system-ui,sans-serif" fill="#92400e" text-anchor="middle" dominant-baseline="middle">Brevo / GA4</text>
</svg>`,
  },
  {
    slug: 'fftri-race-simulator',
    titre: 'FFTri Race Simulator',
    secteur: 'Sport / Événementiel',
    periode: 'mars 2024 — juil. 2024',
    url: 'https://triathlon-race-simulator.com/fr',
    resume:
      'Simulateur de course multijoueur en temps réel pour la Fédération Française de Triathlon, projeté sur les stands du Village des Jeux Olympiques de Paris 2024 sur vélos et tapis connectés.',
    contexte:
      "Commandé par la FFTri pour les JO de Paris 2024. Les participants pédalent ou courent sur des équipements connectés dans le Village Olympique, leur position s'affiche en temps réel sur une carte 3D Cesium avec vue POV caméra. Développé au sein du collectif Coton.",
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
      'Carte 3D immersive avec Cesium — altitude, tracé de course, positions des participants',
      'Vue caméra POV dynamique par participant',
      'Streaming vidéo multi-flux via Agora RTC',
      'Page de résultats post-course avec classement et données de performance',
      'Support multi-disciplines : triathlon, cyclisme, course à pied, natation, aquathlon',
      'Déploiement continu staging + production, projectable sur grands écrans',
    ],
    schema: `<svg viewBox="0 0 720 230" ${SVG_ATTRS}>${markerDef('pfft')}
  <!-- Équipements connectés -->
  ${box('pfft', 20, 50, 'Vélos', 'Connectés', 'neutral')}
  ${box('pfft', 20, 150, 'Tapis', 'Connectés', 'neutral')}
  ${arrow('pfft', 140, 70, 188, 100)}
  ${arrow('pfft', 140, 170, 188, 120)}
  <!-- Serveur temps réel -->
  ${box('pfft', 190, 90, 'Socket.io', 'Temps réel', 'primary')}
  ${arrow('pfft', 310, 110, 348, 110)}
  <!-- App Next.js -->
  ${box('pfft', 350, 90, 'Next.js 14', 'App', 'primary')}
  ${arrow('pfft', 470, 110, 508, 110)}
  <!-- Affichage final -->
  ${box('pfft', 510, 90, 'Écran JO', 'Village Paris', 'neutral')}
  <!-- Intégrations sous Next.js -->
  ${arrow('pfft', 410, 130, 350, 163)}
  ${arrow('pfft', 410, 130, 470, 163)}
  ${box('pfft', 290, 165, 'Cesium', 'Carte 3D', 'external')}
  ${box('pfft', 430, 165, 'Agora', 'Streaming', 'external')}
  <!-- Kinomap au-dessus de Next.js -->
  <text x="410" y="62" font-size="10" font-family="system-ui,sans-serif" fill="#6b7280" text-anchor="middle">API course</text>
  <rect x="350" y="30" width="120" height="28" rx="6" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
  <text x="410" y="44" font-size="11" font-family="system-ui,sans-serif" fill="#92400e" text-anchor="middle" dominant-baseline="middle">Kinomap API</text>
  ${arrow('pfft', 410, 90, 410, 58)}
</svg>`,
  },
  {
    slug: 'hotelave',
    titre: 'HotelAve',
    secteur: 'Hôtellerie',
    periode: 'oct. 2022 — nov. 2023',
    url: 'https://www.singlepaneapp.com/',
    resume:
      "Développement frontend d'un SaaS hôtelier sous Angular, avec API GraphQL. Déploiement AWS Amplify, authentification Cognito avec MFA, et intégration SSO DUO.",
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
  ${box('p1', 20, 90, 'Angular', 'SaaS Front', 'primary')}
  ${arrow('p1', 140, 110, 178, 110)}
  ${box('p1', 180, 90, 'GraphQL', 'API', 'primary')}
  ${arrow('p1', 300, 110, 338, 110)}
  ${box('p1', 340, 90, 'AWS Cognito', 'Auth + MFA', 'external')}
  ${arrow('p1', 460, 110, 498, 110)}
  ${box('p1', 500, 90, 'AWS Amplify', 'Déploiement', 'external')}
  ${arrow('p1', 400, 130, 400, 163)}
  ${box('p1', 340, 165, 'SSO DUO', 'Enterprise', 'neutral')}
</svg>`,
  },
  {
    slug: 'vouloir-dire',
    titre: 'Vouloir Dire',
    secteur: 'Plateforme / Social',
    periode: 'mai 2022 — nov. 2023',
    url: 'https://vouloir-dire.fr/',
    resume:
      "Plateforme de mise en relation entre clients et interprètes en langue des signes. Migration Angular 6 → 13, refonte de l'API Express vers NestJS, développement de nouvelles fonctionnalités.",
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
  ${box('p2', 20, 70, 'Angular', 'Frontend', 'primary')}
  ${arrow('p2', 140, 90, 178, 90)}
  ${box('p2', 180, 70, 'NestJS', 'GraphQL API', 'primary')}
  ${arrow('p2', 300, 90, 338, 90)}
  ${box('p2', 340, 70, 'PostgreSQL', 'Prisma ORM', 'neutral')}
  <text x="240" y="148" font-size="10" font-family="system-ui,sans-serif" fill="#6b7280" text-anchor="middle" font-style="italic">Migration Express → NestJS</text>
  <rect x="160" y="155" width="160" height="22" rx="4" fill="#fef2f2" stroke="#fca5a5" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="240" y="166" font-size="10" font-family="system-ui,sans-serif" fill="#b91c1c" text-anchor="middle" dominant-baseline="middle">Express (legacy)</text>
</svg>`,
  },
  {
    slug: 'ublo',
    titre: 'Ublo',
    secteur: 'Immobilier',
    periode: 'oct. 2021 — mai 2022',
    url: 'https://www.ublo.immo/',
    resume:
      "Développement fullstack d'un outil de gestion locative pour bailleurs. API NestJS, interface React Admin, base PostgreSQL avec TypeORM. Mission en équipe mixte, avec revue de code.",
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
    schema: `<svg viewBox="0 0 540 180" ${SVG_ATTRS}>${markerDef('p3')}
  ${box('p3', 20, 70, 'React Admin', 'Interface', 'primary')}
  ${arrow('p3', 140, 90, 178, 90)}
  ${box('p3', 180, 70, 'NestJS', 'API REST', 'primary')}
  ${arrow('p3', 300, 90, 338, 90)}
  ${box('p3', 340, 70, 'PostgreSQL', 'TypeORM', 'neutral')}
  ${arrow('p3', 240, 110, 240, 143)}
  ${box('p3', 180, 145, 'Cypress', 'Tests E2E', 'external')}
</svg>`,
  },
  {
    slug: 'early-metrics',
    titre: 'Early Metrics',
    secteur: 'FinTech / Data',
    periode: 'mars 2021 — juil. 2021',
    url: 'https://www.scalex-invest.com/',
    resume:
      "API d'agrégation de données financières provenant d'APIs tierces et de flux SFTP. Calcul de modèles financiers, exposition en GraphQL, et rendu SSR via GatsbyJS.",
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
  ${box('p4', 20, 50, 'APIs tierces', '', 'neutral')}
  ${box('p4', 20, 150, 'SFTP', 'Flux données', 'neutral')}
  ${arrow('p4', 140, 70, 188, 105)}
  ${arrow('p4', 140, 170, 188, 125)}
  ${box('p4', 190, 90, 'NestJS', 'Agrégation', 'primary')}
  ${arrow('p4', 310, 110, 348, 110)}
  ${box('p4', 350, 90, 'GraphQL', 'API', 'primary')}
  ${arrow('p4', 470, 110, 508, 110)}
  ${box('p4', 510, 90, 'GatsbyJS', 'SSR Front', 'primary')}
  ${arrow('p4', 240, 130, 240, 163)}
  ${box('p4', 180, 165, 'PostgreSQL', 'Scores', 'neutral')}
</svg>`,
  },
  {
    slug: 'margoo',
    titre: 'Margoo',
    secteur: 'E-commerce',
    periode: 'juil. 2020 — 2021',
    url: 'https://margoo.fr',
    resume:
      "Collaboration sur la plateforme e-commerce margoo.fr : développement du site, d'un robot de discussion, de l'API et d'une partie du CRM prestataire.",
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
  ${box('p5', 20, 90, 'Gatsby', 'Site web', 'primary')}
  ${arrow('p5', 140, 110, 178, 110)}
  ${box('p5', 180, 90, 'NestJS', 'API', 'primary')}
  ${arrow('p5', 300, 110, 338, 110)}
  ${box('p5', 340, 90, 'SQL', 'Base de données', 'neutral')}
  ${arrow('p5', 240, 130, 240, 163)}
  ${box('p5', 180, 165, 'Botpress', 'Chatbot', 'external')}
  ${arrow('p5', 460, 110, 498, 110)}
  ${box('p5', 500, 90, 'CRM', 'AngularJS', 'neutral')}
</svg>`,
  },
  {
    slug: 'bdl-capital-management',
    titre: 'BDL Capital Management',
    secteur: 'Banque & Assurances',
    periode: 'fév. 2018 — juin 2020',
    url: 'https://www.bdlcm.com/',
    resume:
      "Développement fullstack sur deux ans et demi pour une société de gestion d'actifs parisienne. Applications React, APIs NestJS et Express, base SQL, site WordPress et infrastructure Docker.",
    contexte:
      "Mission longue durée chez un gestionnaire d'actifs. Stack diversifiée : interfaces React pour les analystes, APIs métier en Node.js/NestJS, scripts d'automatisation, et maintenance de l'infrastructure serveur.",
    stack: ['React', 'NestJS', 'Express', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'WordPress'],
    livrables: [
      "Applications React pour les outils internes d'analyse financière",
      'APIs NestJS et Express pour les données de portefeuilles',
      "Scripts JavaScript d'automatisation et de traitement de données",
      'Maintenance et évolutions du site WordPress public',
      'Déploiement et maintenance des serveurs via Docker',
    ],
    schema: `<svg viewBox="0 0 660 220" ${SVG_ATTRS}>${markerDef('p6')}
  ${box('p6', 20, 90, 'React', 'Interfaces', 'primary')}
  ${arrow('p6', 140, 110, 178, 110)}
  ${box('p6', 180, 90, 'NestJS', 'API métier', 'primary')}
  ${arrow('p6', 300, 110, 338, 110)}
  ${box('p6', 340, 90, 'SQL', 'Base de données', 'neutral')}
  ${arrow('p6', 240, 130, 240, 163)}
  ${box('p6', 180, 165, 'Express', 'Scripts / jobs', 'neutral')}
  <text x="560" y="60" font-size="10" font-family="system-ui,sans-serif" fill="#6b7280" text-anchor="middle">Infra</text>
  ${box('p6', 500, 68, 'Docker', 'Déploiement', 'external')}
  <line x1="460" y1="110" x2="498" y2="88" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="4 3"/>
</svg>`,
  },
];
