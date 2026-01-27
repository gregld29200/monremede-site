'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PromptSuggestion } from '@/types/design-studio'

interface PromptSuggestionsProps {
  articleId: string
  articleType?: 'post' | 'recipe'
  onSelect: (suggestion: PromptSuggestion) => void
}

// Shimmer loading skeleton for premium feel
function ShimmerCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cream-warm to-cream p-5 border border-forest/5">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="space-y-3">
        <div className="h-4 bg-forest/5 rounded-full w-3/4" />
        <div className="h-4 bg-forest/5 rounded-full w-full" />
        <div className="h-4 bg-forest/5 rounded-full w-2/3" />
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-16 bg-sage/10 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Decorative leaf icon
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21c-4.97-4.97-7-9.03-7-12 0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.97-2.03 7.03-7 12z" />
      <path d="M12 21V9" />
      <path d="M9 12l3-3 3 3" />
    </svg>
  )
}

export function PromptSuggestions({ articleId, articleType = 'post', onSelect }: PromptSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<PromptSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const generateSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, articleType }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      setSuggestions(data.prompts)
    } catch (err) {
      setError('Erreur lors de la génération des suggestions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (suggestion: PromptSuggestion) => {
    setSelectedId(suggestion.id)
    onSelect(suggestion)
  }

  return (
    <div className="space-y-5">
      {/* Header with botanical accent */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage/30 to-sage/10 flex items-center justify-center">
            <LeafIcon className="w-4 h-4 text-forest" />
          </div>
          <div>
            <h3 className="font-display text-base text-forest font-medium tracking-tight">
              Inspirations IA
            </h3>
            <p className="font-body text-xs text-ink-soft/60">
              Prompts générés par Claude
            </p>
          </div>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          className={cn(
            'group relative px-5 py-2.5 rounded-full font-body text-sm transition-all duration-300',
            'bg-gradient-to-r from-forest to-forest-deep text-cream',
            'hover:shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
            'flex items-center gap-2.5 overflow-hidden'
          )}
        >
          {/* Subtle shine effect on hover */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              <span className="relative">Réflexion...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
              <span className="relative">Générer des idées</span>
            </>
          )}
        </button>
      </div>

      {/* Error state with soft styling */}
      {error && (
        <div className="p-4 bg-blush/30 border border-blush-deep/20 rounded-2xl">
          <p className="font-body text-sm text-blush-deep flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Loading state with shimmer skeletons */}
      {loading && (
        <div className="space-y-3">
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </div>
      )}

      {/* Suggestions list with staggered animation */}
      {!loading && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              style={{ animationDelay: `${index * 100}ms` }}
              className={cn(
                'w-full p-5 rounded-2xl text-left transition-all duration-300',
                'animate-[fadeSlideUp_0.4s_ease-out_forwards] opacity-0',
                'group relative overflow-hidden',
                selectedId === suggestion.id
                  ? 'bg-gradient-to-br from-gold/15 to-gold/5 border-2 border-gold/40 shadow-lg shadow-gold/10'
                  : 'bg-gradient-to-br from-cream-warm to-cream border border-forest/8 hover:border-forest/15 hover:shadow-md hover:shadow-forest/5'
              )}
            >
              {/* Selection indicator dot */}
              <div className={cn(
                'absolute top-4 right-4 w-3 h-3 rounded-full transition-all duration-300',
                selectedId === suggestion.id
                  ? 'bg-gold scale-100'
                  : 'bg-forest/10 scale-75 group-hover:scale-100 group-hover:bg-forest/20'
              )} />

              <p className="font-body text-sm text-ink leading-relaxed pr-6">
                {suggestion.text}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-accent tracking-wide transition-colors duration-300',
                  selectedId === suggestion.id
                    ? 'bg-gold/20 text-gold-light'
                    : 'bg-forest/8 text-forest group-hover:bg-forest/12'
                )}>
                  {suggestion.suggestedRatio}
                </span>
                <span className="text-xs text-ink-soft/50 font-body">
                  Format recommandé
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty state with elegant illustration */}
      {suggestions.length === 0 && !loading && (
        <div className="relative text-center py-12 px-6 bg-gradient-to-br from-cream-warm/80 to-cream rounded-2xl border border-dashed border-forest/10 overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-sage/5 blur-2xl" />
          <div className="absolute bottom-4 left-8 w-32 h-32 rounded-full bg-gold/5 blur-2xl" />

          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-sage/20 to-sage/5 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-sage"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>
            </div>
            <h4 className="font-display text-base text-forest mb-2">
              Prêt pour l&apos;inspiration
            </h4>
            <p className="font-body text-sm text-ink-soft/70 max-w-xs mx-auto">
              Cliquez sur le bouton ci-dessus pour générer des suggestions de prompts basées sur votre article
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
