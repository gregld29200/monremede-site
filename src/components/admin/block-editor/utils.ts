import type { BlockContent } from '@/types/admin'
import type { EditorBlock, BlockType, InlineMark } from './types'

// Generate unique key for Sanity blocks
export function generateKey(): string {
  return Math.random().toString(36).substring(2, 10)
}

// Convert Sanity style to internal block type
function styleToBlockType(style: string | undefined, listItem?: string): BlockType {
  if (listItem === 'bullet') return 'bulletList'
  if (listItem === 'number') return 'numberList'

  switch (style) {
    case 'h2': return 'h2'
    case 'h3': return 'h3'
    case 'h4': return 'h4'
    case 'blockquote': return 'blockquote'
    default: return 'paragraph'
  }
}

// Convert internal block type to Sanity style
export function blockTypeToStyle(type: BlockType): 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote' {
  switch (type) {
    case 'h2': return 'h2'
    case 'h3': return 'h3'
    case 'h4': return 'h4'
    case 'blockquote': return 'blockquote'
    default: return 'normal'
  }
}

// Convert internal block type to list item type
export function blockTypeToListItem(type: BlockType): 'bullet' | 'number' | undefined {
  switch (type) {
    case 'bulletList': return 'bullet'
    case 'numberList': return 'number'
    default: return undefined
  }
}

// Extract plain text from Sanity block children
function extractText(children: BlockContent['children']): string {
  if (!children) return ''
  return children.map(child => child.text || '').join('')
}

// Extract inline marks from Sanity block children
function extractMarks(children: BlockContent['children'], markDefs?: BlockContent['markDefs']): InlineMark[] {
  if (!children) return []

  const marks: InlineMark[] = []
  let offset = 0

  for (const child of children) {
    const text = child.text || ''
    const length = text.length

    if (child.marks && child.marks.length > 0) {
      for (const mark of child.marks) {
        if (mark === 'strong') {
          marks.push({ type: 'strong', start: offset, end: offset + length })
        } else if (mark === 'em') {
          marks.push({ type: 'em', start: offset, end: offset + length })
        } else if (mark === 'underline') {
          marks.push({ type: 'underline', start: offset, end: offset + length })
        } else {
          // Check for link
          const linkDef = markDefs?.find(def => def._key === mark)
          if (linkDef) {
            marks.push({
              type: 'link',
              start: offset,
              end: offset + length,
              href: linkDef.href,
              key: mark
            })
          }
        }
      }
    }

    offset += length
  }

  return marks
}

// Convert BlockContent array to EditorBlock array
export function blocksToEditorBlocks(blocks: BlockContent[]): EditorBlock[] {
  if (!blocks || blocks.length === 0) {
    // Return empty paragraph if no blocks
    return [{
      id: generateKey(),
      type: 'paragraph',
      content: '',
      marks: [],
      data: {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [{ _type: 'span', _key: generateKey(), text: '' }]
      },
      meta: {}
    }]
  }

  return blocks.map(block => {
    if (block._type === 'image') {
      return {
        id: block._key,
        type: 'image' as BlockType,
        content: block.alt || '',
        marks: [],
        data: block,
        meta: {}
      }
    }

    return {
      id: block._key,
      type: styleToBlockType(block.style, block.listItem),
      content: extractText(block.children),
      marks: extractMarks(block.children, block.markDefs),
      data: block,
      meta: {
        level: block.level
      }
    }
  })
}

// Convert EditorBlock array to BlockContent array
export function editorBlocksToBlocks(editorBlocks: EditorBlock[]): BlockContent[] {
  return editorBlocks.map(editorBlock => editorBlock.data)
}

// Rebuild block data from content and marks
export function rebuildBlockData(
  editorBlock: EditorBlock,
  newContent: string
): BlockContent {
  if (editorBlock.type === 'image') {
    return editorBlock.data
  }

  const listItem = blockTypeToListItem(editorBlock.type)

  // For now, simple rebuild without marks preservation
  // This will be enhanced in Phase 3 for inline formatting
  return {
    _type: 'block',
    _key: editorBlock.id,
    style: blockTypeToStyle(editorBlock.type),
    children: [{
      _type: 'span',
      _key: generateKey(),
      text: newContent
    }],
    listItem,
    level: editorBlock.meta.level
  }
}

// Create a new empty block
export function createEmptyBlock(type: BlockType = 'paragraph'): EditorBlock {
  const key = generateKey()
  const listItem = blockTypeToListItem(type)

  return {
    id: key,
    type,
    content: '',
    marks: [],
    data: {
      _type: 'block',
      _key: key,
      style: blockTypeToStyle(type),
      children: [{ _type: 'span', _key: generateKey(), text: '' }],
      listItem
    },
    meta: {}
  }
}

// Get display name for block type (French)
export function getBlockTypeLabel(type: BlockType): string {
  switch (type) {
    case 'paragraph': return 'Paragraphe'
    case 'h2': return 'Titre 2'
    case 'h3': return 'Titre 3'
    case 'h4': return 'Titre 4'
    case 'blockquote': return 'Citation'
    case 'bulletList': return 'Liste à puces'
    case 'numberList': return 'Liste numérotée'
    case 'image': return 'Image'
    default: return 'Paragraphe'
  }
}

// Slash commands
export const SLASH_COMMANDS = [
  { id: 'paragraph', label: 'Paragraphe', description: 'Texte simple', icon: '¶', blockType: 'paragraph' as BlockType, shortcut: '/p' },
  { id: 'h2', label: 'Titre 2', description: 'Grand titre de section', icon: 'H2', blockType: 'h2' as BlockType, shortcut: '/h2' },
  { id: 'h3', label: 'Titre 3', description: 'Sous-titre', icon: 'H3', blockType: 'h3' as BlockType, shortcut: '/h3' },
  { id: 'h4', label: 'Titre 4', description: 'Petit titre', icon: 'H4', blockType: 'h4' as BlockType, shortcut: '/h4' },
  { id: 'blockquote', label: 'Citation', description: 'Citation mise en avant', icon: '"', blockType: 'blockquote' as BlockType, shortcut: '/quote' },
  { id: 'bulletList', label: 'Liste à puces', description: 'Liste non ordonnée', icon: '•', blockType: 'bulletList' as BlockType, shortcut: '/bullet' },
  { id: 'numberList', label: 'Liste numérotée', description: 'Liste ordonnée', icon: '1.', blockType: 'numberList' as BlockType, shortcut: '/number' },
]

// Filter slash commands based on query
export function filterSlashCommands(query: string) {
  if (!query) return SLASH_COMMANDS

  const lowerQuery = query.toLowerCase()
  return SLASH_COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(lowerQuery) ||
    cmd.shortcut?.toLowerCase().includes('/' + lowerQuery) ||
    cmd.id.toLowerCase().includes(lowerQuery)
  )
}

// Check if block is a heading
export function isHeading(type: BlockType): boolean {
  return type === 'h2' || type === 'h3' || type === 'h4'
}

// Check if block is a list
export function isList(type: BlockType): boolean {
  return type === 'bulletList' || type === 'numberList'
}

// Get Sanity image URL (simplified version)
export function getSanityImageUrl(ref: string | undefined): string {
  if (!ref) return ''

  // Transform image-{id}-{dimensions}-{format} to URL
  const parts = ref.replace('image-', '').split('-')
  if (parts.length >= 2) {
    const id = parts.slice(0, -1).join('-')
    const format = parts[parts.length - 1]
    return `https://cdn.sanity.io/images/4otm8dqd/production/${id}.${format}`
  }

  return ''
}
