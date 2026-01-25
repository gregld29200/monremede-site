import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { getResendClient, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/resend'
import { generateQuestionnaireResultsEmail, getEmailSubject } from '@/lib/email-templates/questionnaire-results'

// Create write client at request time to ensure env vars are available
function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN

  // Debug logging (will appear in Vercel logs)
  console.log('[Sanity Debug] Token exists:', !!token)
  console.log('[Sanity Debug] Token length:', token?.length || 0)
  console.log('[Sanity Debug] Token prefix:', token?.substring(0, 10) || 'MISSING')
  console.log('[Sanity Debug] Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
  console.log('[Sanity Debug] Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)

  if (!token) {
    throw new Error('SANITY_API_WRITE_TOKEN is not configured')
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-01-13',
    useCdn: false,
    token,
  })
}

interface AnswerData {
  questionId: string
  questionText: string
  answerText: string
  points: number
  additionalInfo?: string
}

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

interface SubmissionData {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  totalScore: number
  profile: 'equilibre' | 'alerte' | 'difficulte' | 'urgent'
  categoryScores: CategoryScores
  answers: AnswerData[]
}

export async function POST(request: NextRequest) {
  try {
    const data: SubmissionData = await request.json()

    // Validation basique
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.age) {
      return NextResponse.json(
        { error: 'Informations personnelles manquantes' },
        { status: 400 }
      )
    }

    if (!data.answers || data.answers.length === 0) {
      return NextResponse.json(
        { error: 'Réponses manquantes' },
        { status: 400 }
      )
    }

    // Get client at request time (ensures env vars are loaded)
    const writeClient = getWriteClient()

    // Créer le document dans Sanity
    const result = await writeClient.create({
      _type: 'questionnaireSubmission',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      totalScore: data.totalScore,
      profile: data.profile,
      categoryScores: data.categoryScores,
      answers: data.answers.map((answer) => ({
        _key: answer.questionId,
        questionId: answer.questionId,
        questionText: answer.questionText,
        answerText: answer.answerText,
        points: answer.points,
        additionalInfo: answer.additionalInfo || '',
      })),
      status: 'nouveau',
      submittedAt: new Date().toISOString(),
    })

    // Envoyer l'email avec les résultats
    const resend = getResendClient()
    if (resend) {
      try {
        const emailHtml = generateQuestionnaireResultsEmail({
          firstName: data.firstName,
          lastName: data.lastName,
          totalScore: data.totalScore,
          profile: data.profile,
          categoryScores: data.categoryScores,
        })

        await resend.emails.send({
          from: FROM_EMAIL,
          to: data.email,
          replyTo: REPLY_TO_EMAIL,
          subject: getEmailSubject(data.profile),
          html: emailHtml,
        })

        console.log(`Email envoyé à ${data.email}`)
      } catch (emailError) {
        // Log l'erreur mais ne bloque pas la réponse
        console.error('Erreur lors de l\'envoi de l\'email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      id: result._id,
      message: 'Questionnaire enregistré avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)

    // Extract detailed error info for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error && 'response' in error
      ? JSON.stringify((error as { response?: unknown }).response)
      : undefined

    console.error('[Sanity Error Details]:', {
      message: errorMessage,
      details: errorDetails,
      tokenConfigured: !!process.env.SANITY_API_WRITE_TOKEN,
    })

    return NextResponse.json(
      {
        error: 'Erreur lors de la sauvegarde du questionnaire',
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
