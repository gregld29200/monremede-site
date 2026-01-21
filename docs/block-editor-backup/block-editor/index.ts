// Main editor component
export { BlockEditor } from './BlockEditor'

// Block toolbar components
export { BlockToolbar, AddBlockButton } from './components/BlockToolbar'

// Types
export type {
  BlockEditorProps,
  BlockType,
  EditorBlock,
  EditorState,
  EditorAction,
  EditorSelection,
  InlineMark,
  SlashCommand,
  ToolbarButtonProps
} from './types'

// Context (for advanced usage)
export {
  BlockEditorProvider,
  useBlockEditorContext
} from './BlockEditorContext'

// Utilities (for testing/customization)
export {
  generateKey,
  blocksToEditorBlocks,
  editorBlocksToBlocks,
  createEmptyBlock,
  getBlockTypeLabel,
  SLASH_COMMANDS,
  filterSlashCommands
} from './utils'

// Hooks (for advanced usage)
export { useInlineFormatting } from './hooks/useInlineFormatting'
export { useBlockNavigation } from './hooks/useBlockNavigation'
