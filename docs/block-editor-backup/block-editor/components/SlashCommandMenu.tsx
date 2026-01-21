'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../BlockEditorContext'
import { filterSlashCommands, type SlashCommandDef } from '../utils'
import type { BlockType } from '../types'

export function SlashCommandMenu() {
  const { state, dispatch, changeBlockType, showImageUploadModal } = useBlockEditorContext()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const filteredCommands = filterSlashCommands(state.slashMenuFilter)

  // Clamp selected index to valid range
  const clampedIndex = Math.min(selectedIndex, Math.max(0, filteredCommands.length - 1))

  // Select command handler
  const selectCommand = useCallback((command: SlashCommandDef) => {
    // Clear the slash command text first
    if (state.focusedBlockId) {
      const blockEl = document.querySelector(`[data-block-id="${state.focusedBlockId}"]`) as HTMLElement
      if (blockEl) {
        blockEl.textContent = ''
      }
    }

    // Handle special actions
    if (command.action === 'openImageUpload') {
      showImageUploadModal(state.focusedBlockId)
      return
    }

    // Default: change block type
    if (state.focusedBlockId && command.blockType) {
      changeBlockType(state.focusedBlockId, command.blockType)
    }
    dispatch({ type: 'HIDE_SLASH_MENU' })
  }, [state.focusedBlockId, changeBlockType, dispatch, showImageUploadModal])

  // Handle keyboard navigation
  useEffect(() => {
    if (!state.showSlashMenu) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const idx = Math.min(selectedIndex, filteredCommands.length - 1)
        if (filteredCommands[idx]) {
          selectCommand(filteredCommands[idx])
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        dispatch({ type: 'HIDE_SLASH_MENU' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.showSlashMenu, filteredCommands, selectedIndex, dispatch, selectCommand])

  // Handle input to filter commands
  useEffect(() => {
    if (!state.showSlashMenu || !state.focusedBlockId) return

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.getAttribute('data-block-id') === state.focusedBlockId) {
        const text = target.textContent || ''
        if (text.startsWith('/')) {
          dispatch({ type: 'SET_SLASH_FILTER', filter: text.slice(1) })
          // Reset selection when filter changes
          setSelectedIndex(0)
        } else {
          dispatch({ type: 'HIDE_SLASH_MENU' })
        }
      }
    }

    document.addEventListener('input', handleInput)
    return () => document.removeEventListener('input', handleInput)
  }, [state.showSlashMenu, state.focusedBlockId, dispatch])

  // Click outside to close
  useEffect(() => {
    if (!state.showSlashMenu) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        dispatch({ type: 'HIDE_SLASH_MENU' })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [state.showSlashMenu, dispatch])

  if (!state.showSlashMenu) return null

  // Render in portal
  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: state.slashMenuPosition.x,
        top: state.slashMenuPosition.y,
        zIndex: 9999
      }}
      className="bg-white rounded-xl shadow-lg border border-forest/10 py-2 min-w-[200px] max-h-[300px] overflow-y-auto"
    >
      {filteredCommands.length === 0 ? (
        <div className="px-3 py-2 text-sm text-ink-soft/50 font-body">
          Aucune commande trouvée
        </div>
      ) : (
        filteredCommands.map((cmd, index) => (
          <button
            key={cmd.id}
            type="button"
            onClick={() => selectCommand(cmd)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={cn(
              'w-full px-3 py-2 flex items-center gap-3 text-left transition-colors',
              index === clampedIndex ? 'bg-forest/5' : 'hover:bg-forest/5'
            )}
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-cream-warm text-forest font-accent text-sm">
              {cmd.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-body text-sm text-forest">{cmd.label}</div>
              <div className="font-body text-xs text-ink-soft/50">{cmd.description}</div>
            </div>
          </button>
        ))
      )}
    </div>,
    document.body
  )
}
