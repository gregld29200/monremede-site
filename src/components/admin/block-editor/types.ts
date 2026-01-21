import type { BlockContent } from '@/types/admin'

// Block types supported by the editor
export type BlockType = 'paragraph' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'bulletList' | 'numberList' | 'image'

// Internal editor block representation
export interface EditorBlock {
  id: string // Corresponds to _key
  type: BlockType
  content: string // Plain text content (for text blocks)
  marks: InlineMark[] // Inline formatting marks
  data: BlockContent // Original Sanity data
  meta: {
    collapsed?: boolean // For collapsible sections
    level?: number // Heading level or list indentation
  }
}

// Inline formatting mark
export interface InlineMark {
  type: 'strong' | 'em' | 'underline' | 'link'
  start: number
  end: number
  href?: string // For links
  key?: string // Mark definition key
}

// Selection state
export interface EditorSelection {
  blockId: string
  start: number
  end: number
}

// Editor state
export interface EditorState {
  blocks: EditorBlock[]
  focusedBlockId: string | null
  selection: EditorSelection | null
  showSlashMenu: boolean
  slashMenuPosition: { x: number; y: number }
  slashMenuFilter: string
  showOutline: boolean
  showInlineToolbar: boolean
  inlineToolbarPosition: { x: number; y: number }
}

// Editor actions
export type EditorAction =
  | { type: 'SET_BLOCKS'; blocks: EditorBlock[] }
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<EditorBlock> }
  | { type: 'UPDATE_BLOCK_CONTENT'; blockId: string; content: string; data: BlockContent }
  | { type: 'ADD_BLOCK'; afterId: string | null; block: EditorBlock }
  | { type: 'DELETE_BLOCK'; blockId: string }
  | { type: 'MOVE_BLOCK'; blockId: string; direction: 'up' | 'down' }
  | { type: 'CHANGE_BLOCK_TYPE'; blockId: string; newType: BlockType }
  | { type: 'SET_FOCUS'; blockId: string | null }
  | { type: 'SET_SELECTION'; selection: EditorSelection | null }
  | { type: 'SHOW_SLASH_MENU'; position: { x: number; y: number } }
  | { type: 'HIDE_SLASH_MENU' }
  | { type: 'SET_SLASH_FILTER'; filter: string }
  | { type: 'TOGGLE_OUTLINE' }
  | { type: 'SHOW_INLINE_TOOLBAR'; position: { x: number; y: number } }
  | { type: 'HIDE_INLINE_TOOLBAR' }
  | { type: 'APPLY_MARK'; blockId: string; mark: InlineMark }
  | { type: 'REMOVE_MARK'; blockId: string; markType: string; start: number; end: number }

// Block editor props
export interface BlockEditorProps {
  value: BlockContent[]
  onChange: (blocks: BlockContent[]) => void
  label?: string
  description?: string
  placeholder?: string
  minHeight?: string
  className?: string
}

// Slash command definition
export interface SlashCommand {
  id: string
  label: string
  description: string
  icon: string
  blockType: BlockType
  shortcut?: string
}

// Toolbar button props
export interface ToolbarButtonProps {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}
