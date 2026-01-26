'use client'

import { cn } from '@/lib/utils'
import { SOCIAL_TEMPLATES, type SocialTemplate } from '@/types/design-studio'

interface SocialTemplatesProps {
  selectedId: string | null
  onSelect: (template: SocialTemplate) => void
}

export function SocialTemplates({ selectedId, onSelect }: SocialTemplatesProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-accent text-sm text-forest uppercase tracking-wider">
        Formats réseaux sociaux
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SOCIAL_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={cn(
              'p-4 rounded-xl border text-left transition-all',
              selectedId === template.id
                ? 'bg-gold/10 border-gold/30 ring-2 ring-gold/20'
                : 'bg-cream hover:bg-cream-warm border-forest/10 hover:border-forest/20'
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <p className="font-display text-sm text-forest font-medium">
                  {template.name}
                </p>
                <p className="font-body text-xs text-ink-soft/70">
                  {template.aspectRatio}
                </p>
              </div>
            </div>
            <p className="font-body text-xs text-ink-soft/70">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
