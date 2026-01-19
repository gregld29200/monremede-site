'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { BlockContent } from '@/types/admin'

interface AdminRichEditorProps {
  value: BlockContent[]
  onChange: (blocks: BlockContent[]) => void
  label?: string
  description?: string
  placeholder?: string
  className?: string
  minHeight?: string
}

// Generate unique key
function generateKey(): string {
  return Math.random().toString(36).substring(2, 10)
}

// Toolbar button component
function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-lg transition-colors',
        active
          ? 'bg-forest/10 text-forest'
          : 'text-ink-soft/60 hover:text-forest hover:bg-forest/5',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}

export function AdminRichEditor({
  value,
  onChange,
  label,
  description,
  placeholder = 'Commencez à écrire...',
  className,
  minHeight = '200px',
}: AdminRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    style: 'normal' as string,
    list: null as string | null,
  })

  // Convert BlockContent to HTML for display
  const blocksToHtml = useCallback((blocks: BlockContent[]): string => {
    if (!blocks || blocks.length === 0) return ''

    return blocks.map(block => {
      if (block._type === 'image') {
        return `<figure data-type="image" data-ref="${block.asset?._ref || ''}">
          <img src="https://cdn.sanity.io/images/4otm8dqd/production/${block.asset?._ref?.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp').replace('-gif', '.gif')}" alt="${block.alt || ''}" />
          ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
        </figure>`
      }

      if (block._type !== 'block') return ''

      const text = block.children?.map(child => {
        let content = child.text || ''
        if (child.marks) {
          child.marks.forEach(mark => {
            if (mark === 'strong') content = `<strong>${content}</strong>`
            else if (mark === 'em') content = `<em>${content}</em>`
            else if (mark === 'underline') content = `<u>${content}</u>`
            else {
              // Check for links
              const linkDef = block.markDefs?.find(def => def._key === mark)
              if (linkDef) {
                content = `<a href="${linkDef.href}" data-mark-key="${mark}">${content}</a>`
              }
            }
          })
        }
        return content
      }).join('') || ''

      const style = block.style || 'normal'
      const listItem = block.listItem

      if (listItem === 'bullet') {
        return `<li data-list="bullet">${text}</li>`
      }
      if (listItem === 'number') {
        return `<li data-list="number">${text}</li>`
      }

      switch (style) {
        case 'h2': return `<h2>${text}</h2>`
        case 'h3': return `<h3>${text}</h3>`
        case 'h4': return `<h4>${text}</h4>`
        case 'blockquote': return `<blockquote>${text}</blockquote>`
        default: return `<p>${text || '<br>'}</p>`
      }
    }).join('')
  }, [])

  // Convert HTML to BlockContent
  const htmlToBlocks = useCallback((html: string): BlockContent[] => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const blocks: BlockContent[] = []

    const processNode = (node: Element, listType?: string): BlockContent | null => {
      const tagName = node.tagName.toLowerCase()

      // Handle images
      if (tagName === 'figure' && node.getAttribute('data-type') === 'image') {
        const img = node.querySelector('img')
        const caption = node.querySelector('figcaption')
        return {
          _type: 'image',
          _key: generateKey(),
          asset: {
            _ref: node.getAttribute('data-ref') || '',
            _type: 'reference',
          },
          alt: img?.alt || '',
          caption: caption?.textContent || undefined,
        }
      }

      // Skip non-block elements
      if (!['p', 'h2', 'h3', 'h4', 'blockquote', 'li'].includes(tagName)) {
        return null
      }

      const style = {
        'p': 'normal',
        'h2': 'h2',
        'h3': 'h3',
        'h4': 'h4',
        'blockquote': 'blockquote',
        'li': 'normal',
      }[tagName] as 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'

      const markDefs: { _type: 'link'; _key: string; href: string }[] = []
      const children: { _type: 'span'; _key: string; text: string; marks?: string[] }[] = []

      const processInlineNode = (inlineNode: Node, marks: string[] = []) => {
        if (inlineNode.nodeType === Node.TEXT_NODE) {
          if (inlineNode.textContent) {
            children.push({
              _type: 'span',
              _key: generateKey(),
              text: inlineNode.textContent,
              marks: marks.length > 0 ? [...marks] : undefined,
            })
          }
          return
        }

        if (inlineNode.nodeType === Node.ELEMENT_NODE) {
          const el = inlineNode as Element
          const elTag = el.tagName.toLowerCase()
          const newMarks = [...marks]

          if (elTag === 'strong' || elTag === 'b') newMarks.push('strong')
          if (elTag === 'em' || elTag === 'i') newMarks.push('em')
          if (elTag === 'u') newMarks.push('underline')
          if (elTag === 'a') {
            const href = el.getAttribute('href')
            if (href) {
              const linkKey = el.getAttribute('data-mark-key') || generateKey()
              markDefs.push({ _type: 'link', _key: linkKey, href })
              newMarks.push(linkKey)
            }
          }

          el.childNodes.forEach(child => processInlineNode(child, newMarks))
        }
      }

      node.childNodes.forEach(child => processInlineNode(child))

      // Ensure at least one child with empty text
      if (children.length === 0) {
        children.push({ _type: 'span', _key: generateKey(), text: '' })
      }

      const block: BlockContent = {
        _type: 'block',
        _key: generateKey(),
        style,
        children,
        markDefs: markDefs.length > 0 ? markDefs : undefined,
      }

      // Handle list items
      if (tagName === 'li') {
        const dataList = node.getAttribute('data-list')
        if (dataList === 'bullet' || listType === 'bullet') {
          block.listItem = 'bullet'
        } else if (dataList === 'number' || listType === 'number') {
          block.listItem = 'number'
        }
      }

      return block
    }

    doc.body.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element
        const tagName = el.tagName.toLowerCase()

        // Handle lists
        if (tagName === 'ul' || tagName === 'ol') {
          const listType = tagName === 'ul' ? 'bullet' : 'number'
          el.querySelectorAll(':scope > li').forEach(li => {
            const block = processNode(li, listType)
            if (block) blocks.push(block)
          })
        } else {
          const block = processNode(el)
          if (block) blocks.push(block)
        }
      }
    })

    return blocks
  }, [])

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current && value) {
      const html = blocksToHtml(value)
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html || `<p><br></p>`
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount - intentionally not including blocksToHtml and value

  // Update format state based on selection
  const updateFormatState = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    setCurrentFormat({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      style: 'normal', // Simplified for now
      list: null,
    })
  }, [])

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      const blocks = htmlToBlocks(html)
      onChange(blocks)
    }
  }, [htmlToBlocks, onChange])

  // Execute formatting command
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateFormatState()
    handleInput()
  }, [updateFormatState, handleInput])

  // Format heading
  const formatHeading = useCallback((level: string) => {
    execCommand('formatBlock', level === 'normal' ? 'p' : level)
  }, [execCommand])

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt('URL du lien:')
    if (url) {
      execCommand('createLink', url)
    }
  }, [execCommand])

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block font-accent text-sm text-forest tracking-wide">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-ink-soft/60">{description}</p>
      )}

      <div className={cn(
        'border rounded-xl overflow-hidden transition-colors',
        isFocused ? 'border-gold/50 ring-1 ring-gold/20' : 'border-forest/10'
      )}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-forest/5 border-b border-forest/10 flex-wrap">
          {/* Style dropdown */}
          <select
            value={currentFormat.style}
            onChange={(e) => formatHeading(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-sm font-body text-forest bg-white border border-forest/10 focus:outline-none focus:border-gold/50"
          >
            <option value="normal">Paragraphe</option>
            <option value="h2">Titre 2</option>
            <option value="h3">Titre 3</option>
            <option value="h4">Titre 4</option>
            <option value="blockquote">Citation</option>
          </select>

          <div className="w-px h-6 bg-forest/10 mx-1" />

          {/* Bold */}
          <ToolbarButton
            active={currentFormat.bold}
            onClick={() => execCommand('bold')}
            title="Gras (Ctrl+B)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          </ToolbarButton>

          {/* Italic */}
          <ToolbarButton
            active={currentFormat.italic}
            onClick={() => execCommand('italic')}
            title="Italique (Ctrl+I)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m4-16h-4m4 16H8" />
            </svg>
          </ToolbarButton>

          {/* Underline */}
          <ToolbarButton
            active={currentFormat.underline}
            onClick={() => execCommand('underline')}
            title="Souligné (Ctrl+U)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14M5 6v6a7 7 0 0014 0V6" />
            </svg>
          </ToolbarButton>

          <div className="w-px h-6 bg-forest/10 mx-1" />

          {/* Bullet list */}
          <ToolbarButton
            onClick={() => execCommand('insertUnorderedList')}
            title="Liste à puces"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </ToolbarButton>

          {/* Numbered list */}
          <ToolbarButton
            onClick={() => execCommand('insertOrderedList')}
            title="Liste numérotée"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </ToolbarButton>

          <div className="w-px h-6 bg-forest/10 mx-1" />

          {/* Link */}
          <ToolbarButton
            onClick={insertLink}
            title="Insérer un lien"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSelect={updateFormatState}
          onKeyUp={updateFormatState}
          data-placeholder={placeholder}
          className={cn(
            'p-4 font-body text-forest outline-none overflow-y-auto',
            'prose prose-sm max-w-none',
            'prose-headings:font-display prose-headings:text-forest',
            'prose-h2:text-xl prose-h3:text-lg prose-h4:text-base',
            'prose-p:my-2 prose-headings:my-3',
            'prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:pl-4 prose-blockquote:italic',
            'prose-a:text-gold prose-a:no-underline hover:prose-a:underline',
            'prose-ul:list-disc prose-ol:list-decimal',
            'empty:before:content-[attr(data-placeholder)] empty:before:text-ink-soft/40'
          )}
          style={{ minHeight }}
        />
      </div>
    </div>
  )
}
