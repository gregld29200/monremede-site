'use client'

import { cn } from '@/lib/utils'
import type { AspectRatio, Resolution } from '@/types/design-studio'

interface AspectRatioPickerProps {
  aspectRatio: AspectRatio
  resolution: Resolution
  onAspectRatioChange: (ratio: AspectRatio) => void
  onResolutionChange: (resolution: Resolution) => void
}

const aspectRatios: { value: AspectRatio; label: string; description: string; preview: string }[] = [
  { value: '16:9', label: '16:9', description: 'Blog, YouTube', preview: 'w-16 h-9' },
  { value: '1:1', label: '1:1', description: 'Instagram Post', preview: 'w-12 h-12' },
  { value: '9:16', label: '9:16', description: 'Story, TikTok', preview: 'w-9 h-16' },
  { value: '4:5', label: '4:5', description: 'Facebook', preview: 'w-10 h-12' },
  { value: '2:3', label: '2:3', description: 'Pinterest', preview: 'w-8 h-12' },
  { value: '3:2', label: '3:2', description: 'Classique', preview: 'w-12 h-8' },
]

const resolutions: { value: Resolution; label: string; price: string }[] = [
  { value: '1K', label: '1K (1024px)', price: '$0.09' },
  { value: '2K', label: '2K (2048px)', price: '$0.09' },
  { value: '4K', label: '4K (4096px)', price: '$0.12' },
]

export function AspectRatioPicker({
  aspectRatio,
  resolution,
  onAspectRatioChange,
  onResolutionChange,
}: AspectRatioPickerProps) {
  return (
    <div className="space-y-6">
      {/* Aspect Ratio */}
      <div className="space-y-3">
        <label className="font-accent text-sm text-forest uppercase tracking-wider">
          Ratio d&apos;aspect
        </label>
        <div className="grid grid-cols-3 gap-3">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => onAspectRatioChange(ratio.value)}
              className={cn(
                'p-3 rounded-xl border text-center transition-all',
                aspectRatio === ratio.value
                  ? 'bg-gold/10 border-gold/30 ring-2 ring-gold/20'
                  : 'bg-cream hover:bg-cream-warm border-forest/10 hover:border-forest/20'
              )}
            >
              {/* Visual preview */}
              <div className="flex justify-center mb-2">
                <div
                  className={cn(
                    'bg-forest/10 rounded',
                    ratio.preview
                  )}
                />
              </div>
              <p className="font-display text-sm text-forest font-medium">
                {ratio.label}
              </p>
              <p className="font-body text-xs text-ink-soft/70">
                {ratio.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div className="space-y-3">
        <label className="font-accent text-sm text-forest uppercase tracking-wider">
          Résolution
        </label>
        <div className="flex gap-3">
          {resolutions.map((res) => (
            <button
              key={res.value}
              onClick={() => onResolutionChange(res.value)}
              className={cn(
                'flex-1 p-3 rounded-xl border text-center transition-all',
                resolution === res.value
                  ? 'bg-gold/10 border-gold/30 ring-2 ring-gold/20'
                  : 'bg-cream hover:bg-cream-warm border-forest/10 hover:border-forest/20'
              )}
            >
              <p className="font-display text-sm text-forest font-medium">
                {res.label}
              </p>
              <p className="font-body text-xs text-ink-soft/70">
                {res.price}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
