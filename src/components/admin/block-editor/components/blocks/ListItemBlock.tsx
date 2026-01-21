'use client'

import { useRef, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../../BlockEditorContext'
import type { EditorBlock } from '../../types'

interface ListItemBlockProps {
  block: EditorBlock
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function ListItemBlock({ block, onKeyDown }: ListItemBlockProps) {
  const { updateBlockContent, state, dispatch } = useBlockEditorContext()
  const editorRef = useRef<HTMLDivElement>(null)
  const isFocused = state.focusedBlockId === block.id

  // Calculate list number based on position
  const listNumber = useMemo(() => {
    if (block.type !== 'numberList') return 0

    // Count consecutive numbered list items before this one
    const blockIndex = state.blocks.findIndex(b => b.id === block.id)
    let count = 1

    for (let i = blockIndex - 1; i >= 0; i--) {
      if (state.blocks[i].type === 'numberList') {
        count++
      } else {
        break
      }
    }

    return count
  }, [block.id, block.type, state.blocks])

  // Sync content
  useEffect(() => {
    if (editorRef.current && !isFocused) {
      const currentText = editorRef.current.textContent || ''
      if (currentText !== block.content) {
        editorRef.current.textContent = block.content
      }
    }
  }, [block.id, block.content, isFocused])

  // Handle input
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.textContent || ''
      updateBlockContent(block.id, text)
    }
  }, [block.id, updateBlockContent])

  // Handle focus
  const handleFocus = useCallback(() => {
    dispatch({ type: 'SET_FOCUS', blockId: block.id })
  }, [block.id, dispatch])

  const isBullet = block.type === 'bulletList'

  return (
    <div className="flex items-start gap-2 py-1">
      {/* List marker */}
      <span className={cn(
        'flex-shrink-0 w-6 text-right font-body text-forest/60 select-none',
        isBullet ? 'mt-1.5' : 'mt-0.5'
      )}>
        {isBullet ? (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-forest/60" />
        ) : (
          `${listNumber}.`
        )}
      </span>

      {/* Content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        data-placeholder="Élément de liste..."
        data-block-id={block.id}
        className={cn(
          'flex-1 outline-none min-h-[1.5em] px-1 font-body text-forest',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-ink-soft/40 empty:before:pointer-events-none'
        )}
      >
        {block.content}
      </div>
    </div>
  )
}
