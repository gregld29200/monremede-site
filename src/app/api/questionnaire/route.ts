import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

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
    if (!data.firstName || !data.lastName || !data.email || !data.age) {
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

    // Créer le document dans Sanity
    const result = await writeClient.create({
      _type: 'questionnaireSubmission',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
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

    return NextResponse.json({
      success: true,
      id: result._id,
      message: 'Questionnaire enregistré avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du questionnaire' },
      { status: 500 }
    )
  }
}
