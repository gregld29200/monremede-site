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
  BackgroundUploader,
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
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null)
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
          referenceImageUrl: referenceImageUrl || undefined,
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-gold/20 border-t-gold rounded-full animate-spin" />
          <p className="font-body text-sm text-ink-soft/60">Chargement de l&apos;article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-3xl bg-blush/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="font-display text-xl text-forest mb-2">Article non trouvé</h2>
        <p className="font-body text-sm text-ink-soft/60 mb-4">
          L&apos;article demandé n&apos;existe pas ou a été supprimé
        </p>
        <Link
          href={`${ADMIN_PATH}/design-studio/article`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest text-cream rounded-full font-body text-sm hover:bg-forest-deep transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour à la liste
        </Link>
      </div>
    )
  }

  const currentImageUrl = getImageUrl(article.mainImage?.asset?._ref)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN_PATH}/design-studio/article`}
          className="group p-2.5 text-forest/50 hover:text-forest bg-white hover:bg-cream-warm rounded-xl border border-forest/5 hover:border-forest/10 transition-all"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-display text-2xl text-forest">Générer une image</h2>
            <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-accent uppercase tracking-wider rounded-full border border-gold/20">
              Nano Banana Pro
            </span>
          </div>
          <p className="font-body text-sm text-ink-soft/60 truncate max-w-lg">
            Pour : <span className="text-forest">{article.title}</span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left panel - Article preview (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="sticky top-6 bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 overflow-hidden">
            <div className="p-5 border-b border-forest/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest/20 to-forest/5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-base text-forest font-medium">
                  Aperçu de l&apos;article
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Current image */}
              <div className="space-y-2">
                <p className="font-accent text-xs text-forest/50 uppercase tracking-wider">
                  Image actuelle
                </p>
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-forest/5 to-forest/10 overflow-hidden relative border border-forest/5">
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
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blush/30 to-blush/10 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-7 h-7 text-blush-deep/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        </div>
                        <p className="font-body text-sm text-ink-soft/40">
                          Aucune image
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <p className="font-accent text-xs text-forest/50 uppercase tracking-wider mb-1.5">
                  Titre
                </p>
                <h4 className="font-display text-lg text-forest leading-tight">
                  {article.title}
                </h4>
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <div>
                  <p className="font-accent text-xs text-forest/50 uppercase tracking-wider mb-1.5">
                    Extrait
                  </p>
                  <p className="font-body text-sm text-ink-soft/70 line-clamp-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right panel - Generation workflow (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Suggestions */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <PromptSuggestions
              articleId={id}
              articleType={articleType}
              onSelect={handleSuggestionSelect}
            />
          </div>

          {/* Prompt editor */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <PromptEditor
              value={prompt}
              onChange={setPrompt}
              disabled={generating}
            />
          </div>

          {/* Settings */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <AspectRatioPicker
              aspectRatio={aspectRatio}
              resolution={resolution}
              onAspectRatioChange={setAspectRatio}
              onResolutionChange={setResolution}
            />
          </div>

          {/* Background image (optional) */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <BackgroundUploader
              imageUrl={referenceImageUrl}
              onUpload={setReferenceImageUrl}
              onRemove={() => setReferenceImageUrl(null)}
              disabled={generating}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-5 bg-gradient-to-r from-blush/30 to-blush/10 border border-blush-deep/20 rounded-2xl">
              <p className="font-body text-sm text-blush-deep flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blush-deep/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                {error}
              </p>
            </div>
          )}

          {/* Generate button */}
          {!generating && !resultUrl && (
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className={cn(
                'group relative w-full px-6 py-4 rounded-2xl font-body text-base transition-all duration-300 overflow-hidden',
                'bg-gradient-to-r from-gold to-gold/90 text-white',
                'hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
                'flex items-center justify-center gap-3'
              )}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
              <span className="relative">Générer l&apos;image</span>
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
            <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
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
                'group w-full px-6 py-3.5 rounded-2xl font-body text-sm transition-all duration-300',
                'bg-gradient-to-br from-cream-warm to-cream border border-forest/15 text-forest',
                'hover:border-forest/25 hover:shadow-md hover:shadow-forest/5',
                'flex items-center justify-center gap-2.5'
              )}
            >
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Générer une autre image
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
