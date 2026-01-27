'use client'

import { useState, Suspense, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  GenerationStatus,
} from '@/components/admin/design-studio'
import { SOCIAL_TEMPLATES, BRAND_KIT, type PromptSuggestion } from '@/types/design-studio'

const ADMIN_PATH = '/gestion-mon-remede-oum'

type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type LogoColor = 'dark' | 'light'
type OutputFormat = 'png' | 'webp' | 'jpeg'
type WorkflowStep = 'describe' | 'select-prompt' | 'generate'

interface GeneratedImageData {
  url: string
  id: string
}

function SocialPageContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Find the template
  const template = SOCIAL_TEMPLATES.find(t => t.id === templateId) || SOCIAL_TEMPLATES[0]

  // Workflow state
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('describe')
  const [userDescription, setUserDescription] = useState('')
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false)
  const [promptSuggestions, setPromptSuggestions] = useState<PromptSuggestion[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [editedPrompt, setEditedPrompt] = useState<string>('')

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([])
  const [error, setError] = useState<string | null>(null)

  // Background upload state
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)

  // Logo editor state
  const [editingImage, setEditingImage] = useState<GeneratedImageData | null>(null)
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('bottom-right')
  const [logoSize, setLogoSize] = useState(80)
  const [logoColor, setLogoColor] = useState<LogoColor>('dark')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png')
  const [isDownloading, setIsDownloading] = useState(false)

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

  // Step 1: Generate prompt suggestions from user description
  const handleGeneratePrompts = async () => {
    if (!userDescription.trim()) return

    setIsGeneratingPrompts(true)
    setError(null)

    try {
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customPrompt: `L'utilisateur veut créer une image pour ${template.name} (format ${template.aspectRatio}).

Sa demande : "${userDescription}"

Génère exactement 3 prompts d'images détaillés et créatifs pour répondre à cette demande. Chaque prompt doit :
1. Être en français
2. Décrire une scène ou composition visuelle spécifique et détaillée
3. Être adapté au style de la marque (naturel, organique, apaisant, féminin)
4. Avoir environ 60-100 mots avec des détails sur la composition, les couleurs, l'ambiance, les éléments visuels
5. Être optimisé pour le format ${template.aspectRatio}

Réponds UNIQUEMENT au format JSON suivant, sans texte avant ou après :
{
  "prompts": [
    { "text": "prompt détaillé en français...", "suggestedRatio": "${template.aspectRatio}" },
    { "text": "prompt détaillé en français...", "suggestedRatio": "${template.aspectRatio}" },
    { "text": "prompt détaillé en français...", "suggestedRatio": "${template.aspectRatio}" }
  ]
}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la génération des prompts')
      }

      const data = await response.json()
      setPromptSuggestions(data.prompts || [])
      setWorkflowStep('select-prompt')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération des prompts')
    } finally {
      setIsGeneratingPrompts(false)
    }
  }

  // Select a prompt suggestion
  const handleSelectPrompt = (promptText: string) => {
    setSelectedPrompt(promptText)
    setEditedPrompt(promptText)
  }

  // Go back to description step
  const handleBackToDescription = () => {
    setWorkflowStep('describe')
    setPromptSuggestions([])
    setSelectedPrompt('')
    setEditedPrompt('')
  }

  // Step 2: Generate image with the selected/edited prompt
  const handleGenerate = async () => {
    const promptToUse = editedPrompt.trim()
    if (!promptToUse) return

    setIsGenerating(true)
    setError(null)
    setWorkflowStep('generate')

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
          prompt: `${promptToUse}\n\n${BRAND_KIT.promptSuffix}`,
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
      setWorkflowStep('select-prompt')
    }
  }

  // Reset to start new generation
  const handleNewGeneration = () => {
    setWorkflowStep('describe')
    setUserDescription('')
    setPromptSuggestions([])
    setSelectedPrompt('')
    setEditedPrompt('')
    setError(null)
  }

  // Use useCallback to prevent recreation on each render
  const handleGenerationComplete = useCallback((resultUrl: string) => {
    const newImage: GeneratedImageData = {
      url: resultUrl,
      id: `img-${Date.now()}`,
    }
    setGeneratedImages(prev => {
      // Prevent duplicates by checking if URL already exists
      if (prev.some(img => img.url === resultUrl)) {
        return prev
      }
      return [newImage, ...prev]
    })
    setIsGenerating(false)
    setTaskId(null)
    setDocumentId(null)
    // Reset workflow to allow new generation
    setWorkflowStep('describe')
    setUserDescription('')
    setPromptSuggestions([])
    setSelectedPrompt('')
    setEditedPrompt('')
  }, [])

  const handleGenerationError = useCallback((errorMsg: string) => {
    setError(errorMsg)
    setIsGenerating(false)
    setTaskId(null)
    // Go back to prompt selection on error
    setWorkflowStep('select-prompt')
  }, [])

  const openLogoEditor = (image: GeneratedImageData) => {
    setEditingImage(image)
    setLogoPosition('bottom-right')
    setLogoSize(80)
    setLogoColor('dark')
    setOutputFormat('png')
  }

  const closeLogoEditor = () => {
    setEditingImage(null)
  }

  const downloadWithoutLogo = async (imageUrl: string) => {
    setIsDownloading(true)
    try {
      // Use server-side proxy to avoid CORS
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/add-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          position: logoPosition,
          size: 0, // Size 0 means no logo
          logoColor: 'dark',
          format: outputFormat,
        }),
      })

      if (!response.ok) {
        // Fallback: try direct download (might work in some cases)
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = `${template.id}-monremede-${Date.now()}.${outputFormat}`
        link.target = '_blank'
        link.click()
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${template.id}-monremede-${Date.now()}.${outputFormat}`
      link.click()
      URL.revokeObjectURL(url)
      closeLogoEditor()
    } catch (err) {
      console.error('Download error:', err)
      setError('Erreur lors du téléchargement')
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadWithLogo = async (imageUrl: string) => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/gestion-mon-remede-oum/design-studio/add-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          position: logoPosition,
          size: logoSize,
          logoColor,
          format: outputFormat,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add logo')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${template.id}-monremede-logo-${Date.now()}.${outputFormat}`
      link.click()
      URL.revokeObjectURL(url)
      closeLogoEditor()
    } catch (err) {
      console.error('Download error:', err)
      setError('Erreur lors du téléchargement avec logo')
    } finally {
      setIsDownloading(false)
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
        {/* Left: Workflow Steps */}
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full font-body text-sm font-medium transition-colors',
              workflowStep === 'describe' ? 'bg-forest text-cream' : 'bg-forest/20 text-forest'
            )}>
              1
            </div>
            <div className={cn('h-0.5 flex-1 transition-colors', workflowStep !== 'describe' ? 'bg-forest' : 'bg-forest/20')} />
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full font-body text-sm font-medium transition-colors',
              workflowStep === 'select-prompt' ? 'bg-forest text-cream' : workflowStep === 'generate' ? 'bg-forest/20 text-forest' : 'bg-forest/10 text-forest/40'
            )}>
              2
            </div>
            <div className={cn('h-0.5 flex-1 transition-colors', workflowStep === 'generate' ? 'bg-forest' : 'bg-forest/20')} />
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full font-body text-sm font-medium transition-colors',
              workflowStep === 'generate' ? 'bg-forest text-cream' : 'bg-forest/10 text-forest/40'
            )}>
              3
            </div>
          </div>

          {/* Step 1: Describe */}
          {workflowStep === 'describe' && (
            <div className="bg-white rounded-2xl border border-forest/8 p-6">
              <h2 className="font-display text-lg text-forest mb-2">1. Décrivez ce que vous voulez</h2>
              <p className="font-body text-sm text-forest/60 mb-4">
                Écrivez simplement votre idée. L&apos;IA va créer un prompt détaillé pour vous.
              </p>

              <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder={`Ex: "Une image inspirante avec une citation sur la santé intestinale" ou "Un visuel apaisant avec des herbes médicinales pour promouvoir une consultation"`}
                disabled={isGeneratingPrompts}
                rows={4}
                className="w-full p-4 rounded-xl border border-forest/10 bg-cream/30 font-body text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none disabled:opacity-50"
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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

              <button
                onClick={handleGeneratePrompts}
                disabled={!userDescription.trim() || isGeneratingPrompts}
                className={cn(
                  'w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body text-sm transition-all',
                  !userDescription.trim() || isGeneratingPrompts
                    ? 'bg-forest/10 text-forest/40 cursor-not-allowed'
                    : 'bg-forest text-cream hover:bg-forest-deep'
                )}
              >
                {isGeneratingPrompts ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    L&apos;IA prépare vos prompts...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Générer des prompts avec l&apos;IA
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-blush/20 border border-blush-deep/20 rounded-lg">
                  <p className="font-body text-sm text-blush-deep">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select/Edit Prompt */}
          {workflowStep === 'select-prompt' && (
            <div className="bg-white rounded-2xl border border-forest/8 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-lg text-forest">2. Choisissez un prompt</h2>
                  <p className="font-body text-sm text-forest/60 mt-1">
                    Sélectionnez une suggestion ou modifiez-la
                  </p>
                </div>
                <button
                  onClick={handleBackToDescription}
                  className="p-2 text-forest/50 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              </div>

              {/* Original Description */}
              <div className="mb-4 p-3 bg-cream/50 rounded-lg border border-forest/5">
                <p className="font-body text-xs text-forest/50 mb-1">Votre demande :</p>
                <p className="font-body text-sm text-forest">&quot;{userDescription}&quot;</p>
              </div>

              {/* Prompt Suggestions */}
              <div className="space-y-3 mb-6">
                {promptSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSelectPrompt(suggestion.text)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all',
                      selectedPrompt === suggestion.text
                        ? 'border-forest bg-forest/5'
                        : 'border-forest/10 hover:border-forest/30 bg-white'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className={cn(
                        'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                        selectedPrompt === suggestion.text
                          ? 'bg-forest text-cream'
                          : 'bg-forest/10 text-forest'
                      )}>
                        {index + 1}
                      </span>
                      <p className="font-body text-sm text-forest leading-relaxed">
                        {suggestion.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Edit Selected Prompt */}
              {selectedPrompt && (
                <div className="border-t border-forest/10 pt-4">
                  <label className="font-body text-sm font-medium text-forest mb-2 block">
                    ✏️ Modifier le prompt (optionnel)
                  </label>
                  <textarea
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    rows={5}
                    className="w-full p-4 rounded-xl border border-forest/10 bg-cream/30 font-body text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                  />
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!editedPrompt.trim() || isGenerating}
                className={cn(
                  'w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body text-sm transition-all',
                  !editedPrompt.trim() || isGenerating
                    ? 'bg-forest/10 text-forest/40 cursor-not-allowed'
                    : 'bg-gold text-white hover:bg-gold/90'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Générer l&apos;image (~$0.04)
              </button>

              {error && (
                <div className="mt-4 p-3 bg-blush/20 border border-blush-deep/20 rounded-lg">
                  <p className="font-body text-sm text-blush-deep">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Generation in Progress */}
          {workflowStep === 'generate' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-forest/8 p-6">
                <h2 className="font-display text-lg text-forest mb-2">3. Génération en cours</h2>
                <p className="font-body text-sm text-forest/60 mb-4">
                  Votre image est en cours de création...
                </p>

                {/* Show the prompt used */}
                <div className="p-3 bg-cream/50 rounded-lg border border-forest/5 mb-4">
                  <p className="font-body text-xs text-forest/50 mb-1">Prompt utilisé :</p>
                  <p className="font-body text-sm text-forest line-clamp-3">{editedPrompt}</p>
                </div>

                {error && (
                  <div className="p-3 bg-blush/20 border border-blush-deep/20 rounded-lg mb-4">
                    <p className="font-body text-sm text-blush-deep">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleNewGeneration}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-body text-sm text-forest/70 hover:text-forest hover:bg-forest/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Nouvelle génération
                </button>
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
                  // eslint-disable-next-line @next/next/no-img-element
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
              </div>
            </div>
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="bg-white rounded-2xl border border-forest/8 p-6">
              <h3 className="font-display text-lg text-forest mb-4">Images générées</h3>
              <p className="font-body text-xs text-forest/50 mb-4">
                Cliquez sur une image pour ajouter le logo
              </p>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div
                      className="relative rounded-xl overflow-hidden border border-forest/10 cursor-pointer"
                      style={{ aspectRatio: template.aspectRatio.replace(':', '/') }}
                      onClick={() => openLogoEditor(image)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt="Generated image"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => openLogoEditor(image)}
                        className="px-4 py-2 bg-white text-forest rounded-lg font-body text-sm hover:bg-cream transition-colors"
                      >
                        🏷️ Télécharger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logo Editor Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeLogoEditor}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl text-forest">Télécharger l&apos;image</h3>
                <button
                  onClick={closeLogoEditor}
                  className="p-2 text-forest/50 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image Preview with Logo */}
              <div className="flex justify-center mb-6">
                <div
                  className="relative rounded-xl overflow-hidden border border-forest/20 shadow-lg"
                  style={{
                    aspectRatio: template.aspectRatio.replace(':', '/'),
                    maxWidth: '100%',
                    width: template.aspectRatio === '9:16' || template.aspectRatio === '2:3' ? '280px' : '400px',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editingImage.url}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Logo overlay preview */}
                  <div
                    className={cn(
                      'absolute p-3',
                      logoPosition === 'top-left' && 'top-0 left-0',
                      logoPosition === 'top-right' && 'top-0 right-0',
                      logoPosition === 'bottom-left' && 'bottom-0 left-0',
                      logoPosition === 'bottom-right' && 'bottom-0 right-0'
                    )}
                  >
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={logoSize}
                      height={logoSize}
                      className={cn(
                        'drop-shadow-lg',
                        logoColor === 'light' && 'invert brightness-200'
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Logo Controls */}
              <div className="space-y-4 mb-6">
                {/* Position */}
                <div>
                  <p className="font-body text-sm text-forest mb-2">Position du logo :</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'top-left', label: '↖ Haut gauche' },
                      { value: 'top-right', label: '↗ Haut droit' },
                      { value: 'bottom-left', label: '↙ Bas gauche' },
                      { value: 'bottom-right', label: '↘ Bas droit' },
                    ].map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => setLogoPosition(pos.value as LogoPosition)}
                        className={cn(
                          'px-3 py-2 rounded-lg text-xs font-body transition-all',
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

                {/* Logo Color */}
                <div>
                  <p className="font-body text-sm text-forest mb-2">Couleur du logo :</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogoColor('dark')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all',
                        logoColor === 'dark'
                          ? 'bg-forest text-cream'
                          : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                      )}
                    >
                      <span className="w-4 h-4 rounded-full bg-forest border border-forest/20" />
                      Foncé
                    </button>
                    <button
                      onClick={() => setLogoColor('light')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all',
                        logoColor === 'light'
                          ? 'bg-forest text-cream'
                          : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                      )}
                    >
                      <span className="w-4 h-4 rounded-full bg-white border border-forest/20" />
                      Clair (fond sombre)
                    </button>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <p className="font-body text-sm text-forest mb-2">Taille du logo : {logoSize}px</p>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full h-2 bg-forest/10 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                </div>

                {/* Format */}
                <div>
                  <p className="font-body text-sm text-forest mb-2">Format de sortie :</p>
                  <div className="flex gap-2">
                    {[
                      { value: 'png', label: 'PNG', desc: 'Qualité maximale' },
                      { value: 'webp', label: 'WebP', desc: 'Léger, web' },
                      { value: 'jpeg', label: 'JPEG', desc: 'Compatible' },
                    ].map((fmt) => (
                      <button
                        key={fmt.value}
                        onClick={() => setOutputFormat(fmt.value as OutputFormat)}
                        className={cn(
                          'flex-1 px-3 py-2 rounded-lg text-xs font-body transition-all text-center',
                          outputFormat === fmt.value
                            ? 'bg-forest text-cream'
                            : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                        )}
                      >
                        <div className="font-medium">{fmt.label}</div>
                        <div className={cn(
                          'text-[10px] mt-0.5',
                          outputFormat === fmt.value ? 'text-cream/70' : 'text-forest/50'
                        )}>
                          {fmt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => downloadWithoutLogo(editingImage.url)}
                  disabled={isDownloading}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body text-sm transition-colors',
                    isDownloading
                      ? 'bg-forest/5 text-forest/40 cursor-not-allowed'
                      : 'bg-forest/10 text-forest hover:bg-forest/20'
                  )}
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  )}
                  Sans logo
                </button>
                <button
                  onClick={() => downloadWithLogo(editingImage.url)}
                  disabled={isDownloading}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body text-sm transition-colors',
                    isDownloading
                      ? 'bg-forest/50 text-cream/50 cursor-not-allowed'
                      : 'bg-forest text-cream hover:bg-forest-deep'
                  )}
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  )}
                  Avec logo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
