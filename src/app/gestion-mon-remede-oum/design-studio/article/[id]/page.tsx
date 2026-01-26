'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  PromptSuggestions,
  PromptEditor,
  AspectRatioPicker,
  GenerationStatus,
  ResultGallery,
} from '@/components/admin/design-studio'
import type { AspectRatio, Resolution, PromptSuggestion } from '@/types/design-studio'

const ADMIN_PATH = '/gestion-mon-remede-oum'

interface Article {
  _id: string
  title: string
  slug: string
  excerpt?: string
  mainImage?: {
    asset?: { _ref: string }
  }
}

// Get image URL from Sanity asset ref
function getImageUrl(ref?: string): string | null {
  if (!ref) return null
  const match = ref.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/)
  if (match) {
    const [, id, dimensions, format] = match
    return `https://cdn.sanity.io/images/4otm8dqd/production/${id}-${dimensions}.${format}`
  }
  return null
}

export default function ArticleImageGeneratorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const articleType = (searchParams.get('type') || 'post') as 'post' | 'recipe'

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  // Generation state
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [resolution, setResolution] = useState<Resolution>('2K')
  const [generating, setGenerating] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const endpoint = articleType === 'post'
          ? `/api/gestion-mon-remede-oum/blog/${id}`
          : `/api/gestion-mon-remede-oum/recettes/${id}`

        const response = await fetch(endpoint)
        if (!response.ok) throw new Error('Article not found')

        const data = await response.json()
        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id, articleType])

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    setPrompt(suggestion.text)
    setAspectRatio(suggestion.suggestedRatio)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Veuillez entrer un prompt')
      return
    }

    setGenerating(true)
    setError(null)
    setResultUrl(null)

    try {
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          resolution,
          articleId: id,
          purpose: 'mainImage',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Generation failed')
      }

      const data = await response.json()
      setTaskId(data.taskId)
      setDocumentId(data.documentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération')
      setGenerating(false)
    }
  }

  const handleGenerationComplete = (url: string) => {
    setResultUrl(url)
    setGenerating(false)
  }

  const handleGenerationError = (errorMsg: string) => {
    setError(errorMsg)
    setGenerating(false)
  }

  const handleSetAsMain = async () => {
    if (!documentId) return

    const response = await fetch('/api/gestion-mon-remede-oum/design-studio/upload-to-sanity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generatedImageId: documentId,
        targetDocumentId: id,
        targetField: 'mainImage',
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Upload failed')
    }

    // Refresh article to show new image
    const articleRes = await fetch(
      articleType === 'post'
        ? `/api/gestion-mon-remede-oum/blog/${id}`
        : `/api/gestion-mon-remede-oum/recettes/${id}`
    )
    const articleData = await articleRes.json()
    setArticle(articleData)
  }

  const handleAddToGallery = async () => {
    if (!documentId) return

    const response = await fetch('/api/gestion-mon-remede-oum/design-studio/upload-to-sanity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generatedImageId: documentId,
        targetDocumentId: id,
        targetField: 'gallery',
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Upload failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-24">
        <h2 className="font-display text-xl text-forest mb-2">Article non trouvé</h2>
        <Link
          href={`${ADMIN_PATH}/design-studio/article`}
          className="font-body text-sm text-gold hover:underline"
        >
          Retour à la liste
        </Link>
      </div>
    )
  }

  const currentImageUrl = getImageUrl(article.mainImage?.asset?._ref)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN_PATH}/design-studio/article`}
          className="p-2 text-forest/50 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="font-display text-2xl text-forest">Générer une image</h2>
          <p className="font-body text-sm text-ink-soft/70 mt-1">
            Pour : {article.title}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left panel - Article preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
            <div className="p-6 border-b border-forest/5">
              <h3 className="font-accent text-sm text-forest uppercase tracking-wider">
                Aperçu de l&apos;article
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Current image */}
              <div className="space-y-2">
                <p className="font-body text-xs text-ink-soft/60 uppercase tracking-wider">
                  Image actuelle
                </p>
                <div className="aspect-video rounded-xl bg-forest/5 overflow-hidden relative">
                  {currentImageUrl ? (
                    <Image
                      src={currentImageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-forest/20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-body text-sm text-ink-soft/50">
                          Aucune image
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <p className="font-body text-xs text-ink-soft/60 uppercase tracking-wider mb-1">
                  Titre
                </p>
                <h4 className="font-display text-lg text-forest">
                  {article.title}
                </h4>
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <div>
                  <p className="font-body text-xs text-ink-soft/60 uppercase tracking-wider mb-1">
                    Extrait
                  </p>
                  <p className="font-body text-sm text-ink-soft/80 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right panel - Generation workflow */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          <div className="bg-white rounded-2xl border border-forest/5 p-6">
            <PromptSuggestions
              articleId={id}
              articleType={articleType}
              onSelect={handleSuggestionSelect}
            />
          </div>

          {/* Prompt editor */}
          <div className="bg-white rounded-2xl border border-forest/5 p-6">
            <PromptEditor
              value={prompt}
              onChange={setPrompt}
              disabled={generating}
            />
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border border-forest/5 p-6">
            <AspectRatioPicker
              aspectRatio={aspectRatio}
              resolution={resolution}
              onAspectRatioChange={setAspectRatio}
              onResolutionChange={setResolution}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-blush-deep/10 border border-blush-deep/20 rounded-xl">
              <p className="font-body text-sm text-blush-deep">{error}</p>
            </div>
          )}

          {/* Generate button */}
          {!generating && !resultUrl && (
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className={cn(
                'w-full px-6 py-4 rounded-xl font-body text-base transition-all',
                'bg-gold text-white hover:bg-gold/90',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-3'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Générer l&apos;image
            </button>
          )}

          {/* Generation status */}
          {(generating || taskId) && !resultUrl && (
            <GenerationStatus
              taskId={taskId}
              documentId={documentId}
              onComplete={handleGenerationComplete}
              onError={handleGenerationError}
            />
          )}

          {/* Result gallery */}
          {resultUrl && (
            <div className="bg-white rounded-2xl border border-forest/5 p-6">
              <ResultGallery
                resultUrl={resultUrl}
                documentId={documentId}
                targetDocumentId={id}
                onSetAsMain={handleSetAsMain}
                onAddToGallery={handleAddToGallery}
              />
            </div>
          )}

          {/* Generate another */}
          {resultUrl && (
            <button
              onClick={() => {
                setResultUrl(null)
                setTaskId(null)
                setDocumentId(null)
              }}
              className={cn(
                'w-full px-6 py-3 rounded-xl font-body text-sm transition-all',
                'border border-forest/20 text-forest hover:bg-cream-warm',
                'flex items-center justify-center gap-2'
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Générer une autre image
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
