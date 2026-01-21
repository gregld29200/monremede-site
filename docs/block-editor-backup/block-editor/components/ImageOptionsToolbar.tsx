'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../BlockEditorContext'
import type { ImageAlignment, ImageSize } from '../types'

interface ImageOptionsToolbarProps {
  blockId: string
  currentAlignment: ImageAlignment
  currentSize: ImageSize
  onDelete: () => void
}

export function ImageOptionsToolbar({
  blockId,
  currentAlignment,
  currentSize,
  onDelete
}: ImageOptionsToolbarProps) {
  const { updateImageOptions } = useBlockEditorContext()

  const handleAlignmentChange = useCallback((alignment: ImageAlignment) => {
    updateImageOptions(blockId, { alignment })
  }, [blockId, updateImageOptions])

  const handleSizeChange = useCallback((size: ImageSize) => {
    updateImageOptions(blockId, { size })
  }, [blockId, updateImageOptions])

  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white rounded-lg shadow-lg border border-forest/10">
        {/* Alignment buttons */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-forest/10">
          <ToolbarButton
            active={currentAlignment === 'left'}
            onClick={() => handleAlignmentChange('left')}
            title="Aligner \u00e0 gauche"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            active={currentAlignment === 'center'}
            onClick={() => handleAlignmentChange('center')}
            title="Centrer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            active={currentAlignment === 'full'}
            onClick={() => handleAlignmentChange('full')}
            title="Pleine largeur"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Size buttons */}
        <div className="flex items-center gap-0.5 px-2 border-r border-forest/10">
          <ToolbarButton
            active={currentSize === 'small'}
            onClick={() => handleSizeChange('small')}
            title="Petit (40%)"
          >
            <span className="text-xs font-body font-medium">S</span>
          </ToolbarButton>
          <ToolbarButton
            active={currentSize === 'medium'}
            onClick={() => handleSizeChange('medium')}
            title="Moyen (70%)"
          >
            <span className="text-xs font-body font-medium">M</span>
          </ToolbarButton>
          <ToolbarButton
            active={currentSize === 'large'}
            onClick={() => handleSizeChange('large')}
            title="Grand (100%)"
          >
            <span className="text-xs font-body font-medium">L</span>
          </ToolbarButton>
        </div>

        {/* Delete button */}
        <div className="pl-1">
          <ToolbarButton
            onClick={onDelete}
            title="Supprimer l'image"
            variant="danger"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </ToolbarButton>
        </div>
      </div>
    </div>
  )
}

// Toolbar button component
interface ToolbarButtonProps {
  active?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
  variant?: 'default' | 'danger'
}

function ToolbarButton({ active, onClick, title, children, variant = 'default' }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded transition-colors',
        variant === 'danger'
          ? 'text-ink-soft/60 hover:text-red-600 hover:bg-red-50'
          : active
            ? 'bg-gold/20 text-gold'
            : 'text-ink-soft/60 hover:text-forest hover:bg-forest/5'
      )}
    >
      {children}
    </button>
  )
}
