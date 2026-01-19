'use client'

import { useCallback, useState, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { RecipeStep, SanityImage } from '@/types/admin'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface AdminStepsEditorProps {
  value: RecipeStep[]
  onChange: (steps: RecipeStep[]) => void
  label?: string
  description?: string
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

interface StepItemProps {
  step: RecipeStep
  index: number
  isFirst: boolean
  isLast: boolean
  onUpdate: (field: keyof RecipeStep, value: string | SanityImage | undefined) => void
  onRemove: () => void
  onMove: (direction: 'up' | 'down') => void
}

function StepItem({ step, index, isFirst, isLast, onUpdate, onRemove, onMove }: StepItemProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imageUrl = previewUrl || (step.image?.asset?._ref ? getImageUrl(step.image.asset._ref) : null)

  const handleFileSelect = useCallback(async (file: File) => {
    setIsUploading(true)

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setIsUploading(false)
      return
    }

    // Create local preview
    setPreviewUrl(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_ADMIN_PATH}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()

      onUpdate('image', {
        _type: 'image',
        asset: {
          _ref: data.asset._ref,
          _type: 'reference',
        },
      })
    } catch {
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [onUpdate])

  const handleRemoveImage = useCallback(() => {
    onUpdate('image', undefined)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onUpdate])

  return (
    <div className="group flex gap-3 p-4 bg-cream-warm/50 rounded-xl border border-forest/5">
      {/* Step number and reorder */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gold/20 text-gold font-display text-sm flex items-center justify-center">
          {index + 1}
        </div>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={isFirst}
            className={cn(
              'p-1 rounded text-ink-soft/40 hover:text-forest hover:bg-forest/5 transition-colors',
              isFirst && 'opacity-30 cursor-not-allowed'
            )}
            title="Monter"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={isLast}
            className={cn(
              'p-1 rounded text-ink-soft/40 hover:text-forest hover:bg-forest/5 transition-colors',
              isLast && 'opacity-30 cursor-not-allowed'
            )}
            title="Descendre"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        {/* Step description */}
        <textarea
          value={step.step || ''}
          onChange={(e) => onUpdate('step', e.target.value)}
          placeholder="Décrivez cette étape..."
          rows={3}
          className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 resize-none"
        />

        {/* Image upload */}
        <div className="flex gap-3">
          {imageUrl ? (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden group/img">
              <Image
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-24 h-24 border-2 border-dashed border-forest/20 rounded-lg flex flex-col items-center justify-center gap-1 text-ink-soft/40 hover:text-forest/60 hover:border-forest/40 transition-colors"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px]">Photo</span>
                  <span className="text-[8px] text-gold/60">4:3</span>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
            className="hidden"
          />

          {/* Tip input */}
          <div className="flex-1">
            <label className="block text-xs text-ink-soft/50 mb-1">Astuce (optionnel)</label>
            <input
              type="text"
              value={step.tip || ''}
              onChange={(e) => onUpdate('tip', e.target.value)}
              placeholder="Une astuce pour cette étape..."
              className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={onRemove}
        className="p-2 h-fit rounded-lg text-ink-soft/40 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        title="Supprimer cette étape"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export function AdminStepsEditor({
  value = [],
  onChange,
  label = 'Étapes de préparation',
  description,
  className,
}: AdminStepsEditorProps) {
  const addStep = useCallback(() => {
    onChange([
      ...value,
      { _key: generateKey(), step: '', tip: '' },
    ])
  }, [value, onChange])

  const updateStep = useCallback((index: number, field: keyof RecipeStep, fieldValue: string | SanityImage | undefined) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: fieldValue }
    onChange(updated)
  }, [value, onChange])

  const removeStep = useCallback((index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
  }, [value, onChange])

  const moveStep = useCallback((index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= value.length) return

    const updated = [...value]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    onChange(updated)
  }, [value, onChange])

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block font-accent text-sm text-forest tracking-wide">
            {label}
          </label>
          <span className="text-xs text-ink-soft/50">{value.length} étape{value.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      {description && (
        <p className="text-xs text-ink-soft/60">{description}</p>
      )}

      {/* Steps list */}
      <div className="space-y-3">
        {value.map((step, index) => (
          <StepItem
            key={step._key || index}
            step={step}
            index={index}
            isFirst={index === 0}
            isLast={index === value.length - 1}
            onUpdate={(field, fieldValue) => updateStep(index, field, fieldValue)}
            onRemove={() => removeStep(index)}
            onMove={(direction) => moveStep(index, direction)}
          />
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addStep}
        className="w-full py-3 border-2 border-dashed border-forest/20 rounded-xl text-forest/60 hover:text-forest hover:border-forest/40 hover:bg-forest/5 transition-all flex items-center justify-center gap-2 font-body text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une étape
      </button>
    </div>
  )
}
