import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  type?: 'client' | 'prospect' | 'profile'
  className?: string
}

export function StatusBadge({ status, type = 'client', className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === 'client') {
      switch (status) {
        case 'actif':
          return { label: 'Actif', color: 'bg-sage/20 text-sage border-sage/30' }
        case 'pause':
          return { label: 'En pause', color: 'bg-gold/20 text-gold border-gold/30' }
        case 'archive':
          return { label: 'Archive', color: 'bg-forest/10 text-forest/60 border-forest/20' }
        default:
          return { label: status, color: 'bg-forest/10 text-forest border-forest/20' }
      }
    }

    if (type === 'prospect') {
      switch (status) {
        case 'nouveau':
          return { label: 'Nouveau', color: 'bg-gold/20 text-gold border-gold/30' }
        case 'contacte':
          return { label: 'Contacte', color: 'bg-sage/20 text-sage border-sage/30' }
        case 'discussion':
          return { label: 'En discussion', color: 'bg-blush/20 text-blush-deep border-blush/30' }
        case 'converti':
          return { label: 'Converti', color: 'bg-sage/30 text-forest border-sage/40' }
        case 'non_interesse':
          return { label: 'Non interesse', color: 'bg-forest/10 text-forest/60 border-forest/20' }
        default:
          return { label: status, color: 'bg-forest/10 text-forest border-forest/20' }
      }
    }

    if (type === 'profile') {
      switch (status) {
        case 'equilibre':
          return { label: 'Equilibre', color: 'bg-sage/20 text-sage border-sage/30' }
        case 'alerte':
          return { label: 'En Alerte', color: 'bg-gold/20 text-gold border-gold/30' }
        case 'difficulte':
          return { label: 'En Difficulte', color: 'bg-blush/20 text-blush-deep border-blush/30' }
        case 'urgent':
          return { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' }
        default:
          return { label: status || 'Non evalue', color: 'bg-forest/10 text-forest border-forest/20' }
      }
    }

    return { label: status, color: 'bg-forest/10 text-forest border-forest/20' }
  }

  const config = getStatusConfig()

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}
