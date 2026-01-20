'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Category, CategoryColor } from '@/types/admin'
import { AdminSlugInput } from './admin-slug-input'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

const colorOptions: { value: CategoryColor; label: string; classes: string }[] = [
  { value: 'forest', label: 'Forêt', classes: 'bg-forest/20 border-forest/30 text-forest' },
  { value: 'sage', label: 'Sauge', classes: 'bg-sage/20 border-sage/30 text-sage' },
  { value: 'gold', label: 'Or', classes: 'bg-gold/20 border-gold/30 text-gold' },
  { value: 'blush', label: 'Rose', classes: 'bg-blush-deep/20 border-blush-deep/30 text-blush-deep' },
]

interface CategoryFormProps {
  category?: Category | null
  onSuccess: (category: Category, isNew: boolean) => void
  onCancel: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const isEdit = !!category
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState(category?.title || '')
  const [slug, setSlug] = useState(
    typeof category?.slug === 'string'
      ? category.slug
      : category?.slug?.current || ''
  )
  const [description, setDescription] = useState(category?.description || '')
  const [color, setColor] = useState<CategoryColor | ''>(category?.color || '')

  // Reset form when category changes
  useEffect(() => {
    setTitle(category?.title || '')
    setSlug(
      typeof category?.slug === 'string'
        ? category.slug
        : category?.slug?.current || ''
    )
    setDescription(category?.description || '')
    setColor(category?.color || '')
    setError(null)
  }, [category])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Le titre est requis')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        color: color || undefined,
      }

      const url = isEdit
        ? `${API_ADMIN_PATH}/categories/${category._id}`
        : `${API_ADMIN_PATH}/categories`

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      const data = await response.json()
      onSuccess(data.category, !isEdit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }, [title, slug, description, color, isEdit, category, onSuccess])

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-body text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block font-accent text-sm text-forest tracking-wide mb-2">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nom de la catégorie"
          className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
          autoFocus
        />
      </div>

      {/* Slug */}
      <AdminSlugInput
        value={slug}
        onChange={setSlug}
        sourceValue={title}
        prefix="/"
        description="URL de la catégorie. Générée automatiquement depuis le titre."
      />

      {/* Description */}
      <div>
        <label className="block font-accent text-sm text-forest tracking-wide mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description courte de la catégorie (optionnel)"
          rows={2}
          className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 resize-none"
        />
      </div>

      {/* Color */}
      <div>
        <label className="block font-accent text-sm text-forest tracking-wide mb-2">
          Couleur
        </label>
        <p className="text-xs text-ink-soft/60 mb-3">
          Couleur d&apos;affichage pour les badges de catégorie.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setColor('')}
            className={cn(
              'px-3 py-2 rounded-lg border transition-all font-body text-sm',
              !color
                ? 'border-forest/30 bg-forest/5 text-forest'
                : 'border-forest/10 text-ink-soft/60 hover:border-forest/20'
            )}
          >
            Par défaut
          </button>
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setColor(option.value)}
              className={cn(
                'px-3 py-2 rounded-lg border transition-all font-body text-sm',
                color === option.value
                  ? option.classes
                  : 'border-forest/10 text-ink-soft/60 hover:border-forest/20'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-forest/5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2.5 text-forest/70 hover:text-forest font-body text-sm transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-gold text-white rounded-xl font-body text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
            isEdit ? 'Mettre à jour' : 'Créer'
          )}
        </button>
      </div>
    </form>
  )
}
