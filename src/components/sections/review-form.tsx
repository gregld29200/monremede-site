'use client'

import { useState } from 'react'
import { Button, StarRating } from '@/components/ui'

interface ReviewFormProps {
  token: string
  firstName: string
  onSuccess: () => void
}

export function ReviewForm({ token, firstName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const commentLength = comment.trim().length
  const isValid = rating !== null && commentLength >= 10 && commentLength <= 1000

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/guide-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          rating,
          comment: comment.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Rating */}
      <div className="text-center">
        <label className="block text-lg font-medium text-forest mb-4">
          {firstName}, comment avez-vous trouvé le guide ?
        </label>
        <StarRating
          value={rating}
          onChange={setRating}
          disabled={isSubmitting}
        />
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="comment"
          className="block text-lg font-medium text-forest mb-2"
        >
          Partagez votre expérience
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          placeholder="Qu'avez-vous appris ? Comment ces conseils vous ont-ils aidé ?"
          rows={4}
          className="w-full px-4 py-3 border border-sage/30 rounded-lg bg-cream-warm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold disabled:opacity-50 resize-none"
        />
        <div className="flex justify-between mt-2 text-sm">
          <span className={commentLength < 10 ? 'text-red-500' : 'text-sage'}>
            {commentLength < 10
              ? `Encore ${10 - commentLength} caractère(s) minimum`
              : 'Merci pour votre retour !'}
          </span>
          <span className={commentLength > 1000 ? 'text-red-500' : 'text-sage'}>
            {commentLength}/1000
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit button */}
      <div className="text-center">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
              Envoi en cours...
            </>
          ) : (
            <>
              Soumettre mon avis
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
        <p className="mt-3 text-sm text-ink-soft">
          Votre avis nous aide à améliorer nos guides
        </p>
      </div>
    </form>
  )
}
