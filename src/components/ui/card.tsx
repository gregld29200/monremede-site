import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered'
  hover?: boolean
}

export function Card({
  className,
  variant = 'default',
  hover = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'relative transition-all duration-500',

        variant === 'default' && 'bg-cream-warm',
        variant === 'elevated' && 'bg-cream shadow-lg',
        variant === 'glass' && [
          'bg-cream/5 backdrop-blur-sm',
          'border border-cream/10',
        ],
        variant === 'bordered' && 'bg-cream border border-sage/20',

        hover && [
          'cursor-pointer',
          variant === 'default' && 'hover:bg-blush hover:border-blush-deep border border-transparent',
          variant === 'elevated' && 'hover:shadow-xl hover:-translate-y-1',
          variant === 'glass' && 'hover:bg-cream/10 hover:border-gold/30 hover:translate-x-2',
          variant === 'bordered' && 'hover:border-sage hover:shadow-md',
        ],

        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}
