'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../../BlockEditorContext'
import type { EditorBlock, ImageAlignment, ImageSize } from '../../types'
import { getSanityImageUrl } from '../../utils'
import { ImageOptionsToolbar } from '../ImageOptionsToolbar'

interface ImageBlockProps {
  block: EditorBlock
}

// CSS classes for alignment
const alignmentClasses: Record<ImageAlignment, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  full: 'w-full'
}

// CSS classes for size
const sizeClasses: Record<ImageSize, string> = {
  small: 'max-w-[40%]',
  medium: 'max-w-[70%]',
  large: 'w-full'
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { state, dispatch, deleteBlock, updateImageOptions } = useBlockEditorContext()
  const [isHovered, setIsHovered] = useState(false)
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [caption, setCaption] = useState(block.data.caption || '')
  const [isEditingAlt, setIsEditingAlt] = useState(false)
  const [altText, setAltText] = useState(block.data.alt || '')
  const captionInputRef = useRef<HTMLInputElement>(null)
  const altInputRef = useRef<HTMLInputElement>(null)

  const isFocused = state.focusedBlockId === block.id
  const imageUrl = getSanityImageUrl(block.data.asset?._ref)

  // Get current options with defaults
  const alignment: ImageAlignment = block.data.alignment || 'center'
  const size: ImageSize = block.data.size || 'medium'

  // Handle focus
  const handleClick = useCallback(() => {
    dispatch({ type: 'SET_FOCUS', blockId: block.id })
  }, [block.id, dispatch])

  // Handle caption change
  const handleCaptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value)
  }, [])

  const handleCaptionBlur = useCallback(() => {
    setIsEditingCaption(false)
    // Save caption to block data
    if (caption !== block.data.caption) {
      dispatch({
        type: 'UPDATE_BLOCK',
        blockId: block.id,
        updates: {
          data: {
            ...block.data,
            caption
          }
        }
      })
    }
  }, [caption, block.data, block.id, dispatch])

  const handleCaptionKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCaptionBlur()
    } else if (e.key === 'Escape') {
      setCaption(block.data.caption || '')
      setIsEditingCaption(false)
    }
  }, [handleCaptionBlur, block.data.caption])

  // Handle alt text change
  const handleAltChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(e.target.value)
  }, [])

  const handleAltBlur = useCallback(() => {
    setIsEditingAlt(false)
    // Save alt to block data
    if (altText !== block.data.alt) {
      dispatch({
        type: 'UPDATE_BLOCK',
        blockId: block.id,
        updates: {
          content: altText,
          data: {
            ...block.data,
            alt: altText
          }
        }
      })
    }
  }, [altText, block.data, block.id, dispatch])

  const handleAltKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAltBlur()
    } else if (e.key === 'Escape') {
      setAltText(block.data.alt || '')
      setIsEditingAlt(false)
    }
  }, [handleAltBlur, block.data.alt])

  // Focus caption input when editing
  useEffect(() => {
    if (isEditingCaption && captionInputRef.current) {
      captionInputRef.current.focus()
      captionInputRef.current.select()
    }
  }, [isEditingCaption])

  // Focus alt input when editing
  useEffect(() => {
    if (isEditingAlt && altInputRef.current) {
      altInputRef.current.focus()
      altInputRef.current.select()
    }
  }, [isEditingAlt])

  // Handle delete
  const handleDelete = useCallback(() => {
    if (window.confirm('Supprimer cette image ?')) {
      deleteBlock(block.id)
    }
  }, [block.id, deleteBlock])

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
          R\u00e9f: {block.data.asset?._ref || 'inconnue'}
        </p>
      </div>
    )
  }

  return (
    <figure
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'py-2 rounded-lg transition-colors relative',
        isFocused && 'bg-cream-warm/30'
      )}
    >
      {/* Toolbar on hover/focus */}
      {(isHovered || isFocused) && (
        <ImageOptionsToolbar
          blockId={block.id}
          currentAlignment={alignment}
          currentSize={size}
          onDelete={handleDelete}
        />
      )}

      {/* Image container with alignment and size */}
      <div
        className={cn(
          'relative rounded-lg overflow-hidden bg-cream-warm/50 transition-all',
          alignmentClasses[alignment],
          // Only apply size constraint if not full alignment
          alignment !== 'full' && sizeClasses[size]
        )}
      >
        <Image
          src={imageUrl}
          alt={block.data.alt || ''}
          width={800}
          height={450}
          className="w-full h-auto object-contain"
          unoptimized // Using Sanity CDN directly
        />

        {/* Focus ring */}
        {isFocused && (
          <div className="absolute inset-0 ring-2 ring-gold/50 ring-inset rounded-lg pointer-events-none" />
        )}
      </div>

      {/* Caption */}
      <figcaption className={cn(
        'mt-2 transition-all',
        alignment === 'center' && 'text-center',
        alignment === 'left' && 'text-left',
        alignment === 'full' && 'text-center'
      )}>
        {isEditingCaption ? (
          <input
            ref={captionInputRef}
            type="text"
            value={caption}
            onChange={handleCaptionChange}
            onBlur={handleCaptionBlur}
            onKeyDown={handleCaptionKeyDown}
            placeholder="Ajouter une l\u00e9gende..."
            className="w-full text-center font-body text-sm text-ink-soft/70 bg-transparent border-b border-forest/20 focus:border-gold/50 outline-none px-2 py-1"
          />
        ) : (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setIsEditingCaption(true)
            }}
            className={cn(
              'font-body text-sm cursor-text px-2 py-1 inline-block rounded hover:bg-forest/5 transition-colors',
              caption ? 'text-ink-soft/70' : 'text-ink-soft/40 italic'
            )}
          >
            {caption || (isFocused ? 'Cliquez pour ajouter une l\u00e9gende' : '')}
          </span>
        )}
      </figcaption>

      {/* Alt text indicator/editor (shown when focused) */}
      {isFocused && (
        <div className={cn(
          'mt-2 flex items-center gap-2 text-xs',
          alignment === 'center' && 'justify-center',
          alignment === 'left' && 'justify-start',
          alignment === 'full' && 'justify-center'
        )}>
          {isEditingAlt ? (
            <div className="flex items-center gap-2 bg-forest/5 rounded-lg px-3 py-1.5">
              <svg className="w-3 h-3 text-ink-soft/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-ink-soft/50">Alt:</span>
              <input
                ref={altInputRef}
                type="text"
                value={altText}
                onChange={handleAltChange}
                onBlur={handleAltBlur}
                onKeyDown={handleAltKeyDown}
                placeholder="Description pour l'accessibilit\u00e9..."
                className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-forest font-body"
              />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditingAlt(true)
              }}
              className="flex items-center gap-2 text-ink-soft/50 hover:text-forest hover:bg-forest/5 rounded-lg px-3 py-1.5 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Alt: {altText || 'Non d\u00e9fini'}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      )}
    </figure>
  )
}
