'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { BlockType } from '../types'
import { getBlockTypeLabel } from '../utils'

// Block types configuration
const BLOCK_TYPES: { type: BlockType; label: string; icon: string; description: string }[] = [
  { type: 'paragraph', label: 'Paragraphe', icon: '¶', description: 'Texte simple' },
  { type: 'h2', label: 'Titre 2', icon: 'H2', description: 'Grand titre de section' },
  { type: 'h3', label: 'Titre 3', icon: 'H3', description: 'Sous-titre' },
  { type: 'h4', label: 'Titre 4', icon: 'H4', description: 'Petit titre' },
  { type: 'blockquote', label: 'Citation', icon: '"', description: 'Citation mise en avant' },
  { type: 'bulletList', label: 'Liste à puces', icon: '•', description: 'Liste non ordonnée' },
  { type: 'numberList', label: 'Liste numérotée', icon: '1.', description: 'Liste ordonnée' },
]

interface BlockToolbarProps {
  blockType: BlockType
  canMoveUp: boolean
  canMoveDown: boolean
  canDelete: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onChangeType: (type: BlockType) => void
  onDelete: () => void
  onAddBlock: () => void
}

export function BlockToolbar({
  blockType,
  canMoveUp,
  canMoveDown,
  canDelete,
  onMoveUp,
  onMoveDown,
  onChangeType,
  onDelete,
  onAddBlock
}: BlockToolbarProps) {
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on click outside
  useEffect(() => {
    if (!showTypeMenu) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowTypeMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTypeMenu])

  // Close menu on escape
  useEffect(() => {
    if (!showTypeMenu) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowTypeMenu(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showTypeMenu])

  const handleTypeChange = useCallback((type: BlockType) => {
    onChangeType(type)
    setShowTypeMenu(false)
  }, [onChangeType])

  const currentTypeConfig = BLOCK_TYPES.find(t => t.type === blockType)

  return (
    <div className="flex items-center gap-0.5">
      {/* Add block button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onAddBlock()
        }}
        className="p-1.5 rounded-lg hover:bg-gold/10 text-ink-soft/40 hover:text-gold transition-colors"
        title="Ajouter un bloc"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Drag handle */}
      <button
        type="button"
        className="p-1.5 rounded-lg hover:bg-forest/5 text-ink-soft/40 hover:text-forest cursor-grab transition-colors"
        title="Glisser pour réorganiser"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Move up */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (canMoveUp) onMoveUp()
        }}
        disabled={!canMoveUp}
        className={cn(
          'p-1.5 rounded-lg hover:bg-forest/5 text-ink-soft/40 hover:text-forest transition-colors',
          !canMoveUp && 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-ink-soft/40'
        )}
        title="Monter (Alt+↑)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Move down */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (canMoveDown) onMoveDown()
        }}
        disabled={!canMoveDown}
        className={cn(
          'p-1.5 rounded-lg hover:bg-forest/5 text-ink-soft/40 hover:text-forest transition-colors',
          !canMoveDown && 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-ink-soft/40'
        )}
        title="Descendre (Alt+↓)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Separator */}
      <div className="w-px h-4 bg-forest/10 mx-1" />

      {/* Block type selector */}
      {blockType !== 'image' && (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowTypeMenu(!showTypeMenu)
            }}
            className={cn(
              'px-2 py-1 rounded-lg text-xs font-accent flex items-center gap-1.5 transition-colors',
              showTypeMenu
                ? 'bg-forest/10 text-forest'
                : 'hover:bg-forest/5 text-ink-soft/60 hover:text-forest'
            )}
            title={`Type: ${getBlockTypeLabel(blockType)}`}
          >
            <span className="font-medium">{currentTypeConfig?.icon || '¶'}</span>
            <span className="hidden sm:inline">{currentTypeConfig?.label || 'Paragraphe'}</span>
            <svg className={cn('w-3 h-3 transition-transform', showTypeMenu && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showTypeMenu && (
            <div className="absolute left-0 top-full mt-1 py-1 bg-white rounded-xl shadow-lg border border-forest/10 min-w-[180px] z-50">
              {BLOCK_TYPES.map(({ type, label, icon, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTypeChange(type)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left flex items-center gap-3 transition-colors',
                    'hover:bg-forest/5',
                    blockType === type ? 'bg-gold/5' : ''
                  )}
                >
                  <span className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-accent',
                    blockType === type ? 'bg-gold/20 text-gold' : 'bg-cream-warm text-forest'
                  )}>
                    {icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-body text-sm',
                      blockType === type ? 'text-gold font-medium' : 'text-forest'
                    )}>
                      {label}
                    </div>
                    <div className="font-body text-xs text-ink-soft/50">{description}</div>
                  </div>
                  {blockType === type && (
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (canDelete) onDelete()
        }}
        disabled={!canDelete}
        className={cn(
          'p-1.5 rounded-lg text-ink-soft/40 transition-colors',
          canDelete
            ? 'hover:bg-red-50 hover:text-red-500'
            : 'opacity-30 cursor-not-allowed'
        )}
        title="Supprimer (Backspace sur bloc vide)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

// Add block button that appears between blocks
interface AddBlockButtonProps {
  onClick: () => void
  className?: string
}

export function AddBlockButton({ onClick, className }: AddBlockButtonProps) {
  return (
    <div className={cn(
      'group/add relative h-0 flex items-center justify-center',
      className
    )}>
      {/* Hover line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-transparent group-hover/add:bg-gold/30 transition-colors" />

      {/* Add button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className={cn(
          'relative z-10 flex items-center gap-1 px-2 py-1 rounded-full',
          'bg-white border border-transparent text-ink-soft/40',
          'opacity-0 group-hover/add:opacity-100 group-hover/add:border-gold/30 group-hover/add:text-gold',
          'hover:bg-gold/5 hover:border-gold/50',
          'transition-all duration-150',
          'text-xs font-accent'
        )}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Ajouter</span>
      </button>
    </div>
  )
}
