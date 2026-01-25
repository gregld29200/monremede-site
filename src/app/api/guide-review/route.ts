import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN

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

interface ReviewData {
  token: string
  rating: number
  comment: string
}

interface Subscriber {
  _id: string
  firstName: string
}

interface ExistingReview {
  _id: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ReviewData = await request.json()

    // Validation
    if (!data.token || !data.rating || !data.comment) {
      return NextResponse.json(
        { error: 'Token, note et commentaire requis' },
        { status: 400 }
      )
    }

    // Validate rating (3, 4, or 5 only)
    if (![3, 4, 5].includes(data.rating)) {
      return NextResponse.json(
        { error: 'La note doit être 3, 4 ou 5 étoiles' },
        { status: 400 }
      )
    }

    // Validate comment length
    const comment = data.comment.trim()
    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Le commentaire doit contenir au moins 10 caractères' },
        { status: 400 }
      )
    }

    if (comment.length > 1000) {
      return NextResponse.json(
        { error: 'Le commentaire ne peut pas dépasser 1000 caractères' },
        { status: 400 }
      )
    }

    const writeClient = getWriteClient()

    // Find subscriber by token
    const subscriber = await writeClient.fetch(
      `*[_type == "leadMagnetSubscriber" && downloadToken == $token][0]{
        _id,
        firstName
      }`,
      { token: data.token } as unknown as Record<string, never>
    ) as Subscriber | null

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 404 }
      )
    }

    // Check if review already exists
    const existingReview = await writeClient.fetch(
      `*[_type == "guideReview" && subscriber._ref == $subscriberId][0]{ _id }`,
      { subscriberId: subscriber._id } as unknown as Record<string, never>
    ) as ExistingReview | null

    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà soumis un avis' },
        { status: 409 }
      )
    }

    // Create the review
    const result = await writeClient.create({
      _type: 'guideReview',
      subscriber: {
        _type: 'reference',
        _ref: subscriber._id,
      },
      rating: data.rating,
      comment,
      displayName: subscriber.firstName,
      approved: false,
      featured: false,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      id: result._id,
      message: 'Merci pour votre avis !',
    })
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'avis:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Erreur lors de la soumission',
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
