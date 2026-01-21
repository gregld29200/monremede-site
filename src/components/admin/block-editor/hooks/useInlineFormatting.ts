'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useBlockEditorContext } from '../BlockEditorContext'
import type { InlineMark } from '../types'

type MarkType = 'strong' | 'em' | 'underline' | 'link'

export function useInlineFormatting() {
  const { state, dispatch } = useBlockEditorContext()
  const linkInputRef = useRef<string>('')

  // Get current selection range
  const getSelectionRange = useCallback((): { blockId: string; start: number; end: number } | null => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return null

    // Find the parent block
    const anchorNode = selection.anchorNode
    if (!anchorNode) return null

    // Find closest block element
    let element = anchorNode.nodeType === Node.TEXT_NODE
      ? anchorNode.parentElement
      : anchorNode as HTMLElement

    while (element && !element.dataset?.blockId) {
      element = element.parentElement
    }

    if (!element || !element.dataset?.blockId) return null

    const blockId = element.dataset.blockId
    const range = selection.getRangeAt(0)

    // Get text content and offsets
    const textContent = element.textContent || ''
    const preRange = document.createRange()
    preRange.selectNodeContents(element)
    preRange.setEnd(range.startContainer, range.startOffset)
    const start = preRange.toString().length

    preRange.setEnd(range.endContainer, range.endOffset)
    const end = preRange.toString().length

    if (start === end || start < 0 || end > textContent.length) return null

    return { blockId, start, end }
  }, [])

  // Check if selection has a specific mark
  const hasMarkInSelection = useCallback((markType: MarkType): boolean => {
    const selRange = getSelectionRange()
    if (!selRange) return false

    const block = state.blocks.find(b => b.id === selRange.blockId)
    if (!block) return false

    // Check if there's a mark that covers the selection
    return block.marks.some(mark =>
      mark.type === markType &&
      mark.start <= selRange.start &&
      mark.end >= selRange.end
    )
  }, [state.blocks, getSelectionRange])

  // Toggle a mark on the current selection
  const toggleMark = useCallback((markType: MarkType, href?: string) => {
    const selRange = getSelectionRange()
    if (!selRange) return

    const block = state.blocks.find(b => b.id === selRange.blockId)
    if (!block) return

    // Check if mark already exists
    const existingMark = block.marks.find(mark =>
      mark.type === markType &&
      mark.start <= selRange.start &&
      mark.end >= selRange.end
    )

    if (existingMark) {
      // Remove the mark
      dispatch({
        type: 'REMOVE_MARK',
        blockId: selRange.blockId,
        markType,
        start: existingMark.start,
        end: existingMark.end
      })
    } else {
      // Add the mark
      const newMark: InlineMark = {
        type: markType,
        start: selRange.start,
        end: selRange.end
      }
      if (markType === 'link' && href) {
        newMark.href = href
      }
      dispatch({
        type: 'APPLY_MARK',
        blockId: selRange.blockId,
        mark: newMark
      })
    }
  }, [state.blocks, getSelectionRange, dispatch])

  // Show toolbar on text selection
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed) {
      dispatch({ type: 'HIDE_INLINE_TOOLBAR' })
      return
    }

    const selRange = getSelectionRange()
    if (!selRange) {
      dispatch({ type: 'HIDE_INLINE_TOOLBAR' })
      return
    }

    // Get position for toolbar
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    dispatch({
      type: 'SHOW_INLINE_TOOLBAR',
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      }
    })

    dispatch({
      type: 'SET_SELECTION',
      selection: selRange
    })
  }, [dispatch, getSelectionRange])

  // Listen for selection changes
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [handleSelectionChange])

  // Keyboard shortcuts for formatting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modKey = isMac ? e.metaKey : e.ctrlKey

      if (!modKey) return

      // Check if selection exists
      const selRange = getSelectionRange()
      if (!selRange) return

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          toggleMark('strong')
          break
        case 'i':
          e.preventDefault()
          toggleMark('em')
          break
        case 'u':
          e.preventDefault()
          toggleMark('underline')
          break
        case 'k':
          e.preventDefault()
          // Link insertion - will be handled by the toolbar
          if (hasMarkInSelection('link')) {
            toggleMark('link')
          } else {
            // Show prompt for link URL
            const url = window.prompt('Entrez l\'URL du lien:')
            if (url) {
              toggleMark('link', url)
            }
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [getSelectionRange, toggleMark, hasMarkInSelection])

  // Set link URL (for external use)
  const setLinkUrl = useCallback((url: string) => {
    linkInputRef.current = url
  }, [])

  // Insert link with prompt
  const insertLink = useCallback(() => {
    const url = window.prompt('Entrez l\'URL du lien:')
    if (url) {
      toggleMark('link', url)
    }
  }, [toggleMark])

  // Remove link
  const removeLink = useCallback(() => {
    toggleMark('link')
  }, [toggleMark])

  return {
    getSelectionRange,
    hasMarkInSelection,
    toggleMark,
    insertLink,
    removeLink,
    setLinkUrl
  }
}
