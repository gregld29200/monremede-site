'use client'

import { useState, useEffect } from 'react'
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showImage, setShowImage] = useState(false)

  // Trigger entrance animation when image loads
  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => setShowImage(true), 100)
      return () => clearTimeout(timer)
    }
  }, [imageLoaded])

  // Reset states when resultUrl changes
  useEffect(() => {
    setImageLoaded(false)
    setShowImage(false)
    setSuccess(null)
    setError(null)
  }, [resultUrl])

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-base text-forest font-medium tracking-tight">
            Résultat
          </h3>
          <p className="font-body text-xs text-ink-soft/60">
            Votre image générée par IA
          </p>
        </div>
      </div>

      {/* Image preview with elegant frame */}
      <div className="relative group">
        {/* Decorative frame */}
        <div className="absolute -inset-3 bg-gradient-to-br from-gold/10 via-transparent to-sage/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className={cn(
          'relative rounded-2xl overflow-hidden bg-gradient-to-br from-cream-warm to-cream',
          'border border-forest/10 shadow-xl shadow-forest/5',
          'transition-all duration-700',
          showImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}>
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-warm">
              <div className="w-12 h-12 border-3 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          )}

          <Image
            src={resultUrl}
            alt="Generated image"
            width={800}
            height={450}
            className={cn(
              'w-full h-auto transition-all duration-500',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            unoptimized
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover overlay with quick actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-forest text-sm font-body flex items-center gap-2 hover:bg-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Télécharger
              </button>
            </div>
          </div>

          {/* Success sparkle effect */}
          {showImage && (
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success message with animation */}
      {success && (
        <div className="p-4 bg-gradient-to-r from-sage/20 to-sage/10 border border-sage/30 rounded-2xl animate-[fadeSlideUp_0.3s_ease-out]">
          <p className="font-body text-sm text-forest flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            {success}
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-blush/30 to-blush/10 border border-blush-deep/20 rounded-2xl">
          <p className="font-body text-sm text-blush-deep flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blush-deep/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            {error}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {targetDocumentId && (
          <>
            {/* Set as main image - Primary CTA */}
            <button
              onClick={handleSetAsMain}
              disabled={uploading !== null}
              className={cn(
                'group flex-1 relative px-5 py-3.5 rounded-2xl font-body text-sm transition-all duration-300',
                'bg-gradient-to-r from-gold to-gold/90 text-white',
                'hover:shadow-lg hover:shadow-gold/25 hover:-translate-y-0.5',
                'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
                'flex items-center justify-center gap-2.5 overflow-hidden'
              )}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {uploading === 'main' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="relative">Téléchargement...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <span className="relative">Définir comme principale</span>
                </>
              )}
            </button>

            {/* Add to gallery - Secondary */}
            <button
              onClick={handleAddToGallery}
              disabled={uploading !== null}
              className={cn(
                'group flex-1 relative px-5 py-3.5 rounded-2xl font-body text-sm transition-all duration-300',
                'bg-gradient-to-r from-forest to-forest-deep text-cream',
                'hover:shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5',
                'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
                'flex items-center justify-center gap-2.5 overflow-hidden'
              )}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {uploading === 'gallery' ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  <span className="relative">Téléchargement...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="relative">Ajouter à la galerie</span>
                </>
              )}
            </button>
          </>
        )}

        {/* Download button - Tertiary when other actions exist */}
        {!targetDocumentId && (
          <button
            onClick={handleDownload}
            className={cn(
              'group flex-1 relative px-5 py-3.5 rounded-2xl font-body text-sm transition-all duration-300',
              'bg-gradient-to-br from-cream-warm to-cream border border-forest/15 text-forest',
              'hover:border-forest/25 hover:shadow-md hover:shadow-forest/5 hover:-translate-y-0.5',
              'flex items-center justify-center gap-2.5'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Télécharger l&apos;image</span>
          </button>
        )}
      </div>

      {/* Metadata footer */}
      {documentId && (
        <div className="pt-4 border-t border-forest/5">
          <div className="flex items-center justify-between text-xs text-ink-soft/40 font-mono">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              {documentId.slice(0, 16)}...
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Nano Banana Pro
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
