/** Exemples de comptes-rendus, anonymisés. Le cas « blocage » est volontaire : c'est le plus utile. */

export const HERO_REPORT = {
  meta: 'mar. 3 juin · 18:34 · Refonte du paiement en ligne',
  done: [
    "Le nouveau paiement est en place sur les 4 espaces que vous m'avez listés.",
    'Remboursements testés sur les 3 cas principaux. Un cas instable, repris demain matin.',
  ],
  decide: [
    "On garde l'ancien système en parallèle une semaine ? Je suis pour. À vous de trancher.",
  ],
} as const;

export const NOMINAL_REPORT = {
  meta: 'mar. 3 juin · 18:34 · Refonte du paiement en ligne',
  done: [
    "Le nouveau système de paiement est en place sur les 4 espaces que vous m'avez listés.",
    'Les remboursements sont testés sur les 3 cas principaux. Un cas instable à reprendre demain matin.',
  ],
  upcoming: [
    "Activer l'alerte automatique en cas d'échec de paiement (estimé : 2 h).",
    'Mettre à jour la documentation pour votre équipe.',
  ],
  decide: [
    "On garde l'ancien système actif en parallèle pendant une semaine ? Plus prudent pour la transition. Je suis pour. À vous de trancher.",
  ],
} as const;

export const BLOCKED_REPORT = {
  meta: 'mer. 4 juin · 18:42 · Refonte du paiement en ligne',
  done: ["L'alerte d'échec de paiement est branchée et fonctionne en environnement de test."],
  blocked: [
    "Un cas particulier sur les remboursements partiels me résiste. J'ai exploré deux pistes, aucune ne tient proprement. Je reprends demain matin. Si je n'avance pas d'ici midi, je vous propose qu'on en parle 15 min.",
  ],
  upcoming: [
    'Finir la documentation pour votre équipe.',
    'Faire un point sur la mise en production de la semaine prochaine.',
  ],
} as const;
