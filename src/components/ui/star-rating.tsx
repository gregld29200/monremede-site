'use client'

import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number | null
  onChange: (rating: number) => void
  disabled?: boolean
}

const ratingLabels: Record<number, string> = {
  3: 'Bien',
  4: 'Très bien',
  5: 'Excellent',
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {[3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => !disabled && onChange(rating)}
            disabled={disabled}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
              value === rating
                ? 'border-gold bg-gold/10'
                : 'border-cream-warm bg-cream-warm hover:border-sage/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex">
              {Array.from({ length: rating }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'text-2xl transition-transform',
                    value === rating && 'scale-110'
                  )}
                >
                  {value === rating ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                value === rating ? 'text-forest' : 'text-ink-soft'
              )}
            >
              {ratingLabels[rating]}
            </span>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-sm text-sage">
          Vous avez sélectionné {value} étoiles - {ratingLabels[value]}
        </p>
      )}
    </div>
  )
}
