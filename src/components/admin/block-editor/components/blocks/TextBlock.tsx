'use client'

import { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../../BlockEditorContext'
import type { EditorBlock } from '../../types'

interface TextBlockProps {
  block: EditorBlock
  onKeyDown: (e: React.KeyboardEvent) => void
}

// Convert block content with marks to HTML
function contentToHtml(content: string, marks: EditorBlock['marks']): string {
  if (!content) return ''
  if (!marks || marks.length === 0) return escapeHtml(content)

  // Sort marks by start position
  const sortedMarks = [...marks].sort((a, b) => a.start - b.start)

  let result = ''
  let lastIndex = 0

  // Process each character position
  for (let i = 0; i <= content.length; i++) {
    const openingMarks = sortedMarks.filter(m => m.start === i)
    const closingMarks = sortedMarks.filter(m => m.end === i)

    // Add content before this position
    if (i > lastIndex) {
      result += escapeHtml(content.slice(lastIndex, i))
    }

    // Close marks
    closingMarks.reverse().forEach(mark => {
      result += getClosingTag(mark.type)
    })

    // Open marks
    openingMarks.forEach(mark => {
      result += getOpeningTag(mark.type, mark.href, mark.key)
    })

    lastIndex = i
  }

  // Add remaining content
  if (lastIndex < content.length) {
    result += escapeHtml(content.slice(lastIndex))
  }

  return result
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function getOpeningTag(type: string, href?: string, key?: string): string {
  switch (type) {
    case 'strong': return '<strong>'
    case 'em': return '<em>'
    case 'underline': return '<u>'
    case 'link': return `<a href="${href || '#'}" data-mark-key="${key || ''}">`
    default: return ''
  }
}

function getClosingTag(type: string): string {
  switch (type) {
    case 'strong': return '</strong>'
    case 'em': return '</em>'
    case 'underline': return '</u>'
    case 'link': return '</a>'
    default: return ''
  }
}

export function TextBlock({ block, onKeyDown }: TextBlockProps) {
  const { updateBlockContent, state, dispatch } = useBlockEditorContext()
  const editorRef = useRef<HTMLDivElement>(null)
  const isFocused = state.focusedBlockId === block.id

  // Get HTML content
  const htmlContent = contentToHtml(block.content, block.marks)

  // Sync content on mount and when block changes from external source
  useEffect(() => {
    if (editorRef.current && !isFocused) {
      const currentHtml = editorRef.current.innerHTML
      if (currentHtml !== htmlContent && htmlContent !== '') {
        editorRef.current.innerHTML = htmlContent
      }
    }
  }, [block.id, htmlContent, isFocused])

  // Handle input - extract plain text and update
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      // Get plain text content
      const text = editorRef.current.textContent || ''
      updateBlockContent(block.id, text)
    }
  }, [block.id, updateBlockContent])

  // Handle slash command detection
  const handleKeyDownInternal = useCallback((e: React.KeyboardEvent) => {
    // Check for slash at start of empty block
    if (e.key === '/' && block.content === '') {
      const rect = editorRef.current?.getBoundingClientRect()
      if (rect) {
        dispatch({
          type: 'SHOW_SLASH_MENU',
          position: { x: rect.left, y: rect.bottom + 4 }
        })
      }
      // Don't prevent default - let the slash be typed
    }

    // Escape to close slash menu
    if (e.key === 'Escape' && state.showSlashMenu) {
      e.preventDefault()
      dispatch({ type: 'HIDE_SLASH_MENU' })
      return
    }

    // Pass to parent handler
    onKeyDown(e)
  }, [block.content, state.showSlashMenu, dispatch, onKeyDown])

  // Handle focus
  const handleFocus = useCallback(() => {
    dispatch({ type: 'SET_FOCUS', blockId: block.id })
  }, [block.id, dispatch])

  // Style classes based on block type
  const getBlockStyles = () => {
    switch (block.type) {
      case 'h2':
        return 'font-display text-2xl text-forest font-semibold'
      case 'h3':
        return 'font-display text-xl text-forest font-semibold'
      case 'h4':
        return 'font-display text-lg text-forest font-medium'
      case 'blockquote':
        return 'font-body text-forest/80 italic pl-4 border-l-4 border-gold'
      default:
        return 'font-body text-forest'
    }
  }

  // Placeholder based on type
  const getPlaceholder = () => {
    switch (block.type) {
      case 'h2': return 'Titre 2'
      case 'h3': return 'Titre 3'
      case 'h4': return 'Titre 4'
      case 'blockquote': return 'Citation...'
      default: return 'Tapez "/" pour les commandes, ou commencez à écrire...'
    }
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDownInternal}
      onFocus={handleFocus}
      data-placeholder={getPlaceholder()}
      data-block-id={block.id}
      className={cn(
        'outline-none min-h-[1.5em] py-1 px-2',
        getBlockStyles(),
        'prose prose-sm max-w-none',
        'prose-a:text-gold prose-a:no-underline hover:prose-a:underline',
        'empty:before:content-[attr(data-placeholder)] empty:before:text-ink-soft/40 empty:before:pointer-events-none'
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
    />
  )
}
