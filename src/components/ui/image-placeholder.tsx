import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface ImagePlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
}

export function ImagePlaceholder({
  className,
  label = 'Image',
  aspectRatio = 'landscape',
  ...props
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden flex items-center justify-center',
        'bg-gradient-to-br from-sage-light to-sage',

        // Aspect ratios
        aspectRatio === 'square' && 'aspect-square',
        aspectRatio === 'video' && 'aspect-video',
        aspectRatio === 'portrait' && 'aspect-[3/4]',
        aspectRatio === 'landscape' && 'aspect-[4/3]',

        className
      )}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

      {/* Label */}
      <span className="relative z-10 font-sans text-xs tracking-widest uppercase text-forest-deep/60 text-center px-4">
        {label}
      </span>
    </div>
  )
}
