import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: 'cream' | 'cream-warm' | 'forest' | 'forest-deep' | 'blush'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function Section({
  className,
  background = 'cream',
  spacing = 'lg',
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'relative',

        // Background colors
        background === 'cream' && 'bg-cream',
        background === 'cream-warm' && 'bg-cream-warm',
        background === 'forest' && 'bg-forest',
        background === 'forest-deep' && 'bg-forest-deep',
        background === 'blush' && 'bg-blush',

        // Spacing
        spacing === 'none' && 'py-0',
        spacing === 'sm' && 'py-12 md:py-16',
        spacing === 'md' && 'py-16 md:py-24',
        spacing === 'lg' && 'py-20 md:py-32 lg:py-40',
        spacing === 'xl' && 'py-24 md:py-40 lg:py-52',

        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  dark?: boolean
}

export function SectionHeader({
  className,
  label,
  title,
  subtitle,
  align = 'left',
  dark = false,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className
      )}
      {...props}
    >
      {label && (
        <span
          className={cn(
            'label mb-4 block',
            dark ? 'text-gold' : 'text-sage'
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={cn(
          'display-large',
          dark ? 'text-cream' : 'text-forest'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 font-serif text-lg italic',
            dark ? 'text-sage-light' : 'text-ink-soft'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
