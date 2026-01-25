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

  const prompt = `Tu es un assistant qui rédige des résumés objectifs de questionnaires de santé. Ton rôle est uniquement de COMMUNIQUER les informations de façon claire et naturelle, PAS d'interpréter ou de donner des recommandations.

Voici les données d'un questionnaire de santé :

**Personne:**
- Prénom: ${data.firstName}
- Nom: ${data.lastName}
- Âge: ${data.age} ans
- Score total: ${data.totalScore}/50
- Profil obtenu: ${profileLabels[data.profile]}

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
