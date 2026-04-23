'use client'

import { useCallback, useEffect, useState } from 'react'
import { TelegramChannelManager } from './channel-manager'
import { TelegramComposer } from './composer'
import { TelegramHistory } from './history'
import type {
  CreateTelegramChannelInput,
  TelegramBroadcast,
  TelegramChannel,
  UpdateTelegramChannelInput,
} from '@/types/telegram'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue.')
  }

  return data as T
}

export function TelegramDashboard() {
  const [channels, setChannels] = useState<TelegramChannel[]>([])
  const [broadcasts, setBroadcasts] = useState<TelegramBroadcast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChannels = useCallback(async () => {
    const response = await fetch(`${API_ADMIN_PATH}/telegram/channels`, { cache: 'no-store' })
    const data = await readJson<{ channels: TelegramChannel[] }>(response)
    setChannels(data.channels || [])
  }, [])

  const fetchBroadcasts = useCallback(async () => {
    const response = await fetch(`${API_ADMIN_PATH}/telegram/broadcasts`, { cache: 'no-store' })
    const data = await readJson<{ broadcasts: TelegramBroadcast[] }>(response)
    setBroadcasts(data.broadcasts || [])
  }, [])

  const refreshDashboard = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      await Promise.all([fetchChannels(), fetchBroadcasts()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger la section Telegram.')
    } finally {
      setIsLoading(false)
    }
  }, [fetchBroadcasts, fetchChannels])

  useEffect(() => {
    void refreshDashboard()
  }, [refreshDashboard])

  async function handleCreateChannel(input: CreateTelegramChannelInput) {
    const response = await fetch(`${API_ADMIN_PATH}/telegram/channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    await readJson(response)
    await fetchChannels()
  }

  async function handleUpdateChannel(id: string, input: UpdateTelegramChannelInput) {
    const response = await fetch(`${API_ADMIN_PATH}/telegram/channels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    await readJson(response)
    await fetchChannels()
  }

  async function handleDeleteChannel(id: string) {
    const response = await fetch(`${API_ADMIN_PATH}/telegram/channels/${id}`, {
      method: 'DELETE',
    })

    await readJson(response)
    await fetchChannels()
  }

  const activeChannels = channels.filter((channel) => channel.isActive !== false)
  const totalDeliveries = broadcasts.reduce(
    (count, broadcast) => count + (broadcast.results?.length || 0),
    0
  )

  if (isLoading) {
    return (
      <div className="admin-card p-12 text-center">
        <div className="w-8 h-8 mx-auto border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="mt-4 text-sm text-ink-soft/70">Chargement de l’espace Telegram…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="admin-card border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void refreshDashboard()}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-100 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/50">Canaux actifs</p>
          <p className="mt-2 text-3xl font-semibold text-forest">{activeChannels.length}</p>
          <p className="mt-1 text-sm text-ink-soft/70">Prêts pour la diffusion</p>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/50">Envois récents</p>
          <p className="mt-2 text-3xl font-semibold text-forest">{broadcasts.length}</p>
          <p className="mt-1 text-sm text-ink-soft/70">Historique des 30 derniers posts</p>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/50">Livraisons</p>
          <p className="mt-2 text-3xl font-semibold text-forest">{totalDeliveries}</p>
          <p className="mt-1 text-sm text-ink-soft/70">Messages poussés vers les canaux</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <TelegramChannelManager
          channels={channels}
          onCreate={handleCreateChannel}
          onUpdate={handleUpdateChannel}
          onDelete={handleDeleteChannel}
        />

        <TelegramComposer
          channels={activeChannels}
          onSent={async () => {
            await fetchBroadcasts()
          }}
        />
      </div>

      <TelegramHistory broadcasts={broadcasts} />
    </div>
  )
}
