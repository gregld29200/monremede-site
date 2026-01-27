'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  review: {
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
  variant?: 'full' | 'compact'
  onAction?: (id: string, action: 'approve' | 'reject' | 'feature' | 'unfeature') => Promise<void>
}

const StarIcon = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg
    className={cn('w-5 h-5', filled ? 'text-gold fill-gold' : 'text-forest/20', className)}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return "il y a moins d'une heure"
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ReviewCard({ review, variant = 'full', onAction }: ReviewCardProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const handleAction = async (action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    if (!onAction) return
    setLoading(action)
    try {
      await onAction(review._id, action)
    } finally {
      setLoading(null)
    }
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        'group bg-white rounded-xl border border-forest/8 p-4 transition-all hover:shadow-md cursor-pointer',
        review.featured && 'ring-2 ring-gold/30 border-gold/20',
        expanded && 'ring-2 ring-forest/20'
      )}>
        <div className="flex items-start justify-between gap-3">
          <div
            className="min-w-0 flex-1"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= review.rating} className="w-4 h-4" />
                ))}
              </div>
              {review.featured && (
                <span className="px-1.5 py-0.5 text-[9px] font-accent uppercase tracking-wider bg-gold/15 text-gold rounded">
                  En avant
                </span>
              )}
            </div>
            <p className="font-display text-sm text-forest">{review.displayName}</p>
            <p className={cn(
              'font-body text-xs text-forest/50 mt-1 transition-all',
              expanded ? '' : 'line-clamp-2'
            )}>
              {review.comment}
            </p>
            {!expanded && review.comment.length > 100 && (
              <p className="font-body text-[10px] text-sage mt-1">Cliquer pour voir tout</p>
            )}
          </div>
          {onAction && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAction(review.featured ? 'unfeature' : 'feature')
              }}
              disabled={loading !== null}
              className={cn(
                'p-2 rounded-lg transition-colors flex-shrink-0',
                review.featured
                  ? 'bg-gold/10 text-gold hover:bg-gold/20'
                  : 'text-forest/30 hover:text-gold hover:bg-gold/10'
              )}
            >
              <svg className="w-4 h-4" fill={review.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white rounded-2xl border-l-4 border border-forest/8 shadow-sm transition-all',
      review.approved ? 'border-l-sage' : 'border-l-gold'
    )}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= review.rating} />
                ))}
              </div>
              {!review.approved && (
                <span className="px-2 py-0.5 text-[10px] font-accent uppercase tracking-wider bg-amber-100 text-amber-700 rounded-full">
                  En attente
                </span>
              )}
              {review.featured && (
                <span className="px-2 py-0.5 text-[10px] font-accent uppercase tracking-wider bg-gold/15 text-gold rounded-full">
                  Mis en avant
                </span>
              )}
            </div>
            <p className="font-display text-lg text-forest">{review.displayName}</p>
            <p className="font-body text-xs text-forest/50">{formatDate(review.submittedAt)}</p>
          </div>

          {/* Subscriber info */}
          {review.subscriber && (
            <Link
              href={`/gestion-mon-remede-oum/prospects/${review.subscriber._id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-forest/5 hover:bg-forest/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blush/20 flex items-center justify-center">
                <span className="font-display text-sm text-blush-deep">
                  {review.subscriber.firstName?.charAt(0) || '?'}
                </span>
              </div>
              <div className="text-left">
                <p className="font-body text-xs text-forest">{review.subscriber.email}</p>
                <p className="font-body text-[10px] text-forest/50">Voir le profil</p>
              </div>
            </Link>
          )}
        </div>

        {/* Comment */}
        <div className="bg-cream/50 rounded-xl p-4 mb-4">
          <p className="font-body text-sm text-ink leading-relaxed">{review.comment}</p>
        </div>

        {/* Actions */}
        {onAction && (
          <div className="flex items-center gap-2 pt-2 border-t border-forest/5">
            {!review.approved ? (
              <>
                <button
                  onClick={() => handleAction('approve')}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm transition-all',
                    'bg-forest text-cream hover:bg-forest-deep',
                    loading === 'approve' && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {loading === 'approve' ? (
                    <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Approuver
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm transition-all',
                    'bg-red-50 text-red-600 hover:bg-red-100',
                    loading === 'reject' && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {loading === 'reject' ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  Rejeter
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAction(review.featured ? 'unfeature' : 'feature')}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm transition-all',
                    review.featured
                      ? 'bg-gold/10 text-gold hover:bg-gold/20'
                      : 'bg-forest/5 text-forest/70 hover:bg-forest/10 hover:text-forest'
                  )}
                >
                  {loading === 'feature' || loading === 'unfeature' ? (
                    <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill={review.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                  {review.featured ? 'Retirer de la une' : 'Mettre en avant'}
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  disabled={loading !== null}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm text-forest/40 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  Dépublier
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
