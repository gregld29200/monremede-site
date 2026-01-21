'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { BlockContent } from '@/types/admin'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface TiptapEditorProps {
  value: BlockContent[]
  onChange: (blocks: BlockContent[]) => void
  label?: string
  description?: string
  placeholder?: string
  className?: string
  minHeight?: string
}

// Generate unique key for Sanity blocks
function generateKey(): string {
  return Math.random().toString(36).substring(2, 10)
}

// ============================================
// Conversion: Portable Text -> TipTap HTML
// ============================================
function portableTextToHtml(blocks: BlockContent[]): string {
  if (!blocks || blocks.length === 0) return ''

  let html = ''
  let currentListType: string | null = null

  blocks.forEach((block) => {
    // Handle images
    if (block._type === 'image') {
      // Close any open list
      if (currentListType) {
        html += currentListType === 'bullet' ? '</ul>' : '</ol>'
        currentListType = null
      }

      const ref = block.asset?._ref || ''
      const imageUrl = ref ? getSanityImageUrl(ref) : ''
      if (imageUrl) {
        html += `<img src="${imageUrl}" alt="${block.alt || ''}" data-sanity-ref="${ref}" />`
      }
      return
    }

    if (block._type !== 'block') return

    // Process children to HTML
    const childrenHtml = (block.children || []).map(child => {
      let text = child.text || ''
      // Escape HTML
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

      if (child.marks && child.marks.length > 0) {
        child.marks.forEach(mark => {
          if (mark === 'strong') text = `<strong>${text}</strong>`
          else if (mark === 'em') text = `<em>${text}</em>`
          else if (mark === 'underline') text = `<u>${text}</u>`
          else {
            // Check for links
            const linkDef = block.markDefs?.find(def => def._key === mark)
            if (linkDef) {
              text = `<a href="${linkDef.href}">${text}</a>`
            }
          }
        })
      }
      return text
    }).join('')

    const style = block.style || 'normal'
    const listItem = block.listItem

    // Handle list items
    if (listItem) {
      const listType = listItem === 'bullet' ? 'bullet' : 'number'

      // Open new list if needed
      if (currentListType !== listType) {
        if (currentListType) {
          html += currentListType === 'bullet' ? '</ul>' : '</ol>'
        }
        html += listType === 'bullet' ? '<ul>' : '<ol>'
        currentListType = listType
      }

      html += `<li>${childrenHtml}</li>`
    } else {
      // Close any open list
      if (currentListType) {
        html += currentListType === 'bullet' ? '</ul>' : '</ol>'
        currentListType = null
      }

      // Regular block
      switch (style) {
        case 'h2':
          html += `<h2>${childrenHtml}</h2>`
          break
        case 'h3':
          html += `<h3>${childrenHtml}</h3>`
          break
        case 'h4':
          html += `<h4>${childrenHtml}</h4>`
          break
        case 'blockquote':
          html += `<blockquote><p>${childrenHtml}</p></blockquote>`
          break
        default:
          html += `<p>${childrenHtml || '<br>'}</p>`
      }
    }
  })

  // Close any remaining list
  if (currentListType) {
    html += currentListType === 'bullet' ? '</ul>' : '</ol>'
  }

  return html
}

