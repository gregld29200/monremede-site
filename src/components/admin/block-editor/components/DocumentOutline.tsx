'use client'

import { useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../BlockEditorContext'
import type { EditorBlock } from '../types'

interface OutlineItem {
  id: string
  title: string
  level: number
  block: EditorBlock
}

export function DocumentOutline() {
  const { state, dispatch, focusBlock, blockRefs } = useBlockEditorContext()

  // Extract headings from blocks
  const headings = useMemo((): OutlineItem[] => {
    return state.blocks
      .filter(block => block.type === 'h2' || block.type === 'h3' || block.type === 'h4')
      .map(block => ({
        id: block.id,
        title: block.content || 'Sans titre',
        level: block.type === 'h2' ? 2 : block.type === 'h3' ? 3 : 4,
        block
      }))
  }, [state.blocks])

  // Calculate stats
  const stats = useMemo(() => {
    const wordCount = state.blocks.reduce((count, block) => {
      if (block.type === 'image') return count
      const words = block.content.trim().split(/\s+/).filter(Boolean)
      return count + words.length
    }, 0)

    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    return { wordCount, readTime }
  }, [state.blocks])

  // Scroll to block
  const scrollToBlock = useCallback((blockId: string) => {
    const blockEl = blockRefs.current.get(blockId)
    if (blockEl) {
      blockEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      focusBlock(blockId)
    }
  }, [blockRefs, focusBlock])

  // Close outline
  const handleClose = useCallback(() => {
    dispatch({ type: 'TOGGLE_OUTLINE' })
  }, [dispatch])

  if (!state.showOutline) return null

  return (
    <div className="absolute right-0 top-0 bottom-0 w-64 bg-cream border-l border-forest/10 shadow-lg z-30 flex flex-col animate-in slide-in-from-right-5 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-forest/10">
        <h3 className="font-accent text-sm text-forest tracking-wide">Plan du document</h3>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-forest/5 transition-colors"
          title="Fermer (⌘⇧O)"
        >
          <svg className="w-4 h-4 text-ink-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 bg-forest/5 border-b border-forest/10 flex items-center gap-4 text-xs text-ink-soft/60 font-body">
        <span>{stats.wordCount} mots</span>
        <span>~{stats.readTime} min de lecture</span>
      </div>

      {/* Headings list */}
      <div className="flex-1 overflow-y-auto py-2">
        {headings.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-ink-soft/50 font-body">
            <svg className="w-10 h-10 mx-auto mb-3 text-ink-soft/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Aucun titre trouvé</p>
            <p className="text-xs mt-1">Utilisez /h2, /h3, /h4 pour créer des titres</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {headings.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToBlock(item.id)}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm font-body transition-colors',
                  'hover:bg-forest/5 active:bg-forest/10',
                  state.focusedBlockId === item.id && 'bg-gold/10 border-l-2 border-gold'
                )}
                style={{
                  paddingLeft: `${(item.level - 1) * 12 + 16}px`
                }}
              >
                <span className={cn(
                  'truncate block',
                  item.level === 2 && 'font-medium text-forest',
                  item.level === 3 && 'text-forest/80',
                  item.level === 4 && 'text-ink-soft/60 text-xs'
                )}>
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      <div className="px-4 py-2 border-t border-forest/10 text-xs text-ink-soft/50 font-body">
        <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">⌘⇧O</kbd>
        {' '}pour fermer
      </div>
    </div>
  )
}
