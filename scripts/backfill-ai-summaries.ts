import { createClient } from 'next-sanity'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { generateQuestionnaireSummary } from '../src/lib/ai-summary'

// Charger les variables d'environnement depuis .env.local
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
envContent.split('\n').forEach((line) => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim()
  }
})

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

interface QuestionnaireSubmission {
  _id: string
  firstName: string
  lastName: string
  age: number
  totalScore: number
  profile: 'equilibre' | 'alerte' | 'difficulte' | 'urgent'
  categoryScores: CategoryScores
  answers: AnswerData[]
  aiSummary?: string
}

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!token) {
    throw new Error('SANITY_API_WRITE_TOKEN is not configured in .env.local')
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-01-13',
    useCdn: false,
    token,
  })
}

async function backfillSummaries() {
  console.log('=== Backfill AI Summaries ===\n')

  const client = getWriteClient()

  // Récupérer tous les prospects sans résumé IA
  const prospects = await client.fetch<QuestionnaireSubmission[]>(
    `*[_type == "questionnaireSubmission" && !defined(aiSummary)]{
      _id,
      firstName,
      lastName,
      age,
      totalScore,
      profile,
      categoryScores,
      answers
    }`
  )

  console.log(`Trouvé ${prospects.length} prospect(s) sans résumé IA\n`)

  if (prospects.length === 0) {
    console.log('Tous les prospects ont déjà un résumé IA.')
    return
  }

  let successCount = 0
  let errorCount = 0

  for (const prospect of prospects) {
    console.log(`Traitement de ${prospect.firstName} ${prospect.lastName}...`)

    try {
      // Générer le résumé
      const summary = await generateQuestionnaireSummary({
        firstName: prospect.firstName,
        lastName: prospect.lastName,
        age: prospect.age,
        totalScore: prospect.totalScore,
        profile: prospect.profile,
        categoryScores: prospect.categoryScores,
        answers: prospect.answers,
      })

      if (summary) {
        // Mettre à jour le document
        await client.patch(prospect._id).set({ aiSummary: summary }).commit()
        console.log(`  ✓ Résumé généré et sauvegardé`)
        successCount++
      } else {
        console.log(`  ⚠ Résumé vide généré`)
        errorCount++
      }

      // Attendre un peu pour éviter le rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`  ✗ Erreur:`, error)
      errorCount++
    }
  }

  console.log('\n=== Résultat ===')
  console.log(`Succès: ${successCount}`)
  console.log(`Erreurs: ${errorCount}`)
}

backfillSummaries().catch(console.error)
