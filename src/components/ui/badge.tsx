import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'sage' | 'blush'
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 font-sans text-xs font-medium tracking-widest uppercase',

        variant === 'default' && 'bg-cream-warm text-forest border border-sage-light',
        variant === 'gold' && 'bg-gold text-forest-deep',
        variant === 'sage' && 'bg-sage-light text-forest-deep',
        variant === 'blush' && 'bg-blush text-forest-deep',

        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
