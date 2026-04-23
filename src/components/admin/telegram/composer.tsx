'use client'

import { useEffect, useState } from 'react'
import {
  buildDefaultTelegramButton,
  buildDefaultTelegramMessage,
  getTelegramImageUrl,
} from '@/lib/telegram-content'
import type {
  TelegramChannel,
  TelegramContentItem,
  TelegramSendResponse,
  TelegramSourceType,
} from '@/types/telegram'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface TelegramComposerProps {
  channels: TelegramChannel[]
  onSent: () => Promise<void> | void
}

type ContentResponse = {
  posts?: TelegramContentItem[]
  recipes?: TelegramContentItem[]
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue.')
  }

  return data as T
}

export function TelegramComposer({ channels, onSent }: TelegramComposerProps) {
  const [sourceType, setSourceType] = useState<TelegramSourceType>('post')
  const [sourceId, setSourceId] = useState('')
  const [posts, setPosts] = useState<TelegramContentItem[]>([])
  const [recipes, setRecipes] = useState<TelegramContentItem[]>([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [buttonLabel, setButtonLabel] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [disableNotification, setDisableNotification] = useState(false)
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([])
  const [isLoadingSources, setIsLoadingSources] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSources() {
      setIsLoadingSources(true)

      try {
        const [postsResponse, recipesResponse] = await Promise.all([
          fetch(`${API_ADMIN_PATH}/blog?status=published&limit=100`, { cache: 'no-store' }),
          fetch(`${API_ADMIN_PATH}/recettes?status=published&limit=100`, { cache: 'no-store' }),
        ])

        const postsData = await readJson<ContentResponse>(postsResponse)
        const recipesData = await readJson<ContentResponse>(recipesResponse)

        setPosts(postsData.posts || [])
        setRecipes(recipesData.recipes || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les contenus à partager.')
      } finally {
        setIsLoadingSources(false)
      }
    }

    void fetchSources()
  }, [])

  useEffect(() => {
    const activeChannelIds = channels.map((channel) => channel._id)

    setSelectedChannelIds((current) => {
      if (current.length === 0) {
        return activeChannelIds
      }

      return current.filter((id) => activeChannelIds.includes(id))
    })
  }, [channels])

  function getCurrentOptions() {
    return sourceType === 'recipe' ? recipes : posts
  }

  function applyContentPreset(content: TelegramContentItem) {
    const button = buildDefaultTelegramButton(content)

    setTitle(content.title)
    setMessage(buildDefaultTelegramMessage(content))
    setButtonLabel(button.label)
    setButtonUrl(button.url)
    setImageUrl(getTelegramImageUrl(content))
  }

  function handleSourceTypeChange(nextType: TelegramSourceType) {
    setSourceType(nextType)
    setSourceId('')
    setError(null)
    setSuccess(null)
  }

  function handleSelectSource(nextId: string) {
    setSourceId(nextId)

    if (!nextId) {
      return
    }

    const selected = getCurrentOptions().find((item) => item._id === nextId)

    if (selected) {
      applyContentPreset(selected)
    }
  }

  function toggleChannel(channelId: string) {
    setSelectedChannelIds((current) =>
      current.includes(channelId)
        ? current.filter((id) => id !== channelId)
        : [...current, channelId]
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_ADMIN_PATH}/telegram/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceType,
          sourceId: sourceType === 'custom' ? undefined : sourceId || undefined,
          title,
          message,
          buttonLabel,
          buttonUrl,
          imageUrl,
          channelIds: selectedChannelIds,
          disableNotification,
        }),
      })

      const data = await readJson<TelegramSendResponse>(response)
      const successCount = data.results?.filter((result) => result.status === 'success').length || 0
      const totalCount = data.results?.length || 0

      if (data.status === 'failed') {
        throw new Error('Aucun message n’a pu être livré. Vérifiez les droits du bot et les chat IDs.')
      }

      setSuccess(
        data.status === 'partial'
          ? `Envoi partiel : ${successCount}/${totalCount} canaux ont reçu le message.`
          : `Message envoyé sur ${successCount} canal${successCount > 1 ? 'aux' : ''}.`
      )

      await onSent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’envoyer le post Telegram.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentOptions = getCurrentOptions()
  const combinedText = [title.trim(), message.trim()].filter(Boolean).join('\n\n')
  const willSendWithPhoto = Boolean(imageUrl.trim()) && combinedText.length <= 1024

  return (
    <section className="admin-card p-6 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/50">Diffusion</p>
        <h2 className="mt-2 text-2xl font-display text-forest">Composer un post Telegram</h2>
        <p className="mt-2 text-sm text-ink-soft/70">
          Sélectionnez un article, une recette ou rédigez un message libre, puis diffusez-le vers plusieurs canaux d’un seul coup.
        </p>
      </div>

      <div className="rounded-xl border border-forest/10 bg-forest/[0.03] p-4 text-sm text-ink-soft/80">
        Variable requise côté serveur : <span className="font-medium text-forest">TELEGRAM_BOT_TOKEN</span>.
        Si une image est définie et que le texte total tient sous 1024 caractères, l’envoi partira en <span className="font-medium text-forest">photo + légende</span>.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-forest">Source</label>
            <select
              value={sourceType}
              onChange={(event) => handleSourceTypeChange(event.target.value as TelegramSourceType)}
              className="admin-input admin-select"
            >
              <option value="post">Article publié</option>
              <option value="recipe">Recette publiée</option>
              <option value="custom">Message libre</option>
            </select>
          </div>

          {sourceType !== 'custom' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-forest">
                {sourceType === 'post' ? 'Article' : 'Recette'}
              </label>
              <select
                value={sourceId}
                onChange={(event) => handleSelectSource(event.target.value)}
                disabled={isLoadingSources}
                className="admin-input admin-select"
              >
                <option value="">
                  {isLoadingSources ? 'Chargement…' : `Choisir ${sourceType === 'post' ? 'un article' : 'une recette'}`}
                </option>
                {currentOptions.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-forest">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titre du post Telegram"
            className="admin-input"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label className="block text-sm font-medium text-forest">Message</label>
            <span className="text-xs text-ink-soft/60">{combinedText.length}/4096</span>
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={8}
            placeholder="Rédigez le message à publier dans les canaux Telegram…"
            className="admin-input resize-y"
          />
          <p className="mt-2 text-xs text-ink-soft/60">
            Mode d’envoi estimé : {willSendWithPhoto ? 'photo + légende' : imageUrl.trim() ? 'texte seul (message trop long pour une légende)' : 'texte seul'}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-forest">Texte du bouton</label>
            <input
              type="text"
              value={buttonLabel}
              onChange={(event) => setButtonLabel(event.target.value)}
              placeholder="Lire l’article"
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-forest">URL du bouton</label>
            <input
              type="url"
              value={buttonUrl}
              onChange={(event) => setButtonUrl(event.target.value)}
              placeholder="https://www.monremede.com/blog/..."
              className="admin-input"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-forest">URL de l’image</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://cdn.sanity.io/images/..."
            className="admin-input"
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-forest/10 bg-forest/[0.03] px-4 py-3">
          <input
            type="checkbox"
            checked={disableNotification}
            onChange={(event) => setDisableNotification(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold/30"
          />
          <span className="text-sm text-forest">Envoyer sans son (notification silencieuse)</span>
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-soft/60">
              Canaux ciblés
            </h3>
            <span className="text-sm text-ink-soft/60">
              {selectedChannelIds.length}/{channels.length}
            </span>
          </div>

          {channels.length === 0 ? (
            <div className="rounded-xl border border-dashed border-forest/15 bg-forest/[0.02] p-6 text-sm text-ink-soft/70">
              Activez au moins un canal pour pouvoir publier.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => (
                <label
                  key={channel._id}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                    selectedChannelIds.includes(channel._id)
                      ? 'border-gold/40 bg-gold/5'
                      : 'border-forest/10 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedChannelIds.includes(channel._id)}
                    onChange={() => toggleChannel(channel._id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold/30"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-forest">{channel.title}</span>
                    <span className="block text-xs text-ink-soft/60">{channel.chatId}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || selectedChannelIds.length === 0}
            className="admin-btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Envoi en cours…' : 'Publier sur Telegram'}
          </button>

          <button
            type="button"
            onClick={() => {
              setSourceType('post')
              setSourceId('')
              setTitle('')
              setMessage('')
              setButtonLabel('')
              setButtonUrl('')
              setImageUrl('')
              setDisableNotification(false)
              setError(null)
              setSuccess(null)
            }}
            className="admin-btn-secondary"
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </section>
  )
}

