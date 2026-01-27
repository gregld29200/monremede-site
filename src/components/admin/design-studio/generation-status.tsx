'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { GenerationStatus as Status, TaskStatusResponse } from '@/types/design-studio'

interface GenerationStatusProps {
  taskId: string | null
  documentId: string | null
  onComplete: (resultUrl: string) => void
  onError: (error: string) => void
}

// Stage configuration for the generation process
const stages = [
  { key: 'queued', label: 'En file d\'attente', description: 'Votre demande a été reçue' },
  { key: 'generating', label: 'Génération', description: 'L\'IA crée votre image' },
  { key: 'complete', label: 'Terminé', description: 'Image prête' },
]

export function GenerationStatus({ taskId, documentId, onComplete, onError }: GenerationStatusProps) {
  const [status, setStatus] = useState<Status>('pending')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const pollStatus = useCallback(async () => {
    if (!taskId) return

    try {
      const response = await fetch(`/api/gestion-mon-remede-oum/design-studio/status/${taskId}`)
      const data: TaskStatusResponse = await response.json()

      setStatus(data.status)
      if (data.progress) {
        setProgress(data.progress)
      }

      if (data.status === 'success' && data.resultUrl) {
        onComplete(data.resultUrl)
      } else if (data.status === 'failed') {
        const errMsg = data.error || 'La génération a échoué'
        setError(errMsg)
        onError(errMsg)
      }

      return data.status
    } catch (err) {
      console.error('Error polling status:', err)
      return null
    }
  }, [taskId, onComplete, onError])

  useEffect(() => {
    if (!taskId) return

    let isMounted = true
    let intervalId: NodeJS.Timeout

    const startPolling = async () => {
      const initialStatus = await pollStatus()

      if (!isMounted) return
      if (initialStatus === 'success' || initialStatus === 'failed') return

      intervalId = setInterval(async () => {
        const currentStatus = await pollStatus()
        if (currentStatus === 'success' || currentStatus === 'failed') {
          clearInterval(intervalId)
        }
      }, 2000)
    }

    const timeoutId = setTimeout(startPolling, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [taskId, pollStatus])

  if (!taskId) return null

  // Determine current stage
  const currentStageIndex = status === 'pending' ? 0 : status === 'generating' ? 1 : status === 'success' ? 2 : -1

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cream-warm to-cream border border-forest/10">
      {/* Animated background gradient for generating state */}
      {(status === 'pending' || status === 'generating') && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Success celebration background */}
      {status === 'success' && (
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-sage/5" />
      )}

      <div className="relative p-6">
        {/* Header with status icon */}
        <div className="flex items-start gap-4 mb-6">
          {/* Animated status indicator */}
          <div className={cn(
            'relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500',
            status === 'pending' && 'bg-gradient-to-br from-sage/30 to-sage/10',
            status === 'generating' && 'bg-gradient-to-br from-gold/30 to-gold/10',
            status === 'success' && 'bg-gradient-to-br from-forest/30 to-forest/10',
            status === 'failed' && 'bg-gradient-to-br from-blush-deep/30 to-blush-deep/10'
          )}>
            {/* Pulsing ring for active states */}
            {(status === 'pending' || status === 'generating') && (
              <div className="absolute inset-0 rounded-2xl animate-ping opacity-30 bg-current" style={{
                color: status === 'pending' ? 'rgb(139, 158, 126)' : 'rgb(196, 163, 90)'
              }} />
            )}

            {/* Status icons */}
            {(status === 'pending' || status === 'generating') && (
              <div className={cn(
                'w-7 h-7 border-[2.5px] rounded-full animate-spin',
                status === 'pending' ? 'border-sage/30 border-t-sage' : 'border-gold/30 border-t-gold'
              )} />
            )}
            {status === 'success' && (
              <svg className="w-7 h-7 text-forest animate-[scaleIn_0.3s_ease-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {status === 'failed' && (
              <svg className="w-7 h-7 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* Status text */}
          <div className="flex-1 pt-1">
            <h4 className={cn(
              'font-display text-lg font-medium tracking-tight transition-colors duration-300',
              status === 'pending' && 'text-sage',
              status === 'generating' && 'text-gold',
              status === 'success' && 'text-forest',
              status === 'failed' && 'text-blush-deep'
            )}>
              {status === 'pending' && 'En attente...'}
              {status === 'generating' && 'Création en cours...'}
              {status === 'success' && 'Image générée !'}
              {status === 'failed' && 'Échec de la génération'}
            </h4>
            <p className="font-body text-sm text-ink-soft/70 mt-0.5">
              {status === 'pending' && 'Votre demande est dans la file d\'attente'}
              {status === 'generating' && `Progression: ${progress}%`}
              {status === 'success' && 'L\'image est prête à être utilisée'}
              {status === 'failed' && error}
            </p>
          </div>
        </div>

        {/* Stage indicators - only show for non-failed states */}
        {status !== 'failed' && (
          <div className="relative mb-6">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-forest/10" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-gold via-gold to-gold/50 transition-all duration-700 ease-out"
              style={{ width: `${currentStageIndex >= 0 ? (currentStageIndex / 2) * 100 : 0}%` }}
            />

            {/* Stage dots */}
            <div className="relative flex justify-between">
              {stages.map((stage, index) => {
                const isComplete = currentStageIndex > index
                const isCurrent = currentStageIndex === index
                const isPending = currentStageIndex < index

                return (
                  <div key={stage.key} className="flex flex-col items-center">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500',
                      'border-2',
                      isComplete && 'bg-gold border-gold',
                      isCurrent && 'bg-cream border-gold shadow-lg shadow-gold/20',
                      isPending && 'bg-cream border-forest/20'
                    )}>
                      {isComplete ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : isCurrent ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-forest/20" />
                      )}
                    </div>
                    <span className={cn(
                      'mt-2 font-body text-xs transition-colors duration-300',
                      isComplete || isCurrent ? 'text-forest' : 'text-ink-soft/50'
                    )}>
                      {stage.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Progress bar - smooth animation */}
        {(status === 'pending' || status === 'generating') && (
          <div className="relative h-2 bg-forest/10 rounded-full overflow-hidden">
            {/* Animated shimmer background */}
            <div className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Actual progress */}
            <div
              className={cn(
                'absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out',
                status === 'generating'
                  ? 'bg-gradient-to-r from-gold via-gold-light to-gold'
                  : 'bg-gradient-to-r from-sage via-sage-light to-sage'
              )}
              style={{ width: `${Math.max(progress, status === 'pending' ? 15 : 25)}%` }}
            />

            {/* Glow effect at the end of progress */}
            <div
              className={cn(
                'absolute top-0 bottom-0 w-8 rounded-full blur-sm transition-all duration-700',
                status === 'generating' ? 'bg-gold/50' : 'bg-sage/50'
              )}
              style={{ left: `calc(${Math.max(progress, status === 'pending' ? 15 : 25)}% - 1rem)` }}
            />
          </div>
        )}

        {/* Success animation bar */}
        {status === 'success' && (
          <div className="relative h-2 bg-forest/10 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-forest via-sage to-forest rounded-full animate-[successPulse_2s_ease-in-out_infinite]" />
          </div>
        )}

        {/* Document ID reference */}
        {documentId && (
          <div className="mt-4 pt-4 border-t border-forest/5">
            <p className="font-mono text-xs text-ink-soft/40 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
              </svg>
              ID: {documentId.slice(0, 20)}...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
