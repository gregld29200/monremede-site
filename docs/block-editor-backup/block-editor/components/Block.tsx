'use client'

import { useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../BlockEditorContext'
import type { EditorBlock } from '../types'
import { TextBlock } from './blocks/TextBlock'
import { ListItemBlock } from './blocks/ListItemBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { BlockToolbar } from './BlockToolbar'

interface BlockProps {
  block: EditorBlock
  index: number
  totalBlocks: number
}

export function Block({ block, index, totalBlocks }: BlockProps) {
  const {
    state,
    focusBlock,
    moveBlock,
    deleteBlock,
    changeBlockType,
    addBlockAfter,
    blockRefs
  } = useBlockEditorContext()

  const containerRef = useRef<HTMLDivElement>(null)
  const isFocused = state.focusedBlockId === block.id

  // Register ref
  useEffect(() => {
    const currentRefs = blockRefs.current
    if (containerRef.current) {
      currentRefs.set(block.id, containerRef.current)
    }
    return () => {
      currentRefs.delete(block.id)
    }
  }, [block.id, blockRefs])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Alt + Arrow moves block
    if (e.altKey && e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      moveBlock(block.id, 'up')
      return
    }
    if (e.altKey && e.key === 'ArrowDown' && index < totalBlocks - 1) {
      e.preventDefault()
      moveBlock(block.id, 'down')
      return
    }

    // Enter creates new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const newId = addBlockAfter(block.id)
      setTimeout(() => focusBlock(newId), 10)
      return
    }

    // Backspace on empty block deletes it
    if (e.key === 'Backspace' && block.content === '' && totalBlocks > 1) {
      e.preventDefault()
      const prevIndex = Math.max(0, index - 1)
      const prevBlock = index > 0 ? state.blocks[prevIndex] : null
      deleteBlock(block.id)
      if (prevBlock) {
        setTimeout(() => focusBlock(prevBlock.id), 10)
      }
      return
    }

    // Arrow up at start of block
    if (e.key === 'ArrowUp' && !e.altKey && index > 0) {
      const selection = window.getSelection()
      if (selection && selection.anchorOffset === 0) {
        e.preventDefault()
        focusBlock(state.blocks[index - 1].id)
      }
    }

    // Arrow down at end of block
    if (e.key === 'ArrowDown' && !e.altKey && index < totalBlocks - 1) {
      const selection = window.getSelection()
      const target = e.target as HTMLElement
      if (selection && selection.anchorOffset === target.textContent?.length) {
        e.preventDefault()
        focusBlock(state.blocks[index + 1].id)
      }
    }
  }, [block.id, block.content, index, totalBlocks, state.blocks, addBlockAfter, deleteBlock, focusBlock, moveBlock])

  // Render the appropriate block type
  const renderBlockContent = () => {
    switch (block.type) {
      case 'bulletList':
      case 'numberList':
        return (
          <ListItemBlock
            block={block}
            onKeyDown={handleKeyDown}
          />
        )
      case 'image':
        return <ImageBlock block={block} />
      default:
        return (
          <TextBlock
            block={block}
            onKeyDown={handleKeyDown}
          />
        )
    }
  }

  const canMoveUp = index > 0
  const canMoveDown = index < totalBlocks - 1
  const canDelete = totalBlocks > 1

  const handleAddBlock = useCallback(() => {
    const newId = addBlockAfter(block.id)
    setTimeout(() => focusBlock(newId), 10)
  }, [block.id, addBlockAfter, focusBlock])

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative',
        isFocused && 'z-10'
      )}
      onClick={() => focusBlock(block.id)}
    >
      {/* Block toolbar - appears on hover at the top */}
      <div className={cn(
        'absolute -top-8 left-0 right-0 flex justify-center',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
        'pointer-events-none group-hover:pointer-events-auto'
      )}>
        <div className="bg-white rounded-lg shadow-sm border border-forest/10 px-1 py-0.5">
          <BlockToolbar
            blockType={block.type}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            canDelete={canDelete}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
            onChangeType={(type) => changeBlockType(block.id, type)}
            onDelete={() => deleteBlock(block.id)}
            onAddBlock={handleAddBlock}
          />
        </div>
      </div>

      {/* Block content */}
      <div className={cn(
        'rounded-lg transition-all duration-150',
        isFocused && 'bg-cream-warm/40 ring-1 ring-gold/20',
        !isFocused && 'hover:bg-cream-warm/20'
      )}>
        {renderBlockContent()}
      </div>

      {/* Focus indicator on the left */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-150',
        isFocused ? 'bg-gold' : 'bg-transparent'
      )} />
    </div>
  )
}
