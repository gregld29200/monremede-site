import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export interface GuideReviewWithSubscriber {
  _id: string
  rating: number
  comment: string
  displayName: string
  approved: boolean
  featured: boolean
  submittedAt: string
  subscriber: {
    _id: string
    email: string
    firstName: string
    createdAt: string
    guide1Downloaded: boolean
    guide2Unlocked: boolean
  } | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending' | 'approved' | 'featured' | 'all'

    // Build filter based on status
    let filter = '_type == "guideReview"'
    if (status === 'pending') {
      filter += ' && approved != true'
    } else if (status === 'approved') {
      filter += ' && approved == true'
    } else if (status === 'featured') {
      filter += ' && approved == true && featured == true'
    }

    // Fetch reviews with subscriber info
    const reviews = await client.fetch<GuideReviewWithSubscriber[]>(
      `*[${filter}] | order(submittedAt desc) {
        _id,
        rating,
        comment,
        displayName,
        approved,
        featured,
        submittedAt,
        "subscriber": subscriber->{
          _id,
          email,
          firstName,
          createdAt,
          guide1Downloaded,
          guide2Unlocked
        }
      }`
    )

    // Calculate stats
    const allReviews = await client.fetch<{ rating: number; approved: boolean }[]>(
      `*[_type == "guideReview"]{rating, approved}`
    )

    const pendingCount = allReviews.filter(r => !r.approved).length
    const approvedReviews = allReviews.filter(r => r.approved)
    const approvedCount = approvedReviews.length
    const featuredCount = (await client.fetch<number>(`count(*[_type == "guideReview" && featured == true])`))

    const averageRating = approvedCount > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedCount
      : 0

    // Rating distribution
    const ratingDistribution = {
      5: approvedReviews.filter(r => r.rating === 5).length,
      4: approvedReviews.filter(r => r.rating === 4).length,
      3: approvedReviews.filter(r => r.rating === 3).length,
    }

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        total: allReviews.length,
        pending: pendingCount,
        approved: approvedCount,
        featured: featuredCount,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
    })
  } catch (error) {
    console.error('Error fetching guide reviews:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}
