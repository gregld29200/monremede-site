'use client'

import { useRef, useState, useCallback, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useBlockEditorContext } from '../BlockEditorContext'
import { useInlineFormatting } from '../hooks/useInlineFormatting'

// Hook to check if component is mounted (client-side)
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function InlineToolbar() {
  const { state } = useBlockEditorContext()
  const { hasMarkInSelection, toggleMark } = useInlineFormatting()
  const toolbarRef = useRef<HTMLDivElement>(null)
  const mounted = useIsMounted()
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  // Callback ref to auto-focus input when it appears
  const linkInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus()
    }
  }, [])

  const handleBold = useCallback(() => {
    toggleMark('strong')
  }, [toggleMark])

  const handleItalic = useCallback(() => {
    toggleMark('em')
  }, [toggleMark])

  const handleUnderline = useCallback(() => {
    toggleMark('underline')
  }, [toggleMark])

  const handleLinkClick = useCallback(() => {
    if (hasMarkInSelection('link')) {
      // Remove link
      toggleMark('link')
    } else {
      // Show link input
      setShowLinkInput(true)
      setLinkUrl('')
    }
  }, [hasMarkInSelection, toggleMark])

  const handleLinkSubmit = useCallback(() => {
    if (linkUrl.trim()) {
      let url = linkUrl.trim()
      // Add https:// if no protocol
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url
      }
      toggleMark('link', url)
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }, [linkUrl, toggleMark])

  const handleLinkKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLinkSubmit()
    } else if (e.key === 'Escape') {
      setShowLinkInput(false)
      setLinkUrl('')
    }
  }, [handleLinkSubmit])

  if (!mounted || !state.showInlineToolbar) return null

  const { x, y } = state.inlineToolbarPosition

  return createPortal(
    <div
      ref={toolbarRef}
      className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-150"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="bg-forest rounded-lg shadow-lg border border-forest-deep/20 flex items-center overflow-hidden">
        {showLinkInput ? (
          <div className="flex items-center gap-1 p-1.5">
            <input
              ref={linkInputRef}
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={handleLinkKeyDown}
              placeholder="https://..."
              className="w-48 px-2 py-1 text-sm bg-forest-deep/50 text-cream rounded border border-forest-deep/30 focus:outline-none focus:border-gold/50 placeholder:text-sage-light/40"
            />
            <button
              onClick={handleLinkSubmit}
              className="p-1.5 rounded text-cream hover:bg-gold/20 transition-colors"
              title="Confirmer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={() => { setShowLinkInput(false); setLinkUrl('') }}
              className="p-1.5 rounded text-cream hover:bg-red-500/20 transition-colors"
              title="Annuler"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            {/* Bold */}
            <ToolbarButton
              active={hasMarkInSelection('strong')}
              onClick={handleBold}
              title="Gras (⌘B)"
            >
              <span className="font-bold">B</span>
            </ToolbarButton>

            {/* Italic */}
            <ToolbarButton
              active={hasMarkInSelection('em')}
              onClick={handleItalic}
              title="Italique (⌘I)"
            >
              <span className="italic">I</span>
            </ToolbarButton>

            {/* Underline */}
            <ToolbarButton
              active={hasMarkInSelection('underline')}
              onClick={handleUnderline}
              title="Souligné (⌘U)"
            >
              <span className="underline">U</span>
            </ToolbarButton>

            <div className="w-px h-5 bg-cream/20 mx-0.5" />

            {/* Link */}
            <ToolbarButton
              active={hasMarkInSelection('link')}
              onClick={handleLinkClick}
              title={hasMarkInSelection('link') ? "Supprimer le lien" : "Lien (⌘K)"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </ToolbarButton>
          </div>
        )}
      </div>

      {/* Arrow pointing down */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5">
        <div className="w-3 h-3 bg-forest rotate-45 border-r border-b border-forest-deep/20" />
      </div>
    </div>,
    document.body
  )
}

// Toolbar button component
function ToolbarButton({
  active,
  onClick,
  title,
  children
}: {
  active?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center text-sm transition-colors',
        active
          ? 'bg-gold/30 text-gold'
          : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
      )}
    >
      {children}
    </button>
  )
}
