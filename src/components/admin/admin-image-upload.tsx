'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { SanityImage } from '@/types/admin'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface AdminImageUploadProps {
  value?: SanityImage | null
  onChange: (image: SanityImage | null) => void
  label?: string
  description?: string
  className?: string
}

export function AdminImageUpload({
  value,
  onChange,
  label = 'Image',
  description,
  className,
}: AdminImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get preview URL from Sanity asset ref
  const getImageUrl = useCallback(() => {
    if (previewUrl) return previewUrl
    if (value?.asset?._ref) {
      // Extract image ID from ref: image-xxx-dimensions-format
      const ref = value.asset._ref
      const match = ref.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/)
      if (match) {
        const [, id, dimensions, format] = match
        return `https://cdn.sanity.io/images/4otm8dqd/production/${id}-${dimensions}.${format}`
      }
    }
    return null
  }, [value, previewUrl])

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.')
      setIsUploading(false)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum 5 Mo.')
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

      onChange({
        _type: 'image',
        asset: {
          _ref: data.asset._ref,
          _type: 'reference',
        },
        alt: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

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
    onChange(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const handleAltChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (value) {
      onChange({
        ...value,
        alt: e.target.value,
      })
    }
  }, [value, onChange])

  const imageUrl = getImageUrl()

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block font-accent text-sm text-forest tracking-wide">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-ink-soft/60 mb-2">{description}</p>
      )}

      {/* Upload area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all duration-200',
          isDragging
            ? 'border-gold bg-gold/5'
            : 'border-forest/20 hover:border-forest/40',
          imageUrl && 'border-solid border-forest/10'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {imageUrl ? (
          // Image preview
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={value?.alt || 'Preview'}
              fill
              className="object-cover rounded-xl"
            />
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors rounded-xl group">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/90 text-forest rounded-lg font-body text-sm mr-2 hover:bg-white transition-colors"
                >
                  Remplacer
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-500/90 text-white rounded-lg font-body text-sm hover:bg-red-500 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  <span className="font-body text-sm text-forest">Téléchargement...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty state / drop zone
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 flex flex-col items-center justify-center gap-3 cursor-pointer"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <span className="font-body text-sm text-forest">Téléchargement...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-forest/5 flex items-center justify-center">
                  <svg className="w-6 h-6 text-forest/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-body text-sm text-forest">
                    Glissez une image ou <span className="text-gold">parcourez</span>
                  </p>
                  <p className="font-body text-xs text-ink-soft/50 mt-1">
                    JPG, PNG, GIF ou WebP • Max 5 Mo
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
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Alt text input */}
      {imageUrl && (
        <div className="pt-2">
          <label className="block font-accent text-xs text-ink-soft/70 mb-1">
            Texte alternatif (pour l&apos;accessibilité)
          </label>
          <input
            type="text"
            value={value?.alt || ''}
            onChange={handleAltChange}
            placeholder="Décrivez cette image..."
            className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
