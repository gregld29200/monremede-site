'use client'

import { useCallback, useEffect } from 'react'
import { useBlockEditorContext } from '../BlockEditorContext'
import type { BlockType } from '../types'

export function useBlockNavigation() {
  const {
    state,
    dispatch,
    focusBlock,
    moveBlock,
    deleteBlock,
    changeBlockType,
    duplicateBlock
  } = useBlockEditorContext()

  // Get current block and index
  const getCurrentBlockInfo = useCallback(() => {
    if (!state.focusedBlockId) return null

    const index = state.blocks.findIndex(b => b.id === state.focusedBlockId)
    if (index === -1) return null

    return {
      block: state.blocks[index],
      index,
      isFirst: index === 0,
      isLast: index === state.blocks.length - 1
    }
  }, [state.focusedBlockId, state.blocks])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modKey = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl + Shift + O: Toggle outline
      if (modKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_OUTLINE' })
        return
      }

      const info = getCurrentBlockInfo()
      if (!info) return

      // Cmd/Ctrl + D: Duplicate block
      if (modKey && e.key === 'd') {
        e.preventDefault()
        const newId = duplicateBlock(info.block.id)
        if (newId) {
          setTimeout(() => focusBlock(newId), 10)
        }
        return
      }

      // Cmd/Ctrl + Shift + Up: Move block up
      if (modKey && e.shiftKey && e.key === 'ArrowUp' && !info.isFirst) {
        e.preventDefault()
        moveBlock(info.block.id, 'up')
        return
      }

      // Cmd/Ctrl + Shift + Down: Move block down
      if (modKey && e.shiftKey && e.key === 'ArrowDown' && !info.isLast) {
        e.preventDefault()
        moveBlock(info.block.id, 'down')
        return
      }

      // Cmd/Ctrl + Backspace: Delete current block
      if (modKey && e.key === 'Backspace' && state.blocks.length > 1) {
        e.preventDefault()
        const prevBlock = info.index > 0 ? state.blocks[info.index - 1] : null
        const nextBlock = info.index < state.blocks.length - 1 ? state.blocks[info.index + 1] : null
        deleteBlock(info.block.id)
        if (prevBlock) {
          setTimeout(() => focusBlock(prevBlock.id), 10)
        } else if (nextBlock) {
          setTimeout(() => focusBlock(nextBlock.id), 10)
        }
        return
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [getCurrentBlockInfo, state.blocks, dispatch, duplicateBlock, focusBlock, moveBlock, deleteBlock])

  // Convert between block types with shortcuts
  const convertToType = useCallback((type: BlockType) => {
    const info = getCurrentBlockInfo()
    if (info) {
      changeBlockType(info.block.id, type)
    }
  }, [getCurrentBlockInfo, changeBlockType])

  return {
    getCurrentBlockInfo,
    convertToType
  }
}
