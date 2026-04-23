import type { TelegramBroadcast } from '@/types/telegram'

interface TelegramHistoryProps {
  broadcasts: TelegramBroadcast[]
}

function formatDate(value?: string) {
  if (!value) {
    return 'Date inconnue'
  }

  return new Date(value).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getStatusLabel(status: TelegramBroadcast['status']) {
  if (status === 'success') {
    return 'Succès'
  }

  if (status === 'partial') {
    return 'Partiel'
  }

  return 'Échec'
}

function getStatusClass(status: TelegramBroadcast['status']) {
  if (status === 'success') {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (status === 'partial') {
    return 'bg-amber-100 text-amber-700'
  }

  return 'bg-red-100 text-red-700'
}

function previewMessage(message: string) {
  if (message.length <= 180) {
    return message
  }

  return `${message.slice(0, 177).trimEnd()}…`
}

export function TelegramHistory({ broadcasts }: TelegramHistoryProps) {
  return (
    <section className="admin-card p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/50">Historique</p>
          <h2 className="mt-2 text-2xl font-display text-forest">Derniers envois</h2>
        </div>
        <span className="text-sm text-ink-soft/60">{broadcasts.length} envoi(s)</span>
      </div>

      {broadcasts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-forest/15 bg-forest/[0.02] p-8 text-sm text-ink-soft/70">
          Aucun post Telegram envoyé pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {broadcasts.map((broadcast) => (
            <article
              key={broadcast._id}
              className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium text-forest">{broadcast.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] ${getStatusClass(broadcast.status)}`}>
                      {getStatusLabel(broadcast.status)}
                    </span>
                    <span className="rounded-full bg-forest/5 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-ink-soft/70">
                      {broadcast.sourceType}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft/80">{previewMessage(broadcast.message)}</p>
                </div>

                <div className="text-right text-sm text-ink-soft/60">
                  <p>{formatDate(broadcast.sentAt)}</p>
                  <p className="mt-1">{broadcast.results?.length || 0} canal(aux)</p>
                </div>
              </div>

              {broadcast.results && broadcast.results.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {broadcast.results.map((result) => (
                    <span
                      key={result._key}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                        result.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                      title={result.error || undefined}
                    >
                      <span>{result.status === 'success' ? '✓' : '!'}</span>
                      <span>{result.channelName}</span>
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

