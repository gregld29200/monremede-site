import type { Question, CategoryInfo, ProfileInfo } from './types'

// Informations sur les catégories
export const categories: CategoryInfo[] = [
  { id: 'etatGeneral', name: 'État de Santé Général', maxScore: 9, alertThreshold: 5 },
  { id: 'energieVitalite', name: 'Énergie & Vitalité', maxScore: 5, alertThreshold: 3 },
  { id: 'digestionTransit', name: 'Digestion & Transit', maxScore: 6, alertThreshold: 4 },
  { id: 'alimentationComportement', name: 'Alimentation & Comportement', maxScore: 6, alertThreshold: 3 },
  { id: 'emotionsMental', name: 'Émotions & Mental', maxScore: 6, alertThreshold: 3 },
  { id: 'sommeil', name: 'Sommeil', maxScore: 3, alertThreshold: 2 },
  { id: 'peauCheveux', name: 'Peau & Cheveux', maxScore: 3, alertThreshold: 2 },
  { id: 'douleursInconforts', name: 'Douleurs & Inconforts', maxScore: 3, alertThreshold: 2 },
  { id: 'modeVie', name: 'Mode de Vie', maxScore: 6, alertThreshold: 3 },
]

// Toutes les questions du questionnaire
export const questions: Question[] = [
  // PARTIE 1 — État de Santé Général
  {
    id: 'q1',
    category: 'etatGeneral',
    text: 'Souffrez-vous actuellement d\'une ou plusieurs pathologies ?',
    hasAdditionalInfo: true,
    additionalInfoPlaceholder: 'Si oui, précisez (ou écrivez "aucune idée" si vous ne savez pas)',
    options: [
      { id: 'q1_a', text: 'Non, aucune pathologie connue', points: 0 },
      { id: 'q1_b', text: 'Oui, une pathologie légère (allergie, trouble mineur)', points: 1 },
      { id: 'q1_c', text: 'Oui, une pathologie chronique (diabète, hypertension, thyroïde, etc.)', points: 2 },
      { id: 'q1_d', text: 'Oui, plusieurs pathologies', points: 3 },
    ],
  },
  {
    id: 'q2',
    category: 'etatGeneral',
    text: 'Êtes-vous de nature fébrile (sensible aux infections, fièvres fréquentes) ?',
    options: [
      { id: 'q2_a', text: 'Non, rarement malade', points: 0 },
      { id: 'q2_b', text: 'Parfois, lors des changements de saison', points: 1 },
      { id: 'q2_c', text: 'Oui, je tombe souvent malade', points: 2 },
      { id: 'q2_d', text: 'Oui, très souvent, mon corps est fragile', points: 3 },
    ],
  },
  {
    id: 'q3',
    category: 'etatGeneral',
    text: 'Un de vos deux parents ou une personne de votre famille proche souffre-t-il d\'une maladie ou d\'une pathologie ?',
    hasAdditionalInfo: true,
    additionalInfoPlaceholder: 'Si oui, précisez',
    options: [
      { id: 'q3_a', text: 'Non, pas à ma connaissance', points: 0 },
      { id: 'q3_b', text: 'Oui, une pathologie légère', points: 1 },
      { id: 'q3_c', text: 'Oui, une maladie chronique (diabète, cancer, maladie cardiaque, etc.)', points: 2 },
      { id: 'q3_d', text: 'Oui, plusieurs membres de ma famille sont concernés', points: 3 },
    ],
  },

  // PARTIE 2 — Énergie & Vitalité
  {
    id: 'q4',
    category: 'energieVitalite',
    text: 'Comment vous sentez-vous au réveil ?',
    options: [
      { id: 'q4_a', text: 'Reposé(e)', points: 0 },
      { id: 'q4_b', text: 'Correcte, mais j\'aurais besoin de plus de sommeil', points: 1 },
      { id: 'q4_c', text: 'Fatigué(e), épuisé(e), j\'ai du mal à sortir du lit', points: 2 },
    ],
  },
  {
    id: 'q5',
    category: 'energieVitalite',
    text: 'Êtes-vous fatigué(e) dans la journée ?',
    options: [
      { id: 'q5_a', text: 'Rarement ou jamais', points: 0 },
      { id: 'q5_b', text: 'Parfois, surtout après le déjeuner', points: 1 },
      { id: 'q5_c', text: 'Souvent, plusieurs fois par jour', points: 2 },
      { id: 'q5_d', text: 'Constamment, je suis toujours fatigué(e)', points: 3 },
    ],
  },

  // PARTIE 3 — Digestion & Transit
  {
    id: 'q6',
    category: 'digestionTransit',
    text: 'Comment qualifiez-vous votre digestion ?',
    options: [
      { id: 'q6_a', text: 'Excellente, je digère tout facilement', points: 0 },
      { id: 'q6_b', text: 'Correcte, quelques inconforts occasionnels', points: 1 },
      { id: 'q6_c', text: 'Difficile, souvent ballonné(e) ou lourd(e)', points: 2 },
      { id: 'q6_d', text: 'Très problématique, douleurs fréquentes', points: 3 },
    ],
  },
  {
    id: 'q7',
    category: 'digestionTransit',
    text: 'Souffrez-vous de problèmes de transit ?',
    options: [
      { id: 'q7_a', text: 'Jamais ou très rarement', points: 0 },
      { id: 'q7_b', text: 'Parfois, après certains repas', points: 1 },
      { id: 'q7_c', text: 'Souvent, presque tous les jours', points: 2 },
      { id: 'q7_d', text: 'Constamment, mon ventre est toujours gonflé', points: 3 },
    ],
  },

  // PARTIE 4 — Alimentation & Comportement
  {
    id: 'q8',
    category: 'alimentationComportement',
    text: 'À quelle fréquence consommez-vous des aliments transformés (plats préparés, fast-food, snacks industriels) ?',
    options: [
      { id: 'q8_a', text: 'Rarement (moins d\'une fois par semaine)', points: 0 },
      { id: 'q8_b', text: 'Occasionnellement (1-2 fois par semaine)', points: 1 },
      { id: 'q8_c', text: 'Régulièrement (3-5 fois par semaine)', points: 2 },
      { id: 'q8_d', text: 'Très souvent (presque tous les jours)', points: 3 },
    ],
  },
  {
    id: 'q9',
    category: 'alimentationComportement',
    text: 'Avez-vous des envies irrésistibles de sucre ou de grignotage ?',
    options: [
      { id: 'q9_a', text: 'Rarement ou jamais', points: 0 },
      { id: 'q9_b', text: 'Parfois, je résiste facilement', points: 1 },
      { id: 'q9_c', text: 'Souvent, j\'ai du mal à résister', points: 2 },
      { id: 'q9_d', text: 'Constamment, je suis accro au sucre', points: 3 },
    ],
  },

  // PARTIE 5 — Gestion des Émotions & Mental
  {
    id: 'q10',
    category: 'emotionsMental',
    text: 'Comment gérez-vous vos émotions au quotidien ?',
    hasAdditionalInfo: true,
    additionalInfoPlaceholder: 'Précisez si vous le souhaitez',
    options: [
      { id: 'q10_a', text: 'Très bien, je suis serein(e) et stable', points: 0 },
      { id: 'q10_b', text: 'Plutôt bien, avec quelques moments difficiles', points: 1 },
      { id: 'q10_c', text: 'Difficilement, je suis souvent stressé(e)', points: 2 },
      { id: 'q10_d', text: 'Mal, submergé(e), stressé(e), angoissé(e)', points: 3 },
    ],
  },
  {
    id: 'q11',
    category: 'emotionsMental',
    text: 'Avez-vous des difficultés de concentration ou des « brouillards mentaux » ?',
    options: [
      { id: 'q11_a', text: 'Jamais, je suis toujours alerte', points: 0 },
      { id: 'q11_b', text: 'Parfois, surtout quand je suis fatigué(e)', points: 1 },
      { id: 'q11_c', text: 'Souvent, j\'ai du mal à me concentrer', points: 2 },
      { id: 'q11_d', text: 'Constamment, ma tête est « dans le brouillard »', points: 3 },
    ],
  },

  // PARTIE 6 — Sommeil
  {
    id: 'q12',
    category: 'sommeil',
    text: 'Avez-vous du mal à vous endormir ?',
    options: [
      { id: 'q12_a', text: 'Non, je m\'endors facilement', points: 0 },
      { id: 'q12_b', text: 'Parfois, selon les jours', points: 1 },
      { id: 'q12_c', text: 'Souvent, je mets plus de 30 minutes', points: 2 },
      { id: 'q12_d', text: 'Presque toujours, je lutte pour dormir', points: 3 },
    ],
  },

  // PARTIE 7 — Peau & Cheveux
  {
    id: 'q13',
    category: 'peauCheveux',
    text: 'Comment est l\'état de votre peau et de vos cheveux ?',
    options: [
      { id: 'q13_a', text: 'Peau claire et lumineuse, cheveux forts et brillants', points: 0 },
      { id: 'q13_b', text: 'Quelques imperfections cutanées ou cheveux légèrement fragilisés', points: 1 },
      { id: 'q13_c', text: 'Problèmes de peau (acné, eczéma, sécheresse) ou chute de cheveux', points: 2 },
      { id: 'q13_d', text: 'Problèmes importants de peau ET de cheveux', points: 3 },
    ],
  },

  // PARTIE 8 — Douleurs & Inconforts
  {
    id: 'q14',
    category: 'douleursInconforts',
    text: 'Avez-vous des douleurs articulaires ou musculaires ?',
    options: [
      { id: 'q14_a', text: 'Non', points: 0 },
      { id: 'q14_b', text: 'Légères, occasionnelles', points: 1 },
      { id: 'q14_c', text: 'Modérées, régulières', points: 2 },
      { id: 'q14_d', text: 'Importantes, chroniques', points: 3 },
    ],
  },

  // PARTIE 9 — Mode de Vie
  {
    id: 'q15',
    category: 'modeVie',
    text: 'Êtes-vous active physiquement ?',
    options: [
      { id: 'q15_a', text: 'Oui, je fais du sport régulièrement', points: 0 },
      { id: 'q15_b', text: 'Oui, les activités de mère au foyer', points: 1 },
      { id: 'q15_c', text: 'Non, je suis casanier(ère)', points: 3 },
    ],
  },
  {
    id: 'q16',
    category: 'modeVie',
    text: 'Avez-vous déjà fait hijama (cupping thérapie) ?',
    hasAdditionalInfo: true,
    additionalInfoPlaceholder: 'Si non, précisez pourquoi',
    options: [
      { id: 'q16_a', text: 'Oui, régulièrement', points: 0 },
      { id: 'q16_b', text: 'Oui, une ou deux fois', points: 1 },
      { id: 'q16_c', text: 'Non, je ne veux pas', points: 3 },
    ],
  },
]

