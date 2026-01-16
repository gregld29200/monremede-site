import type { ClientNote } from '@/types/admin'

interface NoteTimelineProps {
  notes: ClientNote[]
}

const noteTypeConfig: Record<string, { icon: string; color: string }> = {
  general: { icon: '📝', color: 'bg-forest/10' },
  appel: { icon: '📞', color: 'bg-sage/20' },
  email: { icon: '📧', color: 'bg-blush/20' },
  consultation: { icon: '🩺', color: 'bg-gold/20' },
  important: { icon: '⚠️', color: 'bg-red-100' },
}

export function NoteTimeline({ notes }: NoteTimelineProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-ink-soft">
        <p>Aucune note pour le moment</p>
        <p className="text-sm mt-1">Ajoutez une note ci-dessus</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const config = noteTypeConfig[note.type] || noteTypeConfig.general
        return (
          <div key={note._id} className="flex gap-4">
            <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-lg">{config.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg border border-forest/10 p-4">
                <p className="text-forest whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-ink-soft mt-2">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
