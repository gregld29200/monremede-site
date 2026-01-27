'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  PromptEditor,
  PromptSuggestions,
  GenerationStatus,
  ResultGallery,
} from '@/components/admin/design-studio'
import { SOCIAL_TEMPLATES, BRAND_KIT, type SocialTemplate, type GeneratedImage } from '@/types/design-studio'

const ADMIN_PATH = '/gestion-mon-remede-oum'

function SocialPageContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  // Find the template
  const template = SOCIAL_TEMPLATES.find(t => t.id === templateId) || SOCIAL_TEMPLATES[0]

  // State
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${prompt}\n\n${BRAND_KIT.promptSuffix}`,
          aspectRatio: template.aspectRatio,
          resolution: template.resolution,
          purpose: 'social',
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération')
      }

      const data = await response.json()
      setTaskId(data.taskId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération')
      setIsGenerating(false)
    }
  }

  const handleGenerationComplete = (image: GeneratedImage) => {
    setGeneratedImages(prev => [image, ...prev])
    setIsGenerating(false)
    setTaskId(null)
  }

  const handleGenerationError = (errorMsg: string) => {
    setError(errorMsg)
    setIsGenerating(false)
    setTaskId(null)
  }

  const handleSuggestionSelect = (text: string) => {
    setPrompt(text)
  }

  const handleDownload = async (image: GeneratedImage) => {
    if (!image.resultUrl) return

    const response = await fetch(image.resultUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.id}-monremede-${Date.now()}.png`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN_PATH}/design-studio`}
          className="group p-2.5 text-forest/50 hover:text-forest bg-white hover:bg-cream-warm rounded-xl border border-forest/5 hover:border-forest/10 transition-all"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{template.icon}</span>
            <h1 className="font-display text-2xl text-forest">{template.name}</h1>
            <span className="px-2 py-1 bg-gold/10 text-gold text-xs font-accent rounded">
              {template.aspectRatio}
            </span>
          </div>
          <p className="font-body text-sm text-ink-soft/60 mt-1">{template.description}</p>
        </div>
      </div>

      {/* Template Selector */}
      <div className="bg-white rounded-2xl border border-forest/8 p-4">
        <p className="font-body text-xs text-forest/50 mb-3">Changer de format :</p>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_TEMPLATES.map((t) => (
            <Link
              key={t.id}
              href={`${ADMIN_PATH}/design-studio/social?template=${t.id}`}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                t.id === template.id
                  ? 'bg-forest text-cream'
                  : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
              )}
            >
              <span>{t.icon}</span>
              <span className="font-body">{t.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Prompt & Generation */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="bg-white rounded-2xl border border-forest/8 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Décrivez votre image</h2>
            <PromptEditor
              value={prompt}
              onChange={setPrompt}
              placeholder={`Ex: Une table de petit-déjeuner sain avec des fruits frais, du miel et des herbes...`}
              disabled={isGenerating}
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body text-sm transition-all',
                  !prompt.trim() || isGenerating
                    ? 'bg-forest/10 text-forest/40 cursor-not-allowed'
                    : 'bg-forest text-cream hover:bg-forest-deep'
                )}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Générer (~$0.04)
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-blush/20 border border-blush-deep/20 rounded-lg">
                <p className="font-body text-sm text-blush-deep">{error}</p>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl border border-forest/8 p-6">
            <h3 className="font-display text-lg text-forest mb-4">Suggestions</h3>
            <PromptSuggestions
              context={`Image ${template.name} pour Mon Remède, naturopathie et bien-être`}
              onSelect={handleSuggestionSelect}
              selectedRatio={template.aspectRatio}
            />
          </div>

          {/* Generation Status */}
          {taskId && (
            <GenerationStatus
              taskId={taskId}
              onComplete={handleGenerationComplete}
              onError={handleGenerationError}
            />
          )}
        </div>

        {/* Right: Preview & Results */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-2xl border border-forest/8 p-6">
            <h3 className="font-display text-lg text-forest mb-4">Aperçu du format</h3>
            <div className="flex justify-center">
              <div
                className={cn(
                  'bg-forest/5 rounded-xl border border-dashed border-forest/20 flex items-center justify-center',
                  template.aspectRatio === '1:1' && 'w-48 h-48',
                  template.aspectRatio === '9:16' && 'w-32 h-56',
                  template.aspectRatio === '16:9' && 'w-64 h-36',
                  template.aspectRatio === '4:5' && 'w-40 h-50',
                  template.aspectRatio === '2:3' && 'w-36 h-54',
                  template.aspectRatio === '3:2' && 'w-54 h-36'
                )}
                style={{
                  aspectRatio: template.aspectRatio.replace(':', '/'),
                  maxWidth: '100%',
                  width: template.aspectRatio === '9:16' || template.aspectRatio === '2:3' ? '160px' : '256px',
                }}
              >
                <div className="text-center p-4">
                  <span className="text-3xl">{template.icon}</span>
                  <p className="font-body text-xs text-forest/50 mt-2">{template.aspectRatio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="bg-white rounded-2xl border border-forest/8 p-6">
              <h3 className="font-display text-lg text-forest mb-4">Images générées</h3>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((img) => (
                  <div key={img._id} className="relative group">
                    <div
                      className="relative rounded-xl overflow-hidden border border-forest/10"
                      style={{ aspectRatio: template.aspectRatio.replace(':', '/') }}
                    >
                      {img.resultUrl && (
                        <Image
                          src={img.resultUrl}
                          alt={img.prompt.slice(0, 50)}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => handleDownload(img)}
                        className="px-4 py-2 bg-white text-forest rounded-lg font-body text-sm hover:bg-cream transition-colors"
                      >
                        Télécharger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SocialPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <SocialPageContent />
    </Suspense>
  )
}