// Profils de résultats
export const profiles: Record<string, ProfileInfo> = {
  equilibre: {
    type: 'equilibre',
    title: 'Profil « Équilibré »',
    emoji: '🌟',
    color: 'gold',
    description: 'Félicitations ! Votre hygiène de vie est globalement excellente. Votre corps fonctionne de manière optimale et vous avez de bonnes habitudes.',
    recommendations: [
      'Maintenir vos bonnes habitudes',
      'Approfondir vos connaissances pour prévenir les déséquilibres futurs',
      'Optimiser encore certains aspects pour atteindre une santé rayonnante',
    ],
    bookBenefits: [
      'Les secrets de la longévité et du vieillissement en bonne santé',
      'Comment maximiser les bienfaits du jeûne',
      'Des recettes pour booster encore votre vitalité',
    ],
  },
  alerte: {
    type: 'alerte',
    title: 'Profil « En Alerte »',
    emoji: '⚠️',
    color: 'gold',
    description: 'Attention ! Votre corps vous envoie des signaux qu\'il ne faut pas ignorer. Vous êtes dans une zone où de petits ajustements peuvent faire une grande différence.',
    recommendations: [
      'Fatigue récurrente',
      'Digestion perturbée',
      'Fringales sucrées',
      'Émotions difficiles à gérer',
    ],
    bookBenefits: [
      'Comment nettoyer votre organisme en douceur',
      'Les aliments qui drainent et ceux qui encrassent',
      'Un programme détox adapté au Ramadan',
      'Les erreurs alimentaires que vous faites sans le savoir',
      'Comment retrouver votre énergie naturelle',
    ],
  },
  difficulte: {
    type: 'difficulte',
    title: 'Profil « En Difficulté »',
    emoji: '🔴',
    color: 'blush-deep',
    description: 'Votre corps tire la sonnette d\'alarme ! Les symptômes que vous ressentez ne sont pas « normaux » — ce sont des cris de détresse de votre organisme.',
    recommendations: [
      'Votre foie est surchargé',
      'Votre intestin est probablement poreux',
      'Votre système nerveux est épuisé',
      'Votre inflammation chronique silencieuse fait des dégâts',
    ],
    bookBenefits: [
      'Comment fonctionne votre corps pendant le jeûne',
      'Le protocole de détox en 15 jours étape par étape',
      'Les aliments anti-inflammatoires puissants',
      'Comment réparer votre intestin',
      'Les remèdes de la médecine prophétique validés par la science',
      'Un plan alimentaire complet pour chaque pathologie',
    ],
  },
  urgent: {
    type: 'urgent',
    title: 'Profil « Urgent »',
    emoji: '🚨',
    color: 'blush-deep',
    description: 'C\'est un appel à l\'action immédiat. Votre corps est en souffrance profonde et chaque jour qui passe aggrave la situation.',
    recommendations: [
      'Consulter un professionnel de santé pour écarter toute pathologie grave',
      'Revoir entièrement votre alimentation — ce n\'est plus une option',
      'Comprendre les mécanismes de votre corps pour ne plus subir',
    ],
    bookBenefits: [
      'Pourquoi vous en êtes arrivée là (et ce n\'est pas votre faute)',
      'Comment le corps se régénère — organe par organe',
      'Le pouvoir thérapeutique du jeûne, validé par la science',
      'Un programme complet de restauration',
      'Les aliments qui guérissent selon la médecine prophétique',
      'Comment transformer le Ramadan en cure de jouvence',
      'Des solutions concrètes pour chaque symptôme',
    ],
  },
}

export const AMAZON_BOOK_LINK = 'https://www.amazon.fr/dp/2959216601'
