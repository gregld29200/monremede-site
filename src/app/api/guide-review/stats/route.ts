import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-01-13',
  useCdn: true,
})

interface ReviewRating {
  rating: number
}

interface FeaturedReview {
  _id: string
  rating: number
  comment: string
  displayName: string
  submittedAt: string
}

export async function GET() {
  try {
    // Get all approved reviews for stats
    const allReviews = await client.fetch<ReviewRating[]>(
      `*[_type == "guideReview" && approved == true]{
        rating
      }`
    )

    // Calculate stats
    const totalReviews = allReviews.length
    const averageRating = totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0

    // Get featured reviews (up to 3)
    const featuredReviews = await client.fetch<FeaturedReview[]>(
      `*[_type == "guideReview" && approved == true && featured == true] | order(submittedAt desc)[0...3]{
        _id,
        rating,
        comment,
        displayName,
        submittedAt
      }`
    )

    return NextResponse.json({
      success: true,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
      featuredReviews,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error)

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