// ============================================
// Conversion: TipTap HTML -> Portable Text
// ============================================
function htmlToPortableText(html: string): BlockContent[] {
  if (!html || html === '<p></p>') return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const blocks: BlockContent[] = []

  const processNode = (node: Element, listType?: 'bullet' | 'number'): BlockContent | null => {
    const tagName = node.tagName.toLowerCase()

    // Handle images
    if (tagName === 'img') {
      const src = node.getAttribute('src') || ''
      const alt = node.getAttribute('alt') || ''
      const ref = extractRefFromUrl(src)

      if (ref) {
        return {
          _type: 'image',
          _key: generateKey(),
          asset: {
            _ref: ref,
            _type: 'reference',
          },
          alt,
        }
      }
      return null
    }

    // Skip non-block elements
    if (!['p', 'h2', 'h3', 'h4', 'blockquote', 'li'].includes(tagName)) {
      return null
    }

    // Determine style
    let style: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote' = 'normal'
    if (tagName === 'h2') style = 'h2'
    else if (tagName === 'h3') style = 'h3'
    else if (tagName === 'h4') style = 'h4'
    else if (tagName === 'blockquote') style = 'blockquote'

    // For blockquote, get the inner p if exists
    let contentNode: Element = node
    if (tagName === 'blockquote') {
      const innerP = node.querySelector('p')
      if (innerP) contentNode = innerP
    }

    const markDefs: { _type: 'link'; _key: string; href: string }[] = []
    const children: { _type: 'span'; _key: string; text: string; marks?: string[] }[] = []

    // Process inline content
    const processInline = (inlineNode: Node, marks: string[] = []) => {
      if (inlineNode.nodeType === Node.TEXT_NODE) {
        const text = inlineNode.textContent || ''
        if (text) {
          children.push({
            _type: 'span',
            _key: generateKey(),
            text,
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
            const linkKey = generateKey()
            markDefs.push({ _type: 'link', _key: linkKey, href })
            newMarks.push(linkKey)
          }
        }

        el.childNodes.forEach(child => processInline(child, newMarks))
      }
    }

    contentNode.childNodes.forEach(child => processInline(child))

    // Ensure at least one empty span
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
    if (tagName === 'li' && listType) {
      block.listItem = listType
    }

    return block
  }

  // Process all top-level nodes
  doc.body.childNodes.forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return

    const el = node as Element
    const tagName = el.tagName.toLowerCase()

    if (tagName === 'ul') {
      el.querySelectorAll(':scope > li').forEach(li => {
        const block = processNode(li, 'bullet')
        if (block) blocks.push(block)
      })
    } else if (tagName === 'ol') {
      el.querySelectorAll(':scope > li').forEach(li => {
        const block = processNode(li, 'number')
        if (block) blocks.push(block)
      })
    } else {
      const block = processNode(el)
      if (block) blocks.push(block)
    }
  })

  return blocks
}

// Helper to get Sanity image URL from ref
function getSanityImageUrl(ref: string): string {
  if (!ref) return ''
  // Transform image-{id}-{dimensions}-{format} to URL
  const parts = ref.replace('image-', '').split('-')
  if (parts.length >= 2) {
    const format = parts[parts.length - 1]
    const rest = parts.slice(0, -1).join('-')
    return `https://cdn.sanity.io/images/4otm8dqd/production/${rest}.${format}`
  }
  return ''
}

// Helper to extract ref from Sanity URL (for pasted images or from fragment)
function extractRefFromUrl(url: string): string {
  // Check for ref in URL fragment first (our encoding method)
  const fragmentMatch = url.match(/#ref=([^&]+)/)
  if (fragmentMatch) {
    return fragmentMatch[1]
  }
  // Try to extract from URL path
  const pathMatch = url.match(/\/([a-f0-9]+-\d+x\d+)\.(\w+)/)
  if (pathMatch) {
    return `image-${pathMatch[1]}-${pathMatch[2]}`
  }
  return ''
}

// ============================================
// Toolbar Button Component
// ============================================
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
          ? 'bg-gold/20 text-gold'
          : 'text-ink-soft/60 hover:text-forest hover:bg-forest/5',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}

// ============================================
// Toolbar Divider
// ============================================
function ToolbarDivider() {
  return <div className="w-px h-6 bg-forest/10 mx-1" />
}

