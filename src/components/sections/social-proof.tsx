'use client'

import { useEffect, useState } from 'react'

interface Review {
  _id: string
  rating: number
  comment: string
  displayName: string
  submittedAt: string
}

interface Stats {
  totalReviews: number
  averageRating: number
}

export function SocialProof() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/guide-review/stats')
        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
          setReviews(data.featuredReviews || [])
        }
      } catch (err) {
        console.error('Erreur lors du chargement des avis:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading || !stats || stats.totalReviews === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-cream-warm rounded-full">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-xl">
                {i < Math.round(stats.averageRating) ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <div className="h-6 w-px bg-sage/30" />
          <span className="text-forest font-medium">
            {stats.averageRating.toFixed(1)}/5
          </span>
          <span className="text-ink-soft text-sm">
            ({stats.totalReviews} avis)
          </span>
        </div>
      </div>

      {/* Featured reviews */}
      {reviews.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-cream-warm rounded-lg p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-sm">⭐</span>
                  ))}
                </div>
                <span className="text-xs text-sage">
                  {new Date(review.submittedAt).toLocaleDateString('fr-FR', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-ink-soft text-sm leading-relaxed line-clamp-4">
                &ldquo;{review.comment}&rdquo;
              </p>
              <p className="text-forest font-medium text-sm">
                {review.displayName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
