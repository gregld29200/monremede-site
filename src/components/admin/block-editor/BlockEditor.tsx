'use client'

import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { BlockEditorProps } from './types'
import { BlockEditorProvider, useBlockEditorContext } from './BlockEditorContext'
import { Block } from './components/Block'
import { SlashCommandMenu } from './components/SlashCommandMenu'
import { InlineToolbar } from './components/InlineToolbar'
import { DocumentOutline } from './components/DocumentOutline'
import { AddBlockButton } from './components/BlockToolbar'
import { useBlockNavigation } from './hooks/useBlockNavigation'

// Inner editor component that uses context
function BlockEditorInner({
  placeholder,
  minHeight = '200px'
}: {
  placeholder?: string
  minHeight?: string
}) {
  const { state, addBlockAfter, focusBlock } = useBlockEditorContext()
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize keyboard navigation
  useBlockNavigation()

  // Focus first block on mount if empty
  useEffect(() => {
    if (state.blocks.length === 1 && state.blocks[0].content === '' && !state.focusedBlockId) {
      focusBlock(state.blocks[0].id)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle click on empty space to add new block
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // Only if clicking on the container itself, not a block
    if (e.target === containerRef.current) {
      const lastBlock = state.blocks[state.blocks.length - 1]
      if (lastBlock && lastBlock.content === '') {
        // Focus existing empty block
        focusBlock(lastBlock.id)
      } else {
        // Add new block at end
        const newId = addBlockAfter(lastBlock?.id || null)
        setTimeout(() => focusBlock(newId), 10)
      }
    }
  }, [state.blocks, addBlockAfter, focusBlock])

  // Handler to add block at specific position
  const handleAddBlockAt = useCallback((afterId: string | null) => {
    const newId = addBlockAfter(afterId)
    setTimeout(() => focusBlock(newId), 10)
  }, [addBlockAfter, focusBlock])

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="p-4 pt-6 overflow-y-auto"
      style={{ minHeight }}
    >
      {/* Add block button at the very top */}
      <div className="mb-2">
        <AddBlockButton onClick={() => handleAddBlockAt(null)} />
      </div>

      {/* Render blocks with spacing for toolbar */}
      <div className="space-y-4">
        {state.blocks.map((block, index) => (
          <div key={block.id} className="pt-6">
            <Block
              block={block}
              index={index}
              totalBlocks={state.blocks.length}
            />
          </div>
        ))}
      </div>

      {/* Add block button at the bottom */}
      <div className="mt-4">
        <AddBlockButton
          onClick={() => handleAddBlockAt(state.blocks[state.blocks.length - 1]?.id || null)}
        />
      </div>

      {/* Placeholder when completely empty */}
      {state.blocks.length === 1 && state.blocks[0].content === '' && !state.focusedBlockId && (
        <div className="absolute inset-x-4 top-16 pointer-events-none">
          <span className="font-body text-ink-soft/40">
            {placeholder || 'Commencez à écrire...'}
          </span>
        </div>
      )}

      {/* Slash command menu */}
      <SlashCommandMenu />

      {/* Inline formatting toolbar */}
      <InlineToolbar />
    </div>
  )
}

// Main exported component
export function BlockEditor({
  value,
  onChange,
  label,
  description,
  placeholder,
  minHeight = '200px',
  className
}: BlockEditorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label className="block font-accent text-sm text-forest tracking-wide">
          {label}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-ink-soft/60">{description}</p>
      )}

      {/* Editor container */}
      <BlockEditorProvider initialBlocks={value} onChange={onChange}>
        <div className="border border-forest/10 rounded-xl overflow-hidden bg-white relative focus-within:border-gold/50 focus-within:ring-1 focus-within:ring-gold/20 transition-colors">
          {/* Top toolbar */}
          <EditorHeader />

          {/* Editor content */}
          <BlockEditorInner placeholder={placeholder} minHeight={minHeight} />

          {/* Document outline sidebar */}
          <DocumentOutline />
        </div>
      </BlockEditorProvider>

      {/* Help text */}
      <KeyboardShortcutsHelp />
    </div>
  )
}

// Keyboard shortcuts help
function KeyboardShortcutsHelp() {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? '⌘' : 'Ctrl'

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft/50 font-body">
      <span>
        <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">Enter</kbd>
        {' '}nouveau bloc
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">/</kbd>
        {' '}commandes
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">Alt+↑↓</kbd>
        {' '}déplacer
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">{modKey}+B/I/U</kbd>
        {' '}formatage
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">{modKey}+⇧O</kbd>
        {' '}plan
      </span>
    </div>
  )
}

// Editor header with word count and info
function EditorHeader() {
  const { state, dispatch } = useBlockEditorContext()

  const wordCount = state.blocks.reduce((count, block) => {
    if (block.type === 'image') return count
    const words = block.content.trim().split(/\s+/).filter(Boolean)
    return count + words.length
  }, 0)

  const blockCount = state.blocks.length
  const headingCount = state.blocks.filter(b => b.type === 'h2' || b.type === 'h3' || b.type === 'h4').length

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-forest/5 border-b border-forest/10">
      <div className="flex items-center gap-1.5 text-xs font-accent text-ink-soft/60">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Éditeur de blocs</span>
      </div>

      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs font-body text-ink-soft/50">
        <span>{blockCount} {blockCount === 1 ? 'bloc' : 'blocs'}</span>
        <span className="w-px h-3 bg-forest/10" />
        <span>{wordCount} {wordCount === 1 ? 'mot' : 'mots'}</span>
      </div>

      {/* Outline toggle button */}
      {headingCount > 0 && (
        <>
          <span className="w-px h-3 bg-forest/10 ml-2" />
          <button
            onClick={() => dispatch({ type: 'TOGGLE_OUTLINE' })}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-body transition-colors',
              state.showOutline
                ? 'bg-gold/20 text-gold'
                : 'text-ink-soft/50 hover:text-forest hover:bg-forest/5'
            )}
            title="Plan du document (⌘⇧O)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>Plan</span>
          </button>
        </>
      )}
    </div>
  )
}
