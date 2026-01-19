'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface AdminSlugInputProps {
  value: string
  onChange: (slug: string) => void
  sourceValue?: string
  label?: string
  description?: string
  prefix?: string
  className?: string
  disabled?: boolean
}

// Convert string to URL-safe slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 96) // Limit length
}

export function AdminSlugInput({
  value,
  onChange,
  sourceValue = '',
  label = 'Slug',
  description,
  prefix = '/',
  className,
  disabled = false,
}: AdminSlugInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)

  // Sync local value with prop
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Auto-generate slug from source when not manually edited
  useEffect(() => {
    if (!isEditing && !value && sourceValue) {
      const generatedSlug = generateSlug(sourceValue)
      onChange(generatedSlug)
    }
  }, [sourceValue, isEditing, value, onChange])

  const handleGenerateClick = useCallback(() => {
    if (sourceValue) {
      const generatedSlug = generateSlug(sourceValue)
      setLocalValue(generatedSlug)
      onChange(generatedSlug)
    }
  }, [sourceValue, onChange])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
    setLocalValue(newValue)
    onChange(newValue)
  }, [onChange])

  const handleEditClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleBlur = useCallback(() => {
    // Clean up trailing hyphens
    const cleanedValue = localValue.replace(/^-+|-+$/g, '')
    if (cleanedValue !== localValue) {
      setLocalValue(cleanedValue)
      onChange(cleanedValue)
    }
  }, [localValue, onChange])

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block font-accent text-sm text-forest tracking-wide">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-ink-soft/60">{description}</p>
      )}

      <div className="relative">
        {/* Slug display/input */}
        <div className={cn(
          'flex items-center border rounded-lg transition-colors',
          isEditing
            ? 'border-gold/50 ring-1 ring-gold/20'
            : 'border-forest/10',
          disabled && 'bg-forest/5'
        )}>
          {/* Prefix */}
          <span className="px-3 py-2 text-ink-soft/50 font-body text-sm border-r border-forest/10 bg-forest/5 rounded-l-lg">
            {prefix}
          </span>

          {/* Input */}
          <input
            type="text"
            value={localValue}
            onChange={handleInputChange}
            onFocus={handleEditClick}
            onBlur={handleBlur}
            placeholder="slug-de-la-page"
            disabled={disabled}
            className={cn(
              'flex-1 px-3 py-2 font-body text-sm text-forest placeholder:text-ink-soft/40 bg-transparent focus:outline-none',
              disabled && 'cursor-not-allowed'
            )}
          />

          {/* Generate button */}
          {!disabled && sourceValue && (
            <button
              type="button"
              onClick={handleGenerateClick}
              className="px-3 py-2 text-ink-soft/50 hover:text-gold transition-colors"
              title="Générer depuis le titre"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>

        {/* Preview URL */}
        {localValue && (
          <p className="mt-1.5 text-xs text-ink-soft/50 font-body truncate">
            URL: <span className="text-forest/70">{prefix}{localValue}</span>
          </p>
        )}
      </div>
    </div>
  )
}
