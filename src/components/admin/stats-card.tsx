import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-forest/10 p-6 transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-accent text-sm text-ink-soft uppercase tracking-wider">
            {title}
          </p>
          <p className="font-display text-3xl text-forest mt-2">
            {value}
          </p>
          {trend && (
            <p className={cn(
              'text-sm mt-2',
              trend.value >= 0 ? 'text-sage' : 'text-blush-deep'
            )}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
          {icon}
        </div>
      </div>
    </div>
  )
}
