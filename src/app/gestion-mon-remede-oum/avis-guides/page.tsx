'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ReviewCard } from '@/components/admin/guide-reviews'

interface Review {
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

interface Stats {
  total: number
  pending: number
  approved: number
  featured: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
  }
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'featured'

const StarIcon = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg
    className={cn('w-6 h-6', filled ? 'text-gold fill-gold' : 'text-forest/20', className)}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

export default function AvisGuidesPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/gestion-mon-remede-oum/guide-reviews?status=${filter}`)
      const data = await res.json()
      if (data.success) {
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    try {
      const res = await fetch(`/api/gestion-mon-remede-oum/guide-reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (data.success) {
        // Refresh the list
        fetchReviews()
      } else if (data.error) {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const pendingReviews = reviews.filter(r => !r.approved)
  const approvedReviews = reviews.filter(r => r.approved)
  const featuredReviews = reviews.filter(r => r.featured)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-forest">Avis Guides</h1>
          <p className="font-body text-sm text-ink-soft/60 mt-1">
            Gérez les avis laissés par les abonnés pour débloquer le guide 2
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Average Rating */}
          <div className="bg-white rounded-2xl border border-forest/8 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="font-body text-xs text-forest/50 uppercase tracking-wider">Note moyenne</p>
                <p className="font-display text-2xl text-forest">{stats.averageRating}<span className="text-base text-forest/50">/5</span></p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= Math.round(stats.averageRating)} className="w-4 h-4" />
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl border border-forest/8 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <p className="font-body text-xs text-forest/50 uppercase tracking-wider">Total avis</p>
                <p className="font-display text-2xl text-forest">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl border border-forest/8 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                stats.pending > 0 ? 'bg-amber-100' : 'bg-sage/10'
              )}>
                <svg className={cn('w-5 h-5', stats.pending > 0 ? 'text-amber-600' : 'text-sage')} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-body text-xs text-forest/50 uppercase tracking-wider">En attente</p>
                <p className={cn('font-display text-2xl', stats.pending > 0 ? 'text-amber-600' : 'text-forest')}>
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="bg-white rounded-2xl border border-forest/8 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blush/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blush-deep" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="font-body text-xs text-forest/50 uppercase tracking-wider">Mis en avant</p>
                <p className="font-display text-2xl text-forest">{stats.featured}<span className="text-base text-forest/50">/3</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {stats && stats.approved > 0 && (
        <div className="bg-white rounded-2xl border border-forest/8 p-6 shadow-sm">
          <h3 className="font-display text-lg text-forest mb-4">Répartition des notes</h3>
          <div className="space-y-3">
            {[5, 4, 3].map((rating) => {
              const count = stats.ratingDistribution[rating as 5 | 4 | 3] || 0
              const percentage = stats.approved > 0 ? Math.round((count / stats.approved) * 100) : 0
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="font-body text-sm text-forest">{rating}</span>
                    <StarIcon filled className="w-4 h-4" />
                  </div>
                  <div className="flex-1 h-3 bg-forest/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-body text-sm text-forest/50 w-16 text-right">{count} ({percentage}%)</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-forest/10 pb-1">
        {[
          { key: 'all', label: 'Tous', count: stats?.total },
          { key: 'pending', label: 'En attente', count: stats?.pending },
          { key: 'approved', label: 'Approuvés', count: stats?.approved },
          { key: 'featured', label: 'Mis en avant', count: stats?.featured },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as FilterStatus)}
            className={cn(
              'px-4 py-2 font-body text-sm rounded-t-lg transition-all relative',
              filter === tab.key
                ? 'text-forest bg-white border-x border-t border-forest/10 -mb-px'
                : 'text-forest/50 hover:text-forest'
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={cn(
                'ml-2 px-1.5 py-0.5 text-[10px] rounded-full',
                filter === tab.key ? 'bg-forest/10 text-forest' : 'bg-forest/5 text-forest/50'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Reviews - Priority Section */}
          {filter === 'all' && pendingReviews.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="font-display text-lg text-forest">À modérer ({pendingReviews.length})</h2>
              </div>
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    variant="full"
                    onAction={handleAction}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Approved Reviews */}
          {filter === 'all' && approvedReviews.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-forest mb-4">Approuvés ({approvedReviews.length})</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    variant="compact"
                    onAction={handleAction}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Filtered view */}
          {filter !== 'all' && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <p className="font-body text-forest/50">Aucun avis dans cette catégorie</p>
                </div>
              ) : filter === 'pending' ? (
                reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    variant="full"
                    onAction={handleAction}
                  />
                ))
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      variant="compact"
                      onAction={handleAction}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state for all */}
          {filter === 'all' && reviews.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-3xl bg-forest/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-forest mb-2">Aucun avis pour le moment</h3>
              <p className="font-body text-sm text-forest/50 max-w-md mx-auto">
                Les avis apparaîtront ici lorsque les abonnés laisseront leur feedback pour débloquer le guide 2
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
