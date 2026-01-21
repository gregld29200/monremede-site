'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../BlockEditorContext'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

export function ImageUploadModal() {
  const { state, insertImageBlock, hideImageUploadModal, deleteBlock } = useBlockEditorContext()

  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [uploadedAssetRef, setUploadedAssetRef] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle escape key to close modal
  useEffect(() => {
    if (!state.showImageUploadModal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.showImageUploadModal])

  // Handle click outside to close
  useEffect(() => {
    if (!state.showImageUploadModal) return

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [state.showImageUploadModal])

  // Reset state when modal opens
  useEffect(() => {
    if (state.showImageUploadModal) {
      setPreviewUrl(null)
      setAltText('')
      setUploadedAssetRef(null)
      setError(null)
      setIsUploading(false)
    }
  }, [state.showImageUploadModal])

  const handleClose = useCallback(() => {
    // If we have a target block and we're canceling, delete it if it was an empty placeholder
    hideImageUploadModal()
  }, [hideImageUploadModal])

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Type de fichier non support\u00e9. Utilisez JPG, PNG, GIF ou WebP.')
      setIsUploading(false)
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum 5 Mo.')
      setIsUploading(false)
      return
    }

    // Create local preview
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_ADMIN_PATH}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors du t\u00e9l\u00e9chargement')
      }

      const data = await response.json()
      setUploadedAssetRef(data.asset._ref)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du t\u00e9l\u00e9chargement')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleInsert = useCallback(() => {
    if (!uploadedAssetRef) return

    // Delete the target block if it exists (we're replacing it)
    if (state.imageUploadTargetBlockId) {
      deleteBlock(state.imageUploadTargetBlockId)
    }

    // Insert the new image block
    insertImageBlock(uploadedAssetRef, altText, state.imageUploadTargetBlockId)
    hideImageUploadModal()
  }, [uploadedAssetRef, altText, state.imageUploadTargetBlockId, insertImageBlock, hideImageUploadModal, deleteBlock])

  if (!state.showImageUploadModal) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest/10">
          <h3 className="font-accent text-lg text-forest">Ins\u00e9rer une image</h3>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-forest/5 transition-colors"
          >
            <svg className="w-5 h-5 text-ink-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Upload zone */}
          <div
            className={cn(
              'relative border-2 border-dashed rounded-xl transition-all duration-200',
              isDragging
                ? 'border-gold bg-gold/5'
                : 'border-forest/20 hover:border-forest/40',
              previewUrl && 'border-solid border-forest/10'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {previewUrl ? (
              // Image preview
              <div className="relative aspect-video">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded-xl"
                />
                {/* Loading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      <span className="font-body text-sm text-forest">T\u00e9l\u00e9chargement...</span>
                    </div>
                  </div>
                )}
                {/* Change image button */}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-white/90 text-forest rounded-lg font-body text-xs hover:bg-white transition-colors shadow-sm"
                  >
                    Changer
                  </button>
                )}
              </div>
            ) : (
              // Empty state / drop zone
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 flex flex-col items-center justify-center gap-3 cursor-pointer"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <span className="font-body text-sm text-forest">T\u00e9l\u00e9chargement...</span>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-forest/5 flex items-center justify-center">
                      <svg className="w-7 h-7 text-forest/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-body text-sm text-forest">
                        Glissez une image ici
                      </p>
                      <p className="font-body text-sm text-forest mt-1">
                        ou <span className="text-gold cursor-pointer">cliquez pour choisir</span>
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Format info */}
          <p className="font-body text-xs text-ink-soft/50 text-center">
            Formats: JPEG, PNG, GIF, WebP \u2022 Taille max: 5 MB
          </p>

          {/* Alt text input */}
          <div>
            <label className="block font-accent text-sm text-forest tracking-wide mb-1.5">
              Alt text (accessibilit\u00e9)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="D\u00e9crivez cette image..."
              className="w-full px-3 py-2.5 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-forest/10 bg-cream/30">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 font-body text-sm text-ink-soft hover:text-forest transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!uploadedAssetRef || isUploading}
            className={cn(
              'px-5 py-2 rounded-lg font-body text-sm transition-all',
              uploadedAssetRef && !isUploading
                ? 'bg-gold text-white hover:bg-gold/90'
                : 'bg-forest/10 text-forest/40 cursor-not-allowed'
            )}
          >
            Ins\u00e9rer
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>,
    document.body
  )
}
