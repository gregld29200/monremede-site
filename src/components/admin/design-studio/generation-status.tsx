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
      // Initial poll after a short delay
      const initialStatus = await pollStatus()

      if (!isMounted) return
      if (initialStatus === 'success' || initialStatus === 'failed') return

      // Poll every 2 seconds until complete
      intervalId = setInterval(async () => {
        const currentStatus = await pollStatus()
        if (currentStatus === 'success' || currentStatus === 'failed') {
          clearInterval(intervalId)
        }
      }, 2000)
    }

    // Use setTimeout to avoid synchronous setState in effect
    const timeoutId = setTimeout(startPolling, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [taskId, pollStatus])

  if (!taskId) return null

  return (
    <div className="p-6 bg-cream-warm rounded-xl border border-forest/10">
      <div className="flex items-center gap-4">
        {/* Status icon */}
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          status === 'pending' && 'bg-sage/20',
          status === 'generating' && 'bg-gold/20',
          status === 'success' && 'bg-sage/30',
          status === 'failed' && 'bg-blush-deep/20'
        )}>
          {(status === 'pending' || status === 'generating') && (
            <div className="w-6 h-6 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
          )}
          {status === 'success' && (
            <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === 'failed' && (
            <svg className="w-6 h-6 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Status text */}
        <div className="flex-1">
          <h4 className="font-display text-sm text-forest font-medium">
            {status === 'pending' && 'En attente...'}
            {status === 'generating' && 'Génération en cours...'}
            {status === 'success' && 'Image générée !'}
            {status === 'failed' && 'Échec de la génération'}
          </h4>
          <p className="font-body text-xs text-ink-soft/70 mt-0.5">
            {status === 'pending' && 'Votre demande est dans la file d\'attente'}
            {status === 'generating' && `Progression: ${progress}%`}
            {status === 'success' && 'L\'image est prête à être utilisée'}
            {status === 'failed' && error}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {(status === 'pending' || status === 'generating') && (
        <div className="mt-4">
          <div className="h-2 bg-forest/10 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                status === 'generating' ? 'bg-gold' : 'bg-sage'
              )}
              style={{ width: `${Math.max(progress, status === 'pending' ? 10 : 20)}%` }}
            />
          </div>
        </div>
      )}

      {/* Document ID for reference */}
      {documentId && (
        <p className="mt-3 font-mono text-xs text-ink-soft/50">
          ID: {documentId}
        </p>
      )}
    </div>
  )
}
