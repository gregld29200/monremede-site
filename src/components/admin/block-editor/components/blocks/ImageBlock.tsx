'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../../BlockEditorContext'
import type { EditorBlock } from '../../types'
import { getSanityImageUrl } from '../../utils'

interface ImageBlockProps {
  block: EditorBlock
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { state, dispatch } = useBlockEditorContext()
  const [isEditing, setIsEditing] = useState(false)
  const [caption, setCaption] = useState(block.data.caption || '')

  const isFocused = state.focusedBlockId === block.id
  const imageUrl = getSanityImageUrl(block.data.asset?._ref)

  // Handle focus
  const handleClick = useCallback(() => {
    dispatch({ type: 'SET_FOCUS', blockId: block.id })
  }, [block.id, dispatch])

  // Handle caption change
  const handleCaptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value)
    // TODO: Update block data with new caption
  }, [])

  const handleCaptionBlur = useCallback(() => {
    setIsEditing(false)
    // TODO: Save caption to block data
  }, [])

  if (!imageUrl) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'py-4 px-6 rounded-lg border-2 border-dashed border-forest/20 bg-cream-warm/30',
          'flex flex-col items-center justify-center text-center min-h-[150px]',
          isFocused && 'border-gold/50 bg-gold/5'
        )}
      >
        <svg
          className="w-10 h-10 text-forest/30 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="font-body text-sm text-forest/50">Image non disponible</p>
        <p className="font-body text-xs text-forest/30 mt-1">
          Réf: {block.data.asset?._ref || 'inconnue'}
        </p>
      </div>
    )
  }

  return (
    <figure
      onClick={handleClick}
      className={cn(
        'py-2 rounded-lg transition-colors',
        isFocused && 'bg-cream-warm/30'
      )}
    >
      {/* Image container */}
      <div className="relative rounded-lg overflow-hidden bg-cream-warm/50">
        <Image
          src={imageUrl}
          alt={block.data.alt || ''}
          width={800}
          height={450}
          className="w-full h-auto object-contain"
          unoptimized // Using Sanity CDN directly
        />
      </div>

      {/* Caption */}
      {(block.data.caption || isEditing || isFocused) && (
        <figcaption className="mt-2 text-center">
          {isEditing ? (
            <input
              type="text"
              value={caption}
              onChange={handleCaptionChange}
              onBlur={handleCaptionBlur}
              placeholder="Ajouter une légende..."
              className="w-full text-center font-body text-sm text-ink-soft/70 bg-transparent border-b border-forest/20 focus:border-gold/50 outline-none px-2 py-1"
              autoFocus
            />
          ) : (
            <span
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              className={cn(
                'font-body text-sm text-ink-soft/70 cursor-text px-2 py-1 inline-block',
                !caption && 'text-ink-soft/40 italic'
              )}
            >
              {caption || (isFocused ? 'Cliquez pour ajouter une légende' : '')}
            </span>
          )}
        </figcaption>
      )}

      {/* Alt text indicator */}
      {isFocused && (
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-ink-soft/50">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Alt: {block.data.alt || 'Non défini'}</span>
        </div>
      )}
    </figure>
  )
}
