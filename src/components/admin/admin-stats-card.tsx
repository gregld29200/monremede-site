'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface AdminStatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  accentColor?: 'gold' | 'sage' | 'blush' | 'forest'
  className?: string
  delay?: number
}

const colorStyles = {
  gold: {
    iconBg: 'bg-gradient-to-br from-gold/20 to-gold/5',
    iconBorder: 'border-gold/20',
    iconColor: 'text-gold',
    glow: 'bg-gold/10',
  },
  sage: {
    iconBg: 'bg-gradient-to-br from-sage/20 to-sage/5',
    iconBorder: 'border-sage/20',
    iconColor: 'text-sage',
    glow: 'bg-sage/10',
  },
  blush: {
    iconBg: 'bg-gradient-to-br from-blush-deep/20 to-blush/10',
    iconBorder: 'border-blush-deep/20',
    iconColor: 'text-blush-deep',
    glow: 'bg-blush-deep/10',
  },
  forest: {
    iconBg: 'bg-gradient-to-br from-forest/15 to-forest/5',
    iconBorder: 'border-forest/15',
    iconColor: 'text-forest',
    glow: 'bg-forest/10',
  },
}

export function AdminStatsCard({
  title,
  value,
  icon,
  trend,
  accentColor = 'gold',
  className,
  delay = 0,
}: AdminStatsCardProps) {
  const colors = colorStyles[accentColor]
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0

  // Animate count up
  useEffect(() => {
    if (numericValue === 0) {
      setDisplayValue(0)
      return
    }

    const duration = 1000 // ms
    const steps = 30
    const increment = numericValue / steps
    let current = 0
    let step = 0

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        step++
        current = Math.min(Math.round(increment * step), numericValue)
        setDisplayValue(current)

        if (step >= steps) {
          clearInterval(interval)
          setDisplayValue(numericValue)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [numericValue, delay])

  return (
    <div
      className={cn(
        'admin-card group relative overflow-hidden p-6',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-8 translate-x-8 opacity-30">
        <div className={cn(
          'w-full h-full rounded-full blur-2xl transition-opacity',
          colors.glow,
          'opacity-0 group-hover:opacity-100'
        )} />
      </div>

      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p className="font-accent text-[11px] text-ink-soft/70 uppercase tracking-[0.15em] mb-3">
            {title}
          </p>

          {/* Value */}
          <div className="flex items-baseline gap-1">
            <p className="font-display text-4xl text-forest tabular-nums tracking-tight">
              {displayValue}
            </p>
            {typeof value === 'string' && value.includes('/') && (
              <span className="font-accent text-lg text-ink-soft/40">
                {value.split('/')[1] ? `/${value.split('/')[1]}` : ''}
              </span>
            )}
          </div>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={cn(
                'flex items-center gap-0.5 text-xs font-accent',
                trend.value >= 0 ? 'text-sage' : 'text-blush-deep'
              )}>
                {trend.value >= 0 ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-[11px] text-ink-soft/50">{trend.label}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={cn(
          'relative w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300',
          colors.iconBg,
          colors.iconBorder,
          'group-hover:scale-105 group-hover:shadow-lg'
        )}>
          <span className={cn('transition-colors', colors.iconColor)}>
            {icon}
          </span>
          {/* Icon glow */}
          <div className={cn(
            'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity',
            colors.glow
          )} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={cn(
        'absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500',
        accentColor === 'gold' && 'bg-gradient-to-r from-transparent via-gold/40 to-transparent',
        accentColor === 'sage' && 'bg-gradient-to-r from-transparent via-sage/40 to-transparent',
        accentColor === 'blush' && 'bg-gradient-to-r from-transparent via-blush-deep/40 to-transparent',
        accentColor === 'forest' && 'bg-gradient-to-r from-transparent via-forest/30 to-transparent'
      )} />
    </div>
  )
}
