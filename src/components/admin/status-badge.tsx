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
          return { label: 'Actif', color: 'bg-[#d1fae5] text-[#059669] border-[#a7f3d0]' }
        case 'pause':
          return { label: 'En pause', color: 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]' }
        case 'archive':
          return { label: 'Archive', color: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]' }
        default:
          return { label: status, color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' }
      }
    }

    if (type === 'prospect') {
      switch (status) {
        case 'nouveau':
          return { label: 'Nouveau', color: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]' }
        case 'contacte':
          return { label: 'Contacte', color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' }
        case 'discussion':
          return { label: 'En discussion', color: 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]' }
        case 'converti':
          return { label: 'Converti', color: 'bg-[#d1fae5] text-[#059669] border-[#a7f3d0]' }
        case 'non_interesse':
          return { label: 'Non interesse', color: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]' }
        default:
          return { label: status, color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' }
      }
    }

    if (type === 'profile') {
      switch (status) {
        case 'equilibre':
          return { label: 'Equilibre', color: 'bg-[#d1fae5] text-[#059669] border-[#a7f3d0]' }
        case 'alerte':
          return { label: 'En Alerte', color: 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]' }
        case 'difficulte':
          return { label: 'En Difficulte', color: 'bg-[#fed7aa] text-[#c2410c] border-[#fdba74]' }
        case 'urgent':
          return { label: 'Urgent', color: 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]' }
        default:
          return { label: status || 'Non evalue', color: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]' }
      }
    }

    return { label: status, color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' }
  }

  const config = getStatusConfig()

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}
