'use client'

import { cn } from '@/lib/utils'

interface PromptEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function PromptEditor({ value, onChange, disabled }: PromptEditorProps) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-accent text-sm text-forest uppercase tracking-wider">
          Prompt
        </label>
        <span className={cn(
          'font-body text-xs',
          wordCount < 20 ? 'text-blush-deep' : wordCount > 100 ? 'text-gold' : 'text-ink-soft/70'
        )}>
          {wordCount} mots
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Décrivez l'image que vous souhaitez générer en anglais..."
        rows={5}
        className={cn(
          'w-full px-4 py-3 bg-cream border border-forest/10 rounded-xl',
          'font-body text-sm text-ink placeholder:text-ink-soft/50',
          'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50',
          'resize-none transition-all',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />

      <p className="font-body text-xs text-ink-soft/60">
        Le style de la marque sera automatiquement ajouté au prompt.
        Visez 50-80 mots pour de meilleurs résultats.
      </p>
    </div>
  )
}
