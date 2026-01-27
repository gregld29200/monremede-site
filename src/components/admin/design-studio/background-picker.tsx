'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BackgroundUploader } from './background-uploader'
import type { AspectRatio, Resolution } from '@/types/design-studio'

interface BackgroundPickerProps {
  onSelect: (imageUrl: string) => void
  selectedUrl: string | null
  aspectRatio: AspectRatio
  disabled?: boolean
}

interface AISuggestion {
  id: string
  prompt: string
  generating: boolean
  resultUrl?: string
  error?: string
}

export function BackgroundPicker({
  onSelect,
  selectedUrl,
  aspectRatio,
  disabled = false,
}: BackgroundPickerProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'upload'>('ai')
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const generateSuggestions = async () => {
    setLoadingSuggestions(true)
    setSuggestions([])

    try {
      // Generate abstract/botanical background prompts using Claude
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: null,
          articleType: 'quote-background',
          customPrompt: `Génère 3 descriptions d'arrière-plans abstraits et botaniques pour des cartes citations.

Style: Ambiance apaisante, éléments naturels flous, textures organiques.
Évite: Texte, visages, éléments distrayants.

Chaque prompt doit décrire une image abstraite ou semi-abstraite avec:
- Des couleurs de la palette: verts forêt, sauge, crème, or, rose poudré
- Une atmosphère paisible et naturelle
- Des éléments flous/soft focus pour que le texte soit lisible par-dessus

Réponds UNIQUEMENT au format JSON suivant:
{
  "prompts": [
    { "text": "description en français...", "suggestedRatio": "${aspectRatio}" }
  ]
}`
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      const newSuggestions: AISuggestion[] = (data.prompts || []).slice(0, 3).map(
        (p: { text: string }, index: number) => ({
          id: `bg-${index + 1}`,
          prompt: p.text,
          generating: false,
        })
      )
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error generating background suggestions:', error)
      // Set default suggestions if API fails
      setSuggestions([
        {
          id: 'bg-1',
          prompt: 'Arrière-plan abstrait aux tons vert forêt et sauge, avec des formes organiques douces et floues, ambiance paisible et naturelle, lumière douce diffuse',
          generating: false,
        },
        {
          id: 'bg-2',
          prompt: 'Texture botanique subtile avec feuilles floues en arrière-plan, palette crème et vert sauge, effet soft focus, atmosphère apaisante',
          generating: false,
        },
        {
          id: 'bg-3',
          prompt: 'Gradient abstrait aux couleurs naturelles, du vert forêt profond vers le crème doré, textures organiques légères, ambiance zen',
          generating: false,
        },
      ])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const generateBackground = async (suggestion: AISuggestion) => {
    if (suggestion.generating || suggestion.resultUrl) return

    setGeneratingId(suggestion.id)
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestion.id ? { ...s, generating: true, error: undefined } : s
      )
    )

    try {
      // Start generation
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: suggestion.prompt,
          aspectRatio,
          resolution: '2K' as Resolution,
          purpose: 'social',
        }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const { taskId } = await response.json()

      // Poll for completion
      let attempts = 0
      const maxAttempts = 60 // 2 minutes max

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const statusRes = await fetch(
          `/api/gestion-mon-remede-oum/design-studio/status/${taskId}`
        )
        const statusData = await statusRes.json()

        if (statusData.status === 'success' && statusData.resultUrl) {
          setSuggestions((prev) =>
            prev.map((s) =>
              s.id === suggestion.id
                ? { ...s, generating: false, resultUrl: statusData.resultUrl }
                : s
            )
          )
          onSelect(statusData.resultUrl)
          break
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Generation failed')
        }

        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error('Generation timed out')
      }
    } catch (error) {
      console.error('Error generating background:', error)
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestion.id
            ? { ...s, generating: false, error: 'Erreur lors de la génération' }
            : s
        )
      )
    } finally {
      setGeneratingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage/30 to-sage/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-base text-forest font-medium tracking-tight">
            Arrière-plan
          </h3>
          <p className="font-body text-xs text-ink-soft/60">
            Générez avec l&apos;IA ou importez une image
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-forest/5 rounded-xl">
        <button
          onClick={() => setActiveTab('ai')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-body text-sm transition-all duration-300',
            activeTab === 'ai'
              ? 'bg-white text-forest shadow-sm'
              : 'text-forest/60 hover:text-forest'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          Fond IA
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-body text-sm transition-all duration-300',
            activeTab === 'upload'
              ? 'bg-white text-forest shadow-sm'
              : 'text-forest/60 hover:text-forest'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Importer
        </button>
      </div>

      {/* AI Tab Content */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <button
              onClick={generateSuggestions}
              disabled={loadingSuggestions || disabled}
              className={cn(
                'w-full p-8 rounded-2xl border-2 border-dashed border-forest/15 bg-gradient-to-br from-cream-warm/50 to-cream',
                'hover:border-forest/25 hover:bg-cream-warm transition-all duration-300',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loadingSuggestions ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
                  <span className="font-body text-sm text-forest">Génération des idées...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-base text-forest mb-1">
                      Générer des fonds IA
                    </p>
                    <p className="font-body text-xs text-ink-soft/60">
                      3 suggestions adaptées à votre carte citation
                    </p>
                  </div>
                </div>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    if (suggestion.resultUrl) {
                      onSelect(suggestion.resultUrl)
                    } else {
                      generateBackground(suggestion)
                    }
                  }}
                  disabled={suggestion.generating || disabled || (generatingId !== null && generatingId !== suggestion.id)}
                  className={cn(
                    'w-full p-4 rounded-2xl border-2 text-left transition-all duration-300',
                    suggestion.resultUrl && selectedUrl === suggestion.resultUrl
                      ? 'border-gold/50 bg-gradient-to-br from-gold/15 to-gold/5'
                      : 'border-forest/10 bg-gradient-to-br from-cream-warm to-cream hover:border-forest/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <div className="flex gap-4">
                    {/* Preview or placeholder */}
                    <div className="w-20 h-20 rounded-xl bg-forest/10 flex-shrink-0 overflow-hidden relative">
                      {suggestion.resultUrl ? (
                        <Image
                          src={suggestion.resultUrl}
                          alt="Fond généré"
                          fill
                          className="object-cover"
                        />
                      ) : suggestion.generating ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-forest/5">
                          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-8 h-8 text-forest/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-ink leading-relaxed line-clamp-3">
                        {suggestion.prompt}
                      </p>
                      {suggestion.error && (
                        <p className="mt-2 font-body text-xs text-blush-deep">
                          {suggestion.error}
                        </p>
                      )}
                      {!suggestion.resultUrl && !suggestion.generating && (
                        <p className="mt-2 font-accent text-xs text-gold uppercase tracking-wider">
                          Cliquez pour générer
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {/* Regenerate button */}
              <button
                onClick={generateSuggestions}
                disabled={loadingSuggestions || disabled || generatingId !== null}
                className="w-full px-4 py-2.5 text-center font-body text-sm text-forest/60 hover:text-forest transition-colors"
              >
                Générer de nouvelles idées
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Tab Content */}
      {activeTab === 'upload' && (
        <BackgroundUploader
          imageUrl={selectedUrl}
          onUpload={onSelect}
          onRemove={() => onSelect('')}
          disabled={disabled}
        />
      )}
    </div>
  )
}
