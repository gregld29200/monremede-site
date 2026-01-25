import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-01-13',
  useCdn: false,
})

interface Subscriber {
  _id: string
  firstName: string
  email: string
  source: string
}

interface ExistingReview {
  _id: string
  rating: number
  submittedAt: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json(
        { error: 'Token requis' },
        { status: 400 }
      )
    }

    // Find subscriber by token
    const subscriber = await client.fetch(
      `*[_type == "leadMagnetSubscriber" && downloadToken == $token][0]{
        _id,
        firstName,
        email,
        source
      }`,
      { token } as unknown as Record<string, never>
    ) as Subscriber | null

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 404 }
      )
    }

    // Check if review already exists
    const existingReview = await client.fetch(
      `*[_type == "guideReview" && subscriber._ref == $subscriberId][0]{
        _id,
        rating,
        submittedAt
      }`,
      { subscriberId: subscriber._id } as unknown as Record<string, never>
    ) as ExistingReview | null

    return NextResponse.json({
      success: true,
      subscriber: {
        id: subscriber._id,
        firstName: subscriber.firstName,
        source: subscriber.source,
      },
      hasReview: !!existingReview,
      review: existingReview || null,
    })
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error)

    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
