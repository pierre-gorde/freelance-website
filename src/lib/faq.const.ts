import {
  COTON_YEARS,
  DEVIS_DELAY_LABEL,
  EXPERIENCE_YEARS,
  FORFAIT_MAX_DAYS,
  RDV_DURATION_LABEL,
} from './site.const';

export type FaqId =
  | 'quotidien'
  | 'distance'
  | 'absence'
  | 'demarrage'
  | 'temps-partiel'
  | 'pas-dispo'
  | 'brief'
  | 'non-tech'
  | 'equipe'
  | 'recrutement'
  | 'pourquoi-vous'
  | 'integration'
  | 'conseil-stack'
  | 'ia';

export type FaqEntry = { question: string; answer: string };

type FaqContext = {
  tjm: string;
  hourly: string;
  /** Localise un lien interne. */
  l: (path: string) => string;
};

export function getFaqEntries({ tjm, hourly, l }: FaqContext): Record<FaqId, FaqEntry> {
  return {
    quotidien: {
      question: 'Pourquoi un compte-rendu chaque jour ? Une réunion par semaine ne suffit pas ?',
      answer:
        "Un point hebdo vous dit ce qui s'est passé. Un compte-rendu quotidien vous permet de réagir le jour même. Si je découvre un blocage le mardi, vous pouvez trancher le mercredi, sans attendre la réunion suivante. Le format est léger : un message factuel le soir, lu en 30 secondes.",
    },
    distance: {
      question: 'Vous travaillez à distance. Comment savoir que vous serez là ?',
      answer:
        "Je suis là tous les jours travaillés, en heures ouvrées. Le compte-rendu du soir le montre : vous voyez chaque soir ce qui a été fait. J'utilise vos canaux (Slack, mail, Teams), pas un portail de plus.",
    },
    absence: {
      question: 'Et si vous êtes malade ou en vacances ?',
      answer:
        "Je préviens à l'avance pour les vacances, et on cale les jalons en conséquence. En cas d'imprévu long, je peux vous recommander des freelances seniors que je connais, sans intermédiation.",
    },
    demarrage: {
      question: 'Comment se passe le démarrage ?',
      answer: `Après un premier échange de ${RDV_DURATION_LABEL}, je vous envoie un devis de démarrage (${DEVIS_DELAY_LABEL.toLowerCase()}) : jusqu'à ${FORFAIT_MAX_DAYS} jours, sur un périmètre défini ensemble. Vous jugez ma façon de travailler sur pièce. Si ça vous convient, on continue en régie.`,
    },
    'temps-partiel': {
      question: "Temps partiel, c'est possible ?",
      answer: `Oui. ${tjm} ou ${hourly}, à temps plein ou à temps partiel. On fixe le rythme au démarrage.`,
    },
    'pas-dispo': {
      question: "Et si vous n'êtes pas disponible tout de suite ?",
      answer:
        "Réservez quand même l'échange. On regarde ensemble quand je peux démarrer et comment on s'organise d'ici là.",
    },
    brief: {
      question: 'Pouvez-vous prendre un chantier sans brief détaillé ?',
      answer:
        'Oui, si le périmètre est délimité. Si le brief est incomplet, je pose les questions qui manquent avant de démarrer, pas au milieu.',
    },
    'non-tech': {
      question: 'Je ne connais rien à la tech. Est-ce un problème ?',
      answer:
        "Non. Ce que j'attends de vous, c'est la connaissance de votre marché, de vos utilisateurs et de vos contraintes. Je traduis ça en produit. Quand une décision technique vous concerne, je vous l'explique en termes clairs avant de la prendre.",
    },
    equipe: {
      question: 'Pouvez-vous coordonner une équipe ?',
      answer: `Oui. Chez Coton, j'ai piloté des équipes de freelances sur des missions clients : choix des profils, répartition du travail, points de synchronisation, tests techniques de recrutement. Sur le projet <a href="${l('/projets/ublo')}">Ublo</a>, j'ai coordonné 4 développeurs juniors : cadrage des chantiers, revues de code, accompagnement au quotidien.`,
    },
    recrutement: {
      question: "Pouvez-vous m'aider à recruter mon équipe tech ?",
      answer:
        "En partie. Je ne chasse pas les profils, c'est le métier d'un recruteur. Je peux écrire les tests techniques, évaluer les candidats et mener les entretiens techniques. Je l'ai fait chez Coton pour recruter les freelances du collectif.",
    },
    'pourquoi-vous': {
      question: "Pourquoi vous, plutôt qu'une agence ou un autre freelance ?",
      answer: `${EXPERIENCE_YEARS} ans de TypeScript, et ${COTON_YEARS} ans à co-fonder le collectif Coton : des dizaines de missions freelance vues de l'intérieur, réussies ou ratées. Le compte-rendu du soir et le devis de démarrage viennent de ce que j'ai vu marcher chez les plus solides du collectif.`,
    },
    integration: {
      question: 'Comment vous intégrez-vous dans une base de code existante ?',
      answer:
        "Je lis avant d'écrire : conventions, patterns en place, zones fragiles. Je ne refais pas tout la première semaine. Si quelque chose mérite d'être discuté, je l'écris dans le compte-rendu ou dans la pull request, sans l'imposer.",
    },
    'conseil-stack': {
      question: "Pouvez-vous me conseiller sur la stack ou l'architecture ?",
      answer:
        'Oui. Je vous aide à choisir ce qui colle à votre contexte : budget, ambitions, recrutements à venir. Je vous donne mon avis et mes raisons, vous décidez.',
    },
    ia: {
      question: "Vous codez avec l'IA. Je paie du code généré au prix fort ?",
      answer:
        "L'IA est un outil. Vous payez le cadrage, le choix de l'architecture, le contrôle de ce qui sort et la garantie que ça tient dans 18 mois. Du code généré mal piloté crée une dette invisible : mon travail consiste à l'éviter. Vous recevez le code que j'aurais écrit, plus vite.",
    },
  };
}

export const FAQ_GROUPS: readonly { title: string; ids: readonly FaqId[] }[] = [
  { title: 'Démarrer', ids: ['demarrage', 'temps-partiel', 'pas-dispo', 'brief'] },
  { title: 'Au quotidien', ids: ['quotidien', 'distance', 'absence', 'integration'] },
  { title: 'Le profil', ids: ['pourquoi-vous', 'equipe', 'recrutement'] },
  { title: 'Sans équipe tech', ids: ['non-tech', 'conseil-stack'] },
  { title: "L'IA et le code", ids: ['ia'] },
];
