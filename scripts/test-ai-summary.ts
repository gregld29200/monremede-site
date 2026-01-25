import Anthropic from '@anthropic-ai/sdk'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const categoryNames: Record<string, string> = {
  etatGeneral: 'État Général',
  energieVitalite: 'Énergie & Vitalité',
  digestionTransit: 'Digestion & Transit',
  alimentationComportement: 'Alimentation & Comportement',
  emotionsMental: 'Émotions & Mental',
  sommeil: 'Sommeil',
  peauCheveux: 'Peau & Cheveux',
  douleursInconforts: 'Douleurs & Inconforts',
  modeVie: 'Mode de Vie',
}

const profileLabels: Record<string, string> = {
  equilibre: 'Équilibré',
  alerte: 'En Alerte',
  difficulte: 'En Difficulté',
  urgent: 'Urgent',
}

// Données de Khadija
const khadijaData = {
  firstName: 'Khadija',
  lastName: 'Prudent',
  age: 37,
  totalScore: 17,
  profile: 'alerte' as const,
  categoryScores: {
    etatGeneral: 4,
    energieVitalite: 1,
    digestionTransit: 2,
    alimentationComportement: 3,
    emotionsMental: 2,
    sommeil: 1,
    peauCheveux: 1,
    douleursInconforts: 1,
    modeVie: 2,
  },
  answers: [
    {
      questionId: 'q1',
      questionText: "Souffrez-vous actuellement d'une ou plusieurs pathologies ?",
      answerText: 'Oui, une pathologie chronique (diabète, hypertension, thyroïde, etc.)',
      points: 2,
      additionalInfo: 'Des nodules dans la thyroïde',
    },
    {
      questionId: 'q2',
      questionText: 'Êtes-vous de nature fébrile (sensible aux infections, fièvres fréquentes) ?',
      answerText: 'Non, rarement malade',
      points: 0,
    },
    {
      questionId: 'q3',
      questionText: "Un de vos deux parents ou une personne de votre famille proche souffre-t-il d'une maladie ou d'une pathologie ?",
      answerText: 'Oui, une maladie chronique (diabète, cancer, maladie cardiaque, etc.)',
      points: 2,
      additionalInfo: 'AVC et prédiabète',
    },
    {
      questionId: 'q4',
      questionText: 'Comment vous sentez-vous au réveil ?',
      answerText: 'Reposé(e)',
      points: 0,
    },
    {
      questionId: 'q5',
      questionText: 'Êtes-vous fatigué(e) dans la journée ?',
      answerText: 'Parfois, surtout après le déjeuner',
      points: 1,
    },
    {
      questionId: 'q6',
      questionText: 'Comment qualifiez-vous votre digestion ?',
      answerText: 'Correcte, quelques inconforts occasionnels',
      points: 1,
    },
    {
      questionId: 'q7',
      questionText: 'Souffrez-vous de problèmes de transit ?',
      answerText: 'Parfois, après certains repas',
      points: 1,
    },
    {
      questionId: 'q8',
      questionText: 'À quelle fréquence consommez-vous des aliments transformés (plats préparés, fast-food, snacks industriels) ?',
      answerText: 'Occasionnellement (1-2 fois par semaine)',
      points: 1,
    },
    {
      questionId: 'q9',
      questionText: 'Avez-vous des envies irrésistibles de sucre ou de grignotage ?',
      answerText: "Souvent, j'ai du mal à résister",
      points: 2,
    },
    {
      questionId: 'q10',
      questionText: 'Comment gérez-vous vos émotions au quotidien ?',
      answerText: 'Plutôt bien, avec quelques moments difficiles',
      points: 1,
    },
    {
      questionId: 'q11',
      questionText: 'Avez-vous des difficultés de concentration ou des « brouillards mentaux » ?',
      answerText: 'Parfois, surtout quand je suis fatigué(e)',
      points: 1,
    },
    {
      questionId: 'q12',
      questionText: 'Avez-vous du mal à vous endormir ?',
      answerText: 'Parfois, selon les jours',
      points: 1,
    },
    {
      questionId: 'q13',
      questionText: "Comment est l'état de votre peau et de vos cheveux ?",
      answerText: 'Quelques imperfections cutanées ou cheveux légèrement fragilisés',
      points: 1,
    },
    {
      questionId: 'q14',
      questionText: 'Avez-vous des douleurs articulaires ou musculaires ?',
      answerText: 'Légères, occasionnelles',
      points: 1,
    },
    {
      questionId: 'q15',
      questionText: 'Êtes-vous active physiquement ?',
      answerText: 'Oui, les activités de mère au foyer',
      points: 1,
    },
    {
      questionId: 'q16',
      questionText: 'Avez-vous déjà fait hijama (cupping thérapie) ?',
      answerText: 'Oui, une ou deux fois',
      points: 1,
    },
  ],
}

async function generateSummary() {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not found in .env.local')
    process.exit(1)
  }

  const client = new Anthropic({ apiKey })

  // Préparer les données pour le prompt
  const categoryScoresList = Object.entries(khadijaData.categoryScores)
    .map(([key, score]) => `- ${categoryNames[key]}: ${score}/6`)
    .join('\n')

  const answersList = khadijaData.answers
    .map((a) => {
      let text = `Q: ${a.questionText}\nR: ${a.answerText} (${a.points} pts)`
      if (a.additionalInfo) {
        text += `\nPrécision: ${a.additionalInfo}`
      }
      return text
    })
    .join('\n\n')

  const prompt = `Tu es un assistant qui rédige des résumés objectifs de questionnaires de santé. Ton rôle est uniquement de COMMUNIQUER les informations de façon claire et naturelle, PAS d'interpréter ou de donner des recommandations.

Voici les données d'un questionnaire de santé :

**Personne:**
- Prénom: ${khadijaData.firstName}
- Nom: ${khadijaData.lastName}
- Âge: ${khadijaData.age} ans
- Score total: ${khadijaData.totalScore}/50
- Profil obtenu: ${profileLabels[khadijaData.profile]}

**Scores par catégorie (sur 6):**
${categoryScoresList}

**Réponses au questionnaire:**
${answersList}

---

CONSIGNES IMPORTANTES :
- Rédige un résumé OBJECTIF en 3-4 paragraphes
- Exprime les informations en langage naturel et fluide
- NE FAIS AUCUNE interprétation des résultats
- NE DONNE AUCUNE recommandation ou conseil
- NE TIRE AUCUNE conclusion sur l'état de santé
- Contente-toi de reformuler les réponses de façon claire et lisible

Structure suggérée :
1. Présentation de la personne et son score global
2. Résumé des réponses concernant l'état général, l'énergie et le sommeil
3. Résumé des réponses concernant la digestion, l'alimentation et le mode de vie
4. Résumé des réponses concernant les émotions, la peau et les éventuelles douleurs

Écris directement le résumé sans titre ni en-tête. Utilise un ton neutre et factuel.`

  console.log('Génération du résumé objectif pour Khadija Prudent...\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  const summary = textBlock ? textBlock.text : ''

  console.log('=== RÉSUMÉ OBJECTIF ===\n')
  console.log(summary)
  console.log('\n=== FIN DU RÉSUMÉ ===')

  return summary
}

generateSummary().catch(console.error)
