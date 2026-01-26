'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ResultGalleryProps {
  resultUrl: string | null
  documentId: string | null
  targetDocumentId?: string
  onSetAsMain: () => Promise<void>
  onAddToGallery: () => Promise<void>
}

export function ResultGallery({
  resultUrl,
  documentId,
  targetDocumentId,
  onSetAsMain,
  onAddToGallery,
}: ResultGalleryProps) {
  const [uploading, setUploading] = useState<'main' | 'gallery' | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSetAsMain = async () => {
    setUploading('main')
    setError(null)
    try {
      await onSetAsMain()
      setSuccess('Image définie comme image principale')
    } catch (err) {
      setError('Erreur lors de la définition de l\'image')
      console.error(err)
    } finally {
      setUploading(null)
    }
  }

  const handleAddToGallery = async () => {
    setUploading('gallery')
    setError(null)
    try {
      await onAddToGallery()
      setSuccess('Image ajoutée à la galerie')
    } catch (err) {
      setError('Erreur lors de l\'ajout à la galerie')
      console.error(err)
    } finally {
      setUploading(null)
    }
  }

  const handleDownload = async () => {
    if (!resultUrl) return

    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-${documentId || 'image'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  if (!resultUrl) return null

  return (
    <div className="space-y-4">
      <h3 className="font-accent text-sm text-forest uppercase tracking-wider">
        Résultat
      </h3>

      {/* Image preview */}
      <div className="relative rounded-xl overflow-hidden bg-cream border border-forest/10">
        <Image
          src={resultUrl}
          alt="Generated image"
          width={800}
          height={450}
          className="w-full h-auto"
          unoptimized
        />
      </div>

      {/* Success message */}
      {success && (
        <div className="p-3 bg-sage/20 border border-sage/30 rounded-lg">
          <p className="font-body text-sm text-forest flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-blush-deep/20 border border-blush-deep/30 rounded-lg">
          <p className="font-body text-sm text-blush-deep">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {targetDocumentId && (
          <>
            <button
              onClick={handleSetAsMain}
              disabled={uploading !== null}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl font-body text-sm transition-all',
                'bg-gold text-white hover:bg-gold/90',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {uploading === 'main' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Téléchargement...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Définir comme principale</span>
                </>
              )}
            </button>

            <button
              onClick={handleAddToGallery}
              disabled={uploading !== null}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl font-body text-sm transition-all',
                'bg-forest text-cream hover:bg-forest-deep',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {uploading === 'gallery' ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  <span>Téléchargement...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Ajouter à la galerie</span>
                </>
              )}
            </button>
          </>
        )}

        <button
          onClick={handleDownload}
          className={cn(
            'px-4 py-3 rounded-xl font-body text-sm transition-all',
            'border border-forest/20 text-forest hover:bg-cream-warm',
            'flex items-center justify-center gap-2',
            !targetDocumentId && 'flex-1'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Télécharger</span>
        </button>
      </div>
    </div>
  )
}
