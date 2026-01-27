'use client'

import { cn } from '@/lib/utils'
import { SOCIAL_TEMPLATES, type SocialTemplate } from '@/types/design-studio'

interface SocialTemplatesProps {
  selectedId: string | null
  onSelect: (template: SocialTemplate) => void
}

export function SocialTemplates({ selectedId, onSelect }: SocialTemplatesProps) {
  return (
    <div className="space-y-1">
      {SOCIAL_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className={cn(
            'group flex items-center gap-3 w-full p-3 rounded-lg transition-all text-left',
            selectedId === template.id
              ? 'bg-gold/10 border border-gold/20'
              : 'bg-forest/[0.02] hover:bg-forest/[0.04] border border-transparent hover:border-forest/10'
          )}
        >
          <span className="text-lg flex-shrink-0">{template.icon}</span>
          <span className="font-body text-sm text-forest">{template.name}</span>
          <span className="font-body text-xs text-forest/40 ml-auto">{template.aspectRatio}</span>
        </button>
      ))}
    </div>
  )
}
