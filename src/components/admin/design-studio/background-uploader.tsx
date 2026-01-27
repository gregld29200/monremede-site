'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface BackgroundUploaderProps {
  onUpload: (imageUrl: string) => void
  onRemove: () => void
  imageUrl: string | null
  disabled?: boolean
  className?: string
}

export function BackgroundUploader({
  onUpload,
  onRemove,
  imageUrl,
  disabled = false,
  className,
}: BackgroundUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayUrl = previewUrl || imageUrl

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez JPG, PNG ou WebP.')
      setIsUploading(false)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum 10 Mo.')
      setIsUploading(false)
      return
    }

    // Create local preview
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_ADMIN_PATH}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors du téléchargement')
      }

      const data = await response.json()

      // Extract image URL from Sanity asset ref
      const ref = data.asset._ref
      const match = ref.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/)
      if (match) {
        const [, id, dimensions, format] = match
        const sanityUrl = `https://cdn.sanity.io/images/4otm8dqd/production/${id}-${dimensions}.${format}`
        onUpload(sanityUrl)
      } else {
        throw new Error('Format de référence invalide')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleRemove = useCallback(() => {
    onRemove()
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onRemove])

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush/30 to-blush/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-display text-sm text-forest font-medium">
            Image de référence
          </h4>
          <p className="font-body text-xs text-ink-soft/60">
            Optionnel - Utilisée comme base pour la génération
          </p>
        </div>
      </div>

      <div
        className={cn(
          'relative border-2 border-dashed rounded-2xl transition-all duration-300',
          isDragging
            ? 'border-gold bg-gradient-to-br from-gold/10 to-gold/5'
            : 'border-forest/15 hover:border-forest/25',
          displayUrl && 'border-solid border-forest/10',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {displayUrl ? (
          <div className="relative aspect-video">
            <Image
              src={displayUrl}
              alt="Image de référence"
              fill
              className="object-cover rounded-xl"
            />
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors rounded-xl group">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="px-4 py-2.5 bg-white/95 text-forest rounded-xl font-body text-sm hover:bg-white transition-colors shadow-lg"
                >
                  Remplacer
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="px-4 py-2.5 bg-blush-deep/90 text-white rounded-xl font-body text-sm hover:bg-blush-deep transition-colors shadow-lg"
                >
                  Supprimer
                </button>
              </div>
            </div>
            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
                  <span className="font-body text-sm text-forest">Téléchargement...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 flex flex-col items-center justify-center gap-4 cursor-pointer"
            disabled={isUploading || disabled}
          >
            {isUploading ? (
              <>
                <div className="w-12 h-12 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
                <span className="font-body text-sm text-forest">Téléchargement...</span>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest/10 to-forest/5 flex items-center justify-center">
                  <svg className="w-7 h-7 text-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-body text-sm text-forest">
                    Glissez une image ou <span className="text-gold font-medium">parcourez</span>
                  </p>
                  <p className="font-body text-xs text-ink-soft/50 mt-1.5">
                    JPG, PNG ou WebP • Max 10 Mo
                  </p>
                </div>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Error message */}
      {error && (
        <div className="p-3 bg-blush/20 border border-blush-deep/20 rounded-xl">
          <p className="font-body text-sm text-blush-deep flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
