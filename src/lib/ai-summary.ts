import Anthropic from '@anthropic-ai/sdk'

interface CategoryScores {
  etatGeneral: number
  energieVitalite: number
  digestionTransit: number
  alimentationComportement: number
  emotionsMental: number
  sommeil: number
  peauCheveux: number
  douleursInconforts: number
  modeVie: number
}

interface AnswerData {
  questionId: string
  questionText: string
  answerText: string
  points: number
  additionalInfo?: string
}

interface QuestionnaireData {
  firstName: string
  lastName: string
  age: number
  totalScore: number
  profile: 'equilibre' | 'alerte' | 'difficulte' | 'urgent'
  categoryScores: CategoryScores
  answers: AnswerData[]
}

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

export async function generateQuestionnaireSummary(
  data: QuestionnaireData
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not configured, skipping AI summary')
    return ''
  }

  const client = new Anthropic({ apiKey })

  // Préparer les données pour le prompt
  const categoryScoresList = Object.entries(data.categoryScores)
    .map(([key, score]) => `- ${categoryNames[key]}: ${score}/6`)
    .join('\n')

  const answersList = data.answers
    .map((a) => {
      let text = `Q: ${a.questionText}\nR: ${a.answerText} (${a.points} pts)`
      if (a.additionalInfo) {
        text += `\nPrécision: ${a.additionalInfo}`
      }
      return text
    })
    .join('\n\n')

  const prompt = `Tu es Oum Soumayya, praticienne en naturopathie depuis 2009, spécialisée dans l'accompagnement holistique basé sur la naturopathie et la médecine prophétique.

Une personne vient de remplir un questionnaire de santé. Voici ses informations :

**Profil:**
- Prénom: ${data.firstName}
- Âge: ${data.age} ans
- Score total: ${data.totalScore}/50
- Profil: ${profileLabels[data.profile]}

**Scores par catégorie:**
${categoryScoresList}

**Réponses détaillées:**
${answersList}

---

Rédige un résumé professionnel et bienveillant de ce bilan de santé en 3-4 paragraphes.

Structure ton résumé ainsi :
1. **Synthèse générale** : État de santé global de la personne en quelques phrases
2. **Points d'attention prioritaires** : Les 2-3 domaines qui nécessitent une attention particulière (basé sur les scores les plus élevés)
3. **Observations clés** : Ce que révèlent les réponses spécifiques (habitudes, symptômes récurrents, etc.)
4. **Pistes d'accompagnement** : Premières recommandations générales en naturopathie

Ton style doit être :
- Professionnel mais chaleureux
- Utilisé le "vous" pour s'adresser à la personne
- Pas de jargon médical complexe
- Encourageant tout en étant honnête sur les points à améliorer

Ne mets pas de titre ou d'en-tête, écris directement le contenu du résumé.`

  try {
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
    return textBlock ? textBlock.text : ''
  } catch (error) {
    console.error('Error generating AI summary:', error)
    return ''
  }
}
