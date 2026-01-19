'use client'

import { useState, useCallback, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface AdminTagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  label?: string
  description?: string
  placeholder?: string
  suggestions?: string[]
  className?: string
}

export function AdminTagsInput({
  value = [],
  onChange,
  label,
  description,
  placeholder = 'Appuyez sur Entrée pour ajouter...',
  suggestions = [],
  className,
}: AdminTagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputValue('')
    setShowSuggestions(false)
  }, [value, onChange])

  const removeTag = useCallback((index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
  }, [value, onChange])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag if backspace on empty input
      removeTag(value.length - 1)
    }
  }, [inputValue, value, addTag, removeTag])

  // Filter suggestions based on input and already selected tags
  const filteredSuggestions = suggestions.filter(
    s => !value.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block font-accent text-sm text-forest tracking-wide">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-ink-soft/60">{description}</p>
      )}

      {/* Tags container */}
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-3 border border-forest/10 rounded-xl bg-white focus-within:border-gold/50 focus-within:ring-1 focus-within:ring-gold/20 transition-colors">
          {/* Existing tags */}
          {value.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-sage/20 text-forest rounded-full font-body text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-0.5 hover:bg-forest/10 rounded-full transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}

          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow clicking suggestions
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[150px] py-1 font-body text-sm text-forest placeholder:text-ink-soft/40 bg-transparent outline-none"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 py-1 bg-white border border-forest/10 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="w-full px-4 py-2 text-left font-body text-sm text-forest hover:bg-forest/5 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-ink-soft/50">
        Appuyez sur <kbd className="px-1 py-0.5 bg-forest/5 rounded text-[10px]">Entrée</kbd> pour ajouter un tag
      </p>
    </div>
  )
}
