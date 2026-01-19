'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Ingredient } from '@/types/admin'

interface AdminIngredientsEditorProps {
  value: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
  label?: string
  description?: string
  className?: string
}

// Generate unique key
function generateKey(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function AdminIngredientsEditor({
  value = [],
  onChange,
  label = 'Ingrédients',
  description,
  className,
}: AdminIngredientsEditorProps) {
  const addIngredient = useCallback(() => {
    onChange([
      ...value,
      { _key: generateKey(), quantity: '', ingredient: '', notes: '' },
    ])
  }, [value, onChange])

  const updateIngredient = useCallback((index: number, field: keyof Ingredient, fieldValue: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: fieldValue }
    onChange(updated)
  }, [value, onChange])

  const removeIngredient = useCallback((index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
  }, [value, onChange])

  const moveIngredient = useCallback((index: number, direction: 'up' | 'down') => {
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
          <span className="text-xs text-ink-soft/50">{value.length} ingrédient{value.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      {description && (
        <p className="text-xs text-ink-soft/60">{description}</p>
      )}

      {/* Ingredients list */}
      <div className="space-y-2">
        {value.map((ingredient, index) => (
          <div
            key={ingredient._key || index}
            className="group flex items-start gap-2 p-3 bg-cream-warm/50 rounded-xl border border-forest/5"
          >
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5 pt-2">
              <button
                type="button"
                onClick={() => moveIngredient(index, 'up')}
                disabled={index === 0}
                className={cn(
                  'p-1 rounded text-ink-soft/40 hover:text-forest hover:bg-forest/5 transition-colors',
                  index === 0 && 'opacity-30 cursor-not-allowed'
                )}
                title="Monter"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveIngredient(index, 'down')}
                disabled={index === value.length - 1}
                className={cn(
                  'p-1 rounded text-ink-soft/40 hover:text-forest hover:bg-forest/5 transition-colors',
                  index === value.length - 1 && 'opacity-30 cursor-not-allowed'
                )}
                title="Descendre"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-12 gap-2">
              {/* Quantity */}
              <div className="col-span-3">
                <input
                  type="text"
                  value={ingredient.quantity || ''}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="Quantité"
                  className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>

              {/* Ingredient name */}
              <div className="col-span-5">
                <input
                  type="text"
                  value={ingredient.ingredient || ''}
                  onChange={(e) => updateIngredient(index, 'ingredient', e.target.value)}
                  placeholder="Ingrédient"
                  className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>

              {/* Notes */}
              <div className="col-span-4">
                <input
                  type="text"
                  value={ingredient.notes || ''}
                  onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                  placeholder="Notes (optionnel)"
                  className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="p-2 rounded-lg text-ink-soft/40 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              title="Supprimer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addIngredient}
        className="w-full py-3 border-2 border-dashed border-forest/20 rounded-xl text-forest/60 hover:text-forest hover:border-forest/40 hover:bg-forest/5 transition-all flex items-center justify-center gap-2 font-body text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un ingrédient
      </button>
    </div>
  )
}
