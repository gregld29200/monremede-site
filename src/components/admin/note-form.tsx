'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { NoteType } from '@/types/admin'

interface NoteFormProps {
  onSubmit: (content: string, type: NoteType) => Promise<void>
  isLoading?: boolean
}

const noteTypes: { value: NoteType; label: string; icon: string }[] = [
  { value: 'general', label: 'General', icon: '📝' },
  { value: 'appel', label: 'Appel', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'consultation', label: 'Consultation', icon: '🩺' },
  { value: 'important', label: 'Important', icon: '⚠️' },
]

export function NoteForm({ onSubmit, isLoading }: NoteFormProps) {
  const [content, setContent] = useState('')
  const [type, setType] = useState<NoteType>('general')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    await onSubmit(content, type)
    setContent('')
    setType('general')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-forest mb-2">
          Type de note
        </label>
        <div className="flex flex-wrap gap-2">
          {noteTypes.map((noteType) => (
            <button
              key={noteType.value}
              type="button"
              onClick={() => setType(noteType.value)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5 ${
                type === noteType.value
                  ? 'bg-gold text-forest-deep'
                  : 'bg-cream-warm text-forest hover:bg-gold/20'
              }`}
            >
              <span>{noteType.icon}</span>
              <span>{noteType.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-forest mb-2">
          Contenu
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
          placeholder="Ajouter une note..."
          required
        />
      </div>

      <Button type="submit" disabled={isLoading || !content.trim()} size="sm">
        {isLoading ? 'Ajout...' : 'Ajouter la note'}
      </Button>
    </form>
  )
}
