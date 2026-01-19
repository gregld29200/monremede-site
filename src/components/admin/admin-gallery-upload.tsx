'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/types/admin'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface AdminGalleryUploadProps {
  value: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
  label?: string
  description?: string
  maxImages?: number
  aspectRatio?: string
  recommendedWidth?: number
  recommendedHeight?: number
  className?: string
}

// Generate unique key
function generateKey(): string {
  return Math.random().toString(36).substring(2, 10)
}

// Get image URL from Sanity asset ref
function getImageUrl(ref: string): string {
  const match = ref.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/)
  if (match) {
    const [, id, dimensions, format] = match
    return `https://cdn.sanity.io/images/4otm8dqd/production/${id}-${dimensions}.${format}`
  }
  return ''
}

export function AdminGalleryUpload({
  value = [],
  onChange,
  label = 'Galerie d\'images',
  description,
  maxImages = 10,
  aspectRatio,
  recommendedWidth,
  recommendedHeight,
  className,
}: AdminGalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canAddMore = value.length < maxImages

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!canAddMore) return

    const validFiles: File[] = []
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024

    // Validate and collect files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (validTypes.includes(file.type) && file.size <= maxSize) {
        validFiles.push(file)
      }
      // Stop if we've reached max images
      if (value.length + validFiles.length >= maxImages) break
    }

    if (validFiles.length === 0) return

    setIsUploading(true)
    setUploadingCount(validFiles.length)

    const newImages: GalleryImage[] = []

    for (const file of validFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${API_ADMIN_PATH}/upload`, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newImages.push({
            _key: generateKey(),
            _type: 'image',
            asset: {
              _ref: data.asset._ref,
              _type: 'reference',
            },
            alt: '',
          })
        }
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    if (newImages.length > 0) {
      onChange([...value, ...newImages])
    }

    setIsUploading(false)
    setUploadingCount(0)
  }, [value, onChange, canAddMore, maxImages])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
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
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [handleFileSelect])

  const handleRemove = useCallback((index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
    setEditingIndex(null)
  }, [value, onChange])

  const handleAltChange = useCallback((index: number, alt: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], alt }
    onChange(updated)
  }, [value, onChange])

  // Drag reordering handlers
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  const handleDragOverItem = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const updated = [...value]
    const [draggedItem] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, draggedItem)
    onChange(updated)
    setDraggedIndex(index)
  }, [draggedIndex, value, onChange])

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {label && (
            <label className="block font-accent text-sm text-forest tracking-wide">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-ink-soft/60 mt-1">{description}</p>
          )}
        </div>
        <span className="text-xs text-ink-soft/50">
          {value.length}/{maxImages}
        </span>
      </div>

      {/* Images grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((image, index) => {
            const imageUrl = getImageUrl(image.asset._ref)
            const isEditing = editingIndex === index

            return (
              <div
                key={image._key}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOverItem(e, index)}
                className={cn(
                  'relative group rounded-lg overflow-hidden border-2 transition-all cursor-move',
                  draggedIndex === index
                    ? 'border-gold opacity-50'
                    : 'border-transparent hover:border-forest/20'
                )}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={imageUrl}
                    alt={image.alt || ''}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {/* Edit alt */}
                    <button
                      type="button"
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                      title="Modifier le texte alternatif"
                    >
                      <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-2 bg-red-500/90 rounded-lg hover:bg-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Drag handle indicator */}
                  <div className="absolute top-2 left-2 p-1 bg-black/30 rounded text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
                    </svg>
                  </div>
                </div>

                {/* Alt text editor */}
                {isEditing && (
                  <div className="p-2 bg-white border-t border-forest/10">
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => handleAltChange(index, e.target.value)}
                      placeholder="Texte alternatif..."
                      className="w-full px-2 py-1.5 border border-forest/10 rounded text-xs font-body focus:outline-none focus:border-gold/50"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div
          className={cn(
            'border-2 border-dashed rounded-xl transition-all duration-200',
            isDragging
              ? 'border-gold bg-gold/5'
              : 'border-forest/20 hover:border-forest/40'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full p-6 flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <>
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <span className="font-body text-sm text-forest">
                  Téléchargement de {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-body text-sm text-forest">
                    Glissez des images ou <span className="text-gold">parcourez</span>
                  </p>
                  <p className="font-body text-xs text-ink-soft/50 mt-1">
                    JPG, PNG, GIF ou WebP • Max 5 Mo par image
                  </p>
                  {(aspectRatio || (recommendedWidth && recommendedHeight)) && (
                    <p className="font-body text-xs text-gold/70 mt-1">
                      {aspectRatio && `Ratio ${aspectRatio}`}
                      {aspectRatio && recommendedWidth && recommendedHeight && ' • '}
                      {recommendedWidth && recommendedHeight && `${recommendedWidth}×${recommendedHeight}px`}
                    </p>
                  )}
                </div>
              </>
            )}
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
        multiple
      />

      {/* Instructions */}
      {value.length > 0 && (
        <p className="text-xs text-ink-soft/50 text-center">
          Glissez pour réorganiser • Survolez pour modifier ou supprimer
        </p>
      )}
    </div>
  )
}