// ============================================
// Main Editor Component
// ============================================
export function TiptapEditor({
  value,
  onChange,
  label,
  description,
  placeholder = 'Commencez a ecrire...',
  className,
  minHeight = '300px',
}: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)

  // Initialize editor
  const editor = useEditor({
    immediatelyRender: false, // Prevent SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gold hover:underline',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: portableTextToHtml(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const blocks = htmlToPortableText(html)
      onChange(blocks)
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor outline-none p-4',
        style: `min-height: ${minHeight}`,
      },
    },
  })

  // Focus link input when shown
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus()
    }
  }, [showLinkInput])

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return

    // Validate
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Type de fichier non supporte. Utilisez JPG, PNG, GIF ou WebP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Fichier trop volumineux. Maximum 5 Mo.')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_ADMIN_PATH}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erreur upload')
      }

      const data = await response.json()
      const imageUrl = getSanityImageUrl(data.asset._ref)

      // Insert image into editor with ref encoded in URL fragment
      editor.chain().focus().setImage({
        src: `${imageUrl}#ref=${data.asset._ref}`,
        alt: '',
      }).run()

    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors du telechargement de l\'image')
    } finally {
      setIsUploading(false)
    }
  }, [editor])

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleImageUpload])

  // Handle link submission
  const handleLinkSubmit = useCallback(() => {
    if (!editor) return

    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }

    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  // Open link dialog
  const openLinkDialog = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href || ''
    setLinkUrl(previousUrl)
    setShowLinkInput(true)
  }, [editor])

  if (!editor) {
    return null
  }

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

      <div className="border border-forest/10 rounded-xl overflow-hidden focus-within:border-gold/50 focus-within:ring-1 focus-within:ring-gold/20 transition-colors">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-forest/5 border-b border-forest/10 flex-wrap">
          {/* Style dropdown */}
          <select
            value={
              editor.isActive('heading', { level: 2 }) ? 'h2' :
              editor.isActive('heading', { level: 3 }) ? 'h3' :
              editor.isActive('heading', { level: 4 }) ? 'h4' :
              editor.isActive('blockquote') ? 'blockquote' : 'paragraph'
            }
            onChange={(e) => {
              const val = e.target.value
              // Use setTimeout to ensure the command runs after the select closes
              setTimeout(() => {
                if (val === 'paragraph') {
                  editor.chain().focus().setParagraph().run()
                } else if (val === 'h2') {
                  editor.chain().focus().setHeading({ level: 2 }).run()
                } else if (val === 'h3') {
                  editor.chain().focus().setHeading({ level: 3 }).run()
                } else if (val === 'h4') {
                  editor.chain().focus().setHeading({ level: 4 }).run()
                } else if (val === 'blockquote') {
                  editor.chain().focus().setBlockquote().run()
                }
              }, 0)
            }}
            className="px-2 py-1.5 rounded-lg text-sm font-body text-forest bg-white border border-forest/10 focus:outline-none focus:border-gold/50 cursor-pointer"
          >
            <option value="paragraph">Paragraphe</option>
            <option value="h2">Titre 2</option>
            <option value="h3">Titre 3</option>
            <option value="h4">Titre 4</option>
            <option value="blockquote">Citation</option>
          </select>

          <ToolbarDivider />

          {/* Bold */}
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Gras (Ctrl+B)"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          </ToolbarButton>

          {/* Italic */}
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italique (Ctrl+I)"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="4" x2="10" y2="4" />
              <line x1="14" y1="20" x2="5" y2="20" />
              <line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </ToolbarButton>

          {/* Underline */}
          <ToolbarButton
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Souligne (Ctrl+U)"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" />
              <line x1="4" y1="21" x2="20" y2="21" />
            </svg>
          </ToolbarButton>

          <ToolbarDivider />

          {/* Bullet List */}
          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Liste a puces"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="9" y1="6" x2="20" y2="6" />
              <line x1="9" y1="12" x2="20" y2="12" />
              <line x1="9" y1="18" x2="20" y2="18" />
              <circle cx="5" cy="6" r="1" fill="currentColor" />
              <circle cx="5" cy="12" r="1" fill="currentColor" />
              <circle cx="5" cy="18" r="1" fill="currentColor" />
            </svg>
          </ToolbarButton>

          {/* Ordered List */}
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Liste numerotee"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="6" x2="20" y2="6" />
              <line x1="10" y1="12" x2="20" y2="12" />
              <line x1="10" y1="18" x2="20" y2="18" />
              <text x="4" y="7" fontSize="6" fill="currentColor" fontFamily="system-ui">1</text>
              <text x="4" y="13" fontSize="6" fill="currentColor" fontFamily="system-ui">2</text>
              <text x="4" y="19" fontSize="6" fill="currentColor" fontFamily="system-ui">3</text>
            </svg>
          </ToolbarButton>

          <ToolbarDivider />

          {/* Link */}
          <ToolbarButton
            active={editor.isActive('link')}
            onClick={openLinkDialog}
            title="Lien"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </ToolbarButton>

          {/* Image */}
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Image"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </ToolbarButton>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Link input panel */}
        {showLinkInput && (
          <div className="flex items-center gap-2 px-3 py-2 bg-cream-warm/50 border-b border-forest/10">
            <svg className="w-4 h-4 text-ink-soft/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLinkSubmit()
                } else if (e.key === 'Escape') {
                  setShowLinkInput(false)
                  setLinkUrl('')
                }
              }}
              placeholder="https://example.com"
              className="flex-1 px-2 py-1 text-sm font-body text-forest bg-white border border-forest/10 rounded focus:outline-none focus:border-gold/50"
            />
            <button
              type="button"
              onClick={handleLinkSubmit}
              className="px-3 py-1 text-sm font-body text-white bg-gold rounded hover:bg-gold/90 transition-colors"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false)
                setLinkUrl('')
              }}
              className="px-2 py-1 text-sm font-body text-ink-soft/60 hover:text-forest transition-colors"
            >
              Annuler
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetLink().run()
                  setShowLinkInput(false)
                  setLinkUrl('')
                }}
                className="px-2 py-1 text-sm font-body text-red-600 hover:text-red-700 transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>
        )}

        {/* Editor content */}
        <EditorContent editor={editor} className="tiptap-content" />

        {/* Editor styles */}
        <style jsx global>{`
          .tiptap-editor {
            font-family: var(--font-body, 'Lora', serif);
            color: #2D4A3E;
          }
          .tiptap-editor p {
            margin: 0.5rem 0;
          }
          .tiptap-editor h2 {
            font-family: var(--font-display, 'Playfair Display', serif);
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem;
            color: #1a2e23;
          }
          .tiptap-editor h3 {
            font-family: var(--font-display, 'Playfair Display', serif);
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.25rem 0 0.5rem;
            color: #1a2e23;
          }
          .tiptap-editor h4 {
            font-family: var(--font-display, 'Playfair Display', serif);
            font-size: 1.1rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem;
            color: #1a2e23;
          }
          .tiptap-editor blockquote {
            border-left: 4px solid #c4a35a;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #3d3d38;
          }
          .tiptap-editor ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .tiptap-editor ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .tiptap-editor li {
            margin: 0.25rem 0;
          }
          .tiptap-editor a {
            color: #c4a35a;
            text-decoration: none;
          }
          .tiptap-editor a:hover {
            text-decoration: underline;
          }
          .tiptap-editor strong {
            font-weight: 600;
          }
          .tiptap-editor em {
            font-style: italic;
          }
          .tiptap-editor u {
            text-decoration: underline;
          }
          .tiptap-editor img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          .tiptap-editor p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: rgba(0,0,0,0.3);
            pointer-events: none;
            height: 0;
          }
        `}</style>
      </div>

      {/* Help text */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft/50 font-body">
        <span>
          <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">Ctrl+B</kbd>
          {' '}gras
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">Ctrl+I</kbd>
          {' '}italique
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-forest/5 rounded text-[10px] font-mono">Ctrl+U</kbd>
          {' '}souligne
        </span>
      </div>
    </div>
  )
}
