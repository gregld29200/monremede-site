'use client'

import { useState } from 'react'
import type {
  CreateTelegramChannelInput,
  TelegramChannel,
  UpdateTelegramChannelInput,
} from '@/types/telegram'

interface TelegramChannelManagerProps {
  channels: TelegramChannel[]
  onCreate: (input: CreateTelegramChannelInput) => Promise<void>
  onUpdate: (id: string, input: UpdateTelegramChannelInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const INITIAL_FORM: CreateTelegramChannelInput = {
  title: '',
  chatId: '',
  username: '',
  description: '',
  isActive: true,
}

export function TelegramChannelManager({
  channels,
  onCreate,
  onUpdate,
  onDelete,
}: TelegramChannelManagerProps) {
  const [form, setForm] = useState<CreateTelegramChannelInput>(INITIAL_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyChannelId, setBusyChannelId] = useState<string | null>(null)

  function resetForm() {
    setForm(INITIAL_FORM)
    setEditingId(null)
    setError(null)
  }

  function loadChannel(channel: TelegramChannel) {
    setEditingId(channel._id)
    setError(null)
    setForm({
      title: channel.title,
      chatId: channel.chatId,
      username: channel.username || '',
      description: channel.description || '',
      isActive: channel.isActive !== false,
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (editingId) {
        await onUpdate(editingId, form)
      } else {
        await onCreate(form)
      }

      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’enregistrer le canal.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggle(channel: TelegramChannel) {
    setBusyChannelId(channel._id)

    try {
      await onUpdate(channel._id, { isActive: channel.isActive === false })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de mettre à jour le canal.')
    } finally {
      setBusyChannelId(null)
    }
  }

  async function handleDelete(channel: TelegramChannel) {
    if (!window.confirm(`Supprimer définitivement le canal "${channel.title}" ?`)) {
      return
    }

    setBusyChannelId(channel._id)

    try {
      await onDelete(channel._id)

      if (editingId === channel._id) {
        resetForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de supprimer le canal.')
    } finally {
      setBusyChannelId(null)
    }
  }

  const sortedChannels = [...channels].sort((a, b) => {
    if ((a.isActive !== false) === (b.isActive !== false)) {
      return a.title.localeCompare(b.title, 'fr')
    }

    return a.isActive === false ? 1 : -1
  })

  return (
    <section className="admin-card p-6 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/50">Configuration</p>
        <h2 className="mt-2 text-2xl font-display text-forest">Canaux Telegram</h2>
        <p className="mt-2 text-sm text-ink-soft/70">
          Ajoutez les canaux où le bot est déjà administrateur avec le droit de publier.
        </p>
      </div>

      <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-ink-soft/80">
        Le bot doit être admin du canal avec le droit <span className="font-medium text-forest">can_post_messages</span>.
        Utilisez soit un <span className="font-medium text-forest">@username</span>, soit le chat ID numérique.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-forest">Nom du canal</label>
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Canal principal"
            className="admin-input"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-forest">Chat ID ou @username</label>
          <input
            type="text"
            value={form.chatId}
            onChange={(event) => setForm((current) => ({ ...current, chatId: event.target.value }))}
            placeholder="@monremede ou -1001234567890"
            className="admin-input"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-forest">Username public</label>
          <input
            type="text"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            placeholder="monremede"
            className="admin-input"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-forest">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={3}
            placeholder="Ex: canal FR principal, audience clientes, annonces nutrition…"
            className="admin-input resize-none"
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-forest/10 bg-forest/5 px-4 py-3">
          <input
            type="checkbox"
            checked={form.isActive !== false}
            onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold/30"
          />
          <span className="text-sm text-forest">Canal actif pour les prochains envois</span>
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Ajouter le canal'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="admin-btn-secondary"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-soft/60">
            Canaux enregistrés
          </h3>
          <span className="text-sm text-ink-soft/60">{channels.length}</span>
        </div>

        {sortedChannels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-forest/15 bg-forest/[0.02] p-6 text-sm text-ink-soft/70">
            Aucun canal configuré pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedChannels.map((channel) => (
              <div
                key={channel._id}
                className="rounded-2xl border border-forest/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium text-forest">{channel.title}</h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] ${
                          channel.isActive === false
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {channel.isActive === false ? 'pause' : 'actif'}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-ink-soft/70">{channel.chatId}</p>
                    {channel.username && (
                      <p className="mt-1 text-xs text-ink-soft/60">@{channel.username}</p>
                    )}
                    {channel.description && (
                      <p className="mt-3 text-sm text-ink-soft/80">{channel.description}</p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => loadChannel(channel)}
                      className="text-sm text-forest hover:text-gold transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleToggle(channel)}
                      disabled={busyChannelId === channel._id}
                      className="text-sm text-ink-soft/70 hover:text-forest transition-colors disabled:opacity-50"
                    >
                      {channel.isActive === false ? 'Réactiver' : 'Mettre en pause'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(channel)}
                      disabled={busyChannelId === channel._id}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

