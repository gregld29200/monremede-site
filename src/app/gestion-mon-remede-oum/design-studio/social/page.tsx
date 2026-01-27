'use client'

import { useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  PromptEditor,
  GenerationStatus,
} from '@/components/admin/design-studio'
import { SOCIAL_TEMPLATES, BRAND_KIT } from '@/types/design-studio'

const ADMIN_PATH = '/gestion-mon-remede-oum'

type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none'

function SocialPageContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Find the template
  const template = SOCIAL_TEMPLATES.find(t => t.id === templateId) || SOCIAL_TEMPLATES[0]

  // State
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // New features state
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('bottom-right')
  const [logoSize, setLogoSize] = useState(60) // Logo size in pixels

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackgroundFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearBackground = () => {
    setBackgroundImage(null)
    setBackgroundFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadBackgroundToSanity = async (): Promise<string | null> => {
    if (!backgroundFile) return null

    const formData = new FormData()
    formData.append('file', backgroundFile)

    try {
      const response = await fetch('/api/gestion-mon-remede-oum/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      return data.url
    } catch (err) {
      console.error('Background upload error:', err)
      return null
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      // Upload background if provided
      let referenceImageUrl: string | undefined
      if (backgroundFile) {
        const uploadedUrl = await uploadBackgroundToSanity()
        if (uploadedUrl) {
          referenceImageUrl = uploadedUrl
        }
      }

      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${prompt}\n\n${BRAND_KIT.promptSuffix}`,
          aspectRatio: template.aspectRatio,
          resolution: template.resolution,
          purpose: 'social',
          referenceImageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la génération')
      }

      const data = await response.json()
      setTaskId(data.taskId)
      setDocumentId(data.documentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération')
      setIsGenerating(false)
    }
  }

  const handleGenerationComplete = (resultUrl: string) => {
    setGeneratedImages(prev => [resultUrl, ...prev])
    setIsGenerating(false)
    setTaskId(null)
    setDocumentId(null)
  }

  const handleGenerationError = (errorMsg: string) => {
    setError(errorMsg)
    setIsGenerating(false)
    setTaskId(null)
  }

  const addLogoToImage = async (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }

      const img = new window.Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Draw the main image
        ctx.drawImage(img, 0, 0)

        // If logo position is 'none', just return the image
        if (logoPosition === 'none') {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to create blob'))
          }, 'image/png')
          return
        }

        // Load and draw the logo
        const logo = new window.Image()
        logo.crossOrigin = 'anonymous'

        logo.onload = () => {
          const padding = 20
          const logoWidth = logoSize
          const logoHeight = (logo.height / logo.width) * logoWidth

          let x = padding
          let y = padding

          switch (logoPosition) {
            case 'top-left':
              x = padding
              y = padding
              break
            case 'top-right':
              x = canvas.width - logoWidth - padding
              y = padding
              break
            case 'bottom-left':
              x = padding
              y = canvas.height - logoHeight - padding
              break
            case 'bottom-right':
              x = canvas.width - logoWidth - padding
              y = canvas.height - logoHeight - padding
              break
          }

          ctx.drawImage(logo, x, y, logoWidth, logoHeight)

          canvas.toBlob((blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to create blob'))
          }, 'image/png')
        }

        logo.onerror = () => {
          // If logo fails to load, return image without logo
          canvas.toBlob((blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to create blob'))
          }, 'image/png')
        }

        logo.src = '/logo.png'
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageUrl
    })
  }

  const handleDownload = async (imageUrl: string) => {
    if (!imageUrl) return

    try {
      const blob = await addLogoToImage(imageUrl)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${template.id}-monremede-${Date.now()}.png`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      // Fallback: download without logo
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${template.id}-monremede-${Date.now()}.png`
      link.click()
      URL.revokeObjectURL(url)
    }
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
              disabled={isGenerating}
            />

            {/* Background Upload */}
            <div className="mt-6 pt-6 border-t border-forest/10">
              <h3 className="font-body text-sm font-medium text-forest mb-3">
                🖼️ Image de référence (optionnel)
              </h3>
              <p className="font-body text-xs text-forest/50 mb-3">
                L&apos;IA s&apos;inspirera de cette image pour générer le résultat
              </p>

              {backgroundImage ? (
                <div className="relative inline-block">
                  <img
                    src={backgroundImage}
                    alt="Background preview"
                    className="w-32 h-32 object-cover rounded-lg border border-forest/20"
                  />
                  <button
                    onClick={clearBackground}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blush-deep text-white rounded-full flex items-center justify-center text-xs hover:bg-blush-deep/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-forest/20 rounded-lg cursor-pointer hover:border-forest/40 hover:bg-forest/5 transition-all">
                  <svg className="w-8 h-8 text-forest/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <span className="font-body text-sm text-forest/50">Cliquer pour importer</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Logo Options */}
            <div className="mt-6 pt-6 border-t border-forest/10">
              <h3 className="font-body text-sm font-medium text-forest mb-3">
                🏷️ Logo Mon Remède
              </h3>

              <div className="space-y-4">
                {/* Position selector */}
                <div>
                  <p className="font-body text-xs text-forest/50 mb-2">Position :</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'top-left', label: '↖ Haut gauche' },
                      { value: 'top-right', label: '↗ Haut droit' },
                      { value: 'bottom-left', label: '↙ Bas gauche' },
                      { value: 'bottom-right', label: '↘ Bas droit' },
                      { value: 'none', label: '✕ Sans logo' },
                    ].map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => setLogoPosition(pos.value as LogoPosition)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-body transition-all',
                          logoPosition === pos.value
                            ? 'bg-forest text-cream'
                            : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                        )}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size slider */}
                {logoPosition !== 'none' && (
                  <div>
                    <p className="font-body text-xs text-forest/50 mb-2">Taille : {logoSize}px</p>
                    <input
                      type="range"
                      min="30"
                      max="150"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full h-2 bg-forest/10 rounded-lg appearance-none cursor-pointer accent-forest"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
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

          {/* Generation Status */}
          {taskId && (
            <GenerationStatus
              taskId={taskId}
              documentId={documentId}
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
                className="relative bg-forest/5 rounded-xl border border-dashed border-forest/20 flex items-center justify-center overflow-hidden"
                style={{
                  aspectRatio: template.aspectRatio.replace(':', '/'),
                  maxWidth: '100%',
                  width: template.aspectRatio === '9:16' || template.aspectRatio === '2:3' ? '160px' : '256px',
                }}
              >
                {backgroundImage ? (
                  <img
                    src={backgroundImage}
                    alt="Background preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-3xl">{template.icon}</span>
                    <p className="font-body text-xs text-forest/50 mt-2">{template.aspectRatio}</p>
                  </div>
                )}

                {/* Logo preview */}
                {logoPosition !== 'none' && (
                  <div
                    className={cn(
                      'absolute p-2',
                      logoPosition === 'top-left' && 'top-0 left-0',
                      logoPosition === 'top-right' && 'top-0 right-0',
                      logoPosition === 'bottom-left' && 'bottom-0 left-0',
                      logoPosition === 'bottom-right' && 'bottom-0 right-0'
                    )}
                  >
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={logoSize / 4}
                      height={logoSize / 4}
                      className="opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="bg-white rounded-2xl border border-forest/8 p-6">
              <h3 className="font-display text-lg text-forest mb-4">Images générées</h3>
              <p className="font-body text-xs text-forest/50 mb-4">
                Le logo sera ajouté au téléchargement ({logoPosition === 'none' ? 'sans logo' : logoPosition})
              </p>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative group">
                    <div
                      className="relative rounded-xl overflow-hidden border border-forest/10"
                      style={{ aspectRatio: template.aspectRatio.replace(':', '/') }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Generated image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownload(imageUrl)}
                        className="px-4 py-2 bg-white text-forest rounded-lg font-body text-sm hover:bg-cream transition-colors"
                      >
                        {logoPosition !== 'none' ? '📥 + Logo' : '📥 Télécharger'}
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
