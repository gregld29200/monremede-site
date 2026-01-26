'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PromptSuggestion } from '@/types/design-studio'

interface PromptSuggestionsProps {
  articleId: string
  articleType?: 'post' | 'recipe'
  onSelect: (suggestion: PromptSuggestion) => void
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-accent text-sm text-forest uppercase tracking-wider">
          Suggestions IA
        </h3>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          className={cn(
            'px-4 py-2 rounded-lg font-body text-sm transition-all',
            'bg-forest text-cream hover:bg-forest-deep',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center gap-2'
          )}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              <span>Génération...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Générer des idées</span>
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-blush-deep/20 border border-blush-deep/30 rounded-lg">
          <p className="font-body text-sm text-blush-deep">{error}</p>
        </div>
      )}

      {/* Suggestions list */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className={cn(
                'w-full p-4 rounded-xl border text-left transition-all',
                selectedId === suggestion.id
                  ? 'bg-gold/10 border-gold/30 ring-2 ring-gold/20'
                  : 'bg-cream hover:bg-cream-warm border-forest/10 hover:border-forest/20'
              )}
            >
              <p className="font-body text-sm text-ink leading-relaxed">
                {suggestion.text}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 bg-forest/10 rounded text-xs font-accent text-forest">
                  {suggestion.suggestedRatio}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {suggestions.length === 0 && !loading && (
        <div className="text-center py-8 bg-cream-warm/50 rounded-xl border border-dashed border-forest/10">
          <svg
            className="w-10 h-10 mx-auto text-sage/50 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p className="font-body text-sm text-ink-soft/70">
            Cliquez sur &quot;Générer des idées&quot; pour obtenir des suggestions
          </p>
        </div>
      )}
    </div>
  )
}
