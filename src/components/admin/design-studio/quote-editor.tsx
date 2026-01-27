'use client'

import { cn } from '@/lib/utils'

interface QuoteEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  disabled?: boolean
  placeholder?: string
}

export function QuoteEditor({
  value,
  onChange,
  maxLength = 280,
  disabled = false,
  placeholder = 'Entrez votre citation ici...',
}: QuoteEditorProps) {
  const charCount = value.length
  const isNearLimit = charCount >= maxLength * 0.8
  const isAtLimit = charCount >= maxLength

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-base text-forest font-medium tracking-tight">
            Texte de la citation
          </h3>
          <p className="font-body text-xs text-ink-soft/60">
            Maximum {maxLength} caractères
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            const newValue = e.target.value
            if (newValue.length <= maxLength) {
              onChange(newValue)
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className={cn(
            'w-full px-5 py-4 rounded-2xl border-2 font-display text-lg text-forest leading-relaxed',
            'placeholder:text-forest/30 placeholder:font-body placeholder:text-base',
            'focus:outline-none focus:ring-0 transition-all duration-300',
            'resize-none',
            disabled && 'opacity-50 cursor-not-allowed',
            isAtLimit
              ? 'border-blush-deep/40 bg-blush/10 focus:border-blush-deep/60'
              : 'border-forest/15 bg-cream-warm/50 focus:border-gold/50 focus:bg-white'
          )}
        />

        {/* Decorative quote marks */}
        <div className="absolute top-3 left-3 text-5xl font-display text-forest/5 pointer-events-none select-none">
          &ldquo;
        </div>
        <div className="absolute bottom-8 right-3 text-5xl font-display text-forest/5 pointer-events-none select-none">
          &rdquo;
        </div>

        {/* Character counter */}
        <div className="absolute bottom-3 right-4">
          <span className={cn(
            'font-accent text-xs tracking-wide transition-colors duration-300',
            isAtLimit ? 'text-blush-deep' : isNearLimit ? 'text-gold' : 'text-ink-soft/40'
          )}>
            {charCount}/{maxLength}
          </span>
        </div>
      </div>

      {/* Tips */}
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 bg-sage/10 text-forest/60 text-xs font-body rounded-full">
          Courte et percutante
        </span>
        <span className="px-3 py-1.5 bg-sage/10 text-forest/60 text-xs font-body rounded-full">
          Facile à lire
        </span>
        <span className="px-3 py-1.5 bg-sage/10 text-forest/60 text-xs font-body rounded-full">
          Inspirante
        </span>
      </div>
    </div>
  )
}
