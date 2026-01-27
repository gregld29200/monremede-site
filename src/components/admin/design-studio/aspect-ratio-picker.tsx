'use client'

import { cn } from '@/lib/utils'
import type { AspectRatio, Resolution } from '@/types/design-studio'

interface AspectRatioPickerProps {
  aspectRatio: AspectRatio
  resolution: Resolution
  onAspectRatioChange: (ratio: AspectRatio) => void
  onResolutionChange: (resolution: Resolution) => void
}

const aspectRatios: {
  value: AspectRatio
  label: string
  platform: string
  icon: React.ReactNode
  widthRatio: number
  heightRatio: number
}[] = [
  {
    value: '16:9',
    label: '16:9',
    platform: 'Blog & YouTube',
    widthRatio: 16,
    heightRatio: 9,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    )
  },
  {
    value: '1:1',
    label: '1:1',
    platform: 'Instagram Post',
    widthRatio: 1,
    heightRatio: 1,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    )
  },
  {
    value: '9:16',
    label: '9:16',
    platform: 'Story & TikTok',
    widthRatio: 9,
    heightRatio: 16,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    )
  },
  {
    value: '4:5',
    label: '4:5',
    platform: 'Facebook',
    widthRatio: 4,
    heightRatio: 5,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    )
  },
  {
    value: '2:3',
    label: '2:3',
    platform: 'Pinterest',
    widthRatio: 2,
    heightRatio: 3,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    )
  },
  {
    value: '3:2',
    label: '3:2',
    platform: 'Classique',
    widthRatio: 3,
    heightRatio: 2,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    )
  },
]

const resolutions: { value: Resolution; label: string; description: string; price: string }[] = [
  { value: '1K', label: '1K', description: '1024px', price: '$0.04' },
  { value: '2K', label: '2K', description: '2048px', price: '$0.06' },
  { value: '4K', label: '4K', description: '4096px', price: '$0.09' },
]

export function AspectRatioPicker({
  aspectRatio,
  resolution,
  onAspectRatioChange,
  onResolutionChange,
}: AspectRatioPickerProps) {
  return (
    <div className="space-y-8">
      {/* Aspect Ratio Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest/20 to-forest/5 flex items-center justify-center">
            <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base text-forest font-medium tracking-tight">
              Format d&apos;image
            </h3>
            <p className="font-body text-xs text-ink-soft/60">
              Choisissez selon la plateforme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {aspectRatios.map((ratio) => {
            const isSelected = aspectRatio === ratio.value
            // Calculate preview dimensions (max 48px width/height)
            const maxSize = 40
            const scale = Math.min(maxSize / ratio.widthRatio, maxSize / ratio.heightRatio)
            const previewWidth = Math.round(ratio.widthRatio * scale)
            const previewHeight = Math.round(ratio.heightRatio * scale)

            return (
              <button
                key={ratio.value}
                onClick={() => onAspectRatioChange(ratio.value)}
                className={cn(
                  'group relative p-4 rounded-2xl text-center transition-all duration-300',
                  'flex flex-col items-center gap-3',
                  isSelected
                    ? 'bg-gradient-to-br from-gold/15 to-gold/5 border-2 border-gold/40 shadow-lg shadow-gold/10'
                    : 'bg-gradient-to-br from-cream-warm to-cream border border-forest/8 hover:border-forest/15 hover:shadow-md hover:shadow-forest/5'
                )}
              >
                {/* Visual preview with actual proportions */}
                <div
                  className="relative flex items-center justify-center"
                  style={{ height: `${maxSize}px`, width: `${maxSize}px` }}
                >
                  <div
                    className={cn(
                      'rounded-lg transition-all duration-300 flex items-center justify-center',
                      isSelected
                        ? 'bg-gradient-to-br from-gold/30 to-gold/15'
                        : 'bg-gradient-to-br from-forest/15 to-forest/5 group-hover:from-forest/20 group-hover:to-forest/10'
                    )}
                    style={{
                      width: `${previewWidth}px`,
                      height: `${previewHeight}px`
                    }}
                  >
                    <span className={cn(
                      'transition-colors duration-300',
                      isSelected ? 'text-gold' : 'text-forest/50 group-hover:text-forest/70'
                    )}>
                      {ratio.icon}
                    </span>
                  </div>
                </div>

                {/* Label and platform */}
                <div className="space-y-0.5">
                  <p className={cn(
                    'font-display text-sm font-semibold transition-colors duration-300',
                    isSelected ? 'text-gold' : 'text-forest'
                  )}>
                    {ratio.label}
                  </p>
                  <p className={cn(
                    'font-body text-xs transition-colors duration-300',
                    isSelected ? 'text-gold/70' : 'text-ink-soft/60'
                  )}>
                    {ratio.platform}
                  </p>
                </div>

                {/* Selection indicator */}
                <div className={cn(
                  'absolute top-2 right-2 w-2 h-2 rounded-full transition-all duration-300',
                  isSelected
                    ? 'bg-gold scale-100'
                    : 'bg-forest/10 scale-0 group-hover:scale-100'
                )} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Resolution Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage/30 to-sage/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base text-forest font-medium tracking-tight">
              Résolution
            </h3>
            <p className="font-body text-xs text-ink-soft/60">
              Qualité et coût par image
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {resolutions.map((res) => {
            const isSelected = resolution === res.value

            return (
              <button
                key={res.value}
                onClick={() => onResolutionChange(res.value)}
                className={cn(
                  'group flex-1 relative p-4 rounded-2xl text-center transition-all duration-300',
                  isSelected
                    ? 'bg-gradient-to-br from-gold/15 to-gold/5 border-2 border-gold/40 shadow-lg shadow-gold/10'
                    : 'bg-gradient-to-br from-cream-warm to-cream border border-forest/8 hover:border-forest/15 hover:shadow-md hover:shadow-forest/5'
                )}
              >
                {/* Resolution label */}
                <p className={cn(
                  'font-display text-lg font-semibold transition-colors duration-300',
                  isSelected ? 'text-gold' : 'text-forest'
                )}>
                  {res.label}
                </p>

                {/* Description */}
                <p className={cn(
                  'font-body text-xs transition-colors duration-300 mt-0.5',
                  isSelected ? 'text-gold/70' : 'text-ink-soft/60'
                )}>
                  {res.description}
                </p>

                {/* Price tag */}
                <div className={cn(
                  'mt-2 inline-flex px-2 py-0.5 rounded-full text-xs font-accent tracking-wide transition-colors duration-300',
                  isSelected
                    ? 'bg-gold/20 text-gold'
                    : 'bg-forest/8 text-forest/70 group-hover:bg-forest/12'
                )}>
                  {res.price}
                </div>

                {/* Recommended badge for 2K */}
                {res.value === '2K' && (
                  <div className={cn(
                    'absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-accent uppercase tracking-wider',
                    isSelected
                      ? 'bg-gold text-white'
                      : 'bg-forest text-cream'
                  )}>
                    Recommandé
                  </div>
                )}

                {/* Selection indicator */}
                <div className={cn(
                  'absolute top-2 right-2 w-2 h-2 rounded-full transition-all duration-300',
                  isSelected
                    ? 'bg-gold scale-100'
                    : 'bg-forest/10 scale-0 group-hover:scale-100'
                )} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
