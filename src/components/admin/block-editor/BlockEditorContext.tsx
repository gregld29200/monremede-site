'use client'

import { createContext, useContext, useReducer, useCallback, useRef } from 'react'
import type { ReactNode, Dispatch, RefObject } from 'react'
import type { BlockContent } from '@/types/admin'
import type { EditorState, EditorAction, BlockType } from './types'
import {
  blocksToEditorBlocks,
  editorBlocksToBlocks,
  createEmptyBlock,
  rebuildBlockData,
  blockTypeToStyle,
  blockTypeToListItem
} from './utils'

// Initial state
const initialState: EditorState = {
  blocks: [],
  focusedBlockId: null,
  selection: null,
  showSlashMenu: false,
  slashMenuPosition: { x: 0, y: 0 },
  slashMenuFilter: '',
  showOutline: false,
  showInlineToolbar: false,
  inlineToolbarPosition: { x: 0, y: 0 }
}

// Reducer
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.blocks }

    case 'UPDATE_BLOCK': {
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.blockId
            ? { ...block, ...action.updates }
            : block
        )
      }
    }

    case 'UPDATE_BLOCK_CONTENT': {
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.blockId
            ? { ...block, content: action.content, data: action.data }
            : block
        )
      }
    }

    case 'ADD_BLOCK': {
      const newBlocks = [...state.blocks]
      if (action.afterId === null) {
        newBlocks.unshift(action.block)
      } else {
        const index = newBlocks.findIndex(b => b.id === action.afterId)
        if (index !== -1) {
          newBlocks.splice(index + 1, 0, action.block)
        } else {
          newBlocks.push(action.block)
        }
      }
      return { ...state, blocks: newBlocks, focusedBlockId: action.block.id }
    }

    case 'DELETE_BLOCK': {
      const newBlocks = state.blocks.filter(b => b.id !== action.blockId)
      // Ensure at least one block remains
      if (newBlocks.length === 0) {
        newBlocks.push(createEmptyBlock())
      }
      // Focus previous or next block
      const deletedIndex = state.blocks.findIndex(b => b.id === action.blockId)
      const newFocusIndex = Math.max(0, deletedIndex - 1)
      return {
        ...state,
        blocks: newBlocks,
        focusedBlockId: newBlocks[newFocusIndex]?.id || null
      }
    }

    case 'MOVE_BLOCK': {
      const index = state.blocks.findIndex(b => b.id === action.blockId)
      if (index === -1) return state

      const newIndex = action.direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= state.blocks.length) return state

      const newBlocks = [...state.blocks]
      const [removed] = newBlocks.splice(index, 1)
      newBlocks.splice(newIndex, 0, removed)

      return { ...state, blocks: newBlocks }
    }

    case 'CHANGE_BLOCK_TYPE': {
      return {
        ...state,
        blocks: state.blocks.map(block => {
          if (block.id !== action.blockId) return block

          const newListItem = blockTypeToListItem(action.newType)
          const newStyle = blockTypeToStyle(action.newType)

          // Update the data with new type
          const newData: BlockContent = {
            ...block.data,
            style: newStyle,
            listItem: newListItem
          }

          return {
            ...block,
            type: action.newType,
            data: newData
          }
        }),
        showSlashMenu: false,
        slashMenuFilter: ''
      }
    }

    case 'SET_FOCUS':
      return { ...state, focusedBlockId: action.blockId }

    case 'SET_SELECTION':
      return { ...state, selection: action.selection }

    case 'SHOW_SLASH_MENU':
      return {
        ...state,
        showSlashMenu: true,
        slashMenuPosition: action.position,
        slashMenuFilter: ''
      }

    case 'HIDE_SLASH_MENU':
      return { ...state, showSlashMenu: false, slashMenuFilter: '' }

    case 'SET_SLASH_FILTER':
      return { ...state, slashMenuFilter: action.filter }

    case 'TOGGLE_OUTLINE':
      return { ...state, showOutline: !state.showOutline }

    case 'SHOW_INLINE_TOOLBAR':
      return {
        ...state,
        showInlineToolbar: true,
        inlineToolbarPosition: action.position
      }

    case 'HIDE_INLINE_TOOLBAR':
      return { ...state, showInlineToolbar: false }

    case 'APPLY_MARK': {
      return {
        ...state,
        blocks: state.blocks.map(block => {
          if (block.id !== action.blockId) return block
          return {
            ...block,
            marks: [...block.marks, action.mark]
          }
        })
      }
    }

    case 'REMOVE_MARK': {
      return {
        ...state,
        blocks: state.blocks.map(block => {
          if (block.id !== action.blockId) return block
          return {
            ...block,
            marks: block.marks.filter(m =>
              !(m.type === action.markType && m.start === action.start && m.end === action.end)
            )
          }
        })
      }
    }

    default:
      return state
  }
}

// Context type
interface BlockEditorContextType {
  state: EditorState
  dispatch: Dispatch<EditorAction>
  // Helper functions
  updateBlockContent: (blockId: string, content: string) => void
  addBlockAfter: (afterId: string | null, type?: BlockType) => string
  duplicateBlock: (blockId: string) => string | null
  deleteBlock: (blockId: string) => void
  moveBlock: (blockId: string, direction: 'up' | 'down') => void
  changeBlockType: (blockId: string, newType: BlockType) => void
  focusBlock: (blockId: string | null) => void
  getBlocksAsContent: () => BlockContent[]
  // Refs for block elements
  blockRefs: RefObject<Map<string, HTMLDivElement>>
}

// Create context
const BlockEditorContext = createContext<BlockEditorContextType | null>(null)

// Provider props
interface BlockEditorProviderProps {
  children: ReactNode
  initialBlocks: BlockContent[]
  onChange: (blocks: BlockContent[]) => void
}

// Provider component
export function BlockEditorProvider({
  children,
  initialBlocks,
  onChange
}: BlockEditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, {
    ...initialState,
    blocks: blocksToEditorBlocks(initialBlocks)
  })

  // Ref to track block DOM elements
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Update block content and notify parent
  const updateBlockContent = useCallback((blockId: string, content: string) => {
    const block = state.blocks.find(b => b.id === blockId)
    if (!block) return

    const newData = rebuildBlockData(block, content)

    dispatch({
      type: 'UPDATE_BLOCK_CONTENT',
      blockId,
      content,
      data: newData
    })

    // Notify parent of changes
    const newBlocks = state.blocks.map(b =>
      b.id === blockId ? { ...b, content, data: newData } : b
    )
    onChange(editorBlocksToBlocks(newBlocks))
  }, [state.blocks, onChange])

  // Add block after specified block
  const addBlockAfter = useCallback((afterId: string | null, type: BlockType = 'paragraph') => {
    const newBlock = createEmptyBlock(type)

    dispatch({ type: 'ADD_BLOCK', afterId, block: newBlock })

    // Notify parent
    const afterIndex = afterId
      ? state.blocks.findIndex(b => b.id === afterId)
      : -1

    const newBlocks = [...state.blocks]
    newBlocks.splice(afterIndex + 1, 0, newBlock)
    onChange(editorBlocksToBlocks(newBlocks))

    return newBlock.id
  }, [state.blocks, onChange])

  // Duplicate block
  const duplicateBlock = useCallback((blockId: string) => {
    const block = state.blocks.find(b => b.id === blockId)
    if (!block) return null

    const newBlock = {
      ...createEmptyBlock(block.type),
      content: block.content,
      marks: [...block.marks],
      meta: { ...block.meta }
    }
    // Copy the data but with new key
    newBlock.data = {
      ...block.data,
      _key: newBlock.id
    }

    dispatch({ type: 'ADD_BLOCK', afterId: blockId, block: newBlock })

    // Notify parent
    const afterIndex = state.blocks.findIndex(b => b.id === blockId)
    const newBlocks = [...state.blocks]
    newBlocks.splice(afterIndex + 1, 0, newBlock)
    onChange(editorBlocksToBlocks(newBlocks))

    return newBlock.id
  }, [state.blocks, onChange])

  // Delete block
  const deleteBlock = useCallback((blockId: string) => {
    dispatch({ type: 'DELETE_BLOCK', blockId })

    // Notify parent
    const newBlocks = state.blocks.filter(b => b.id !== blockId)
    if (newBlocks.length === 0) {
      newBlocks.push(createEmptyBlock())
    }
    onChange(editorBlocksToBlocks(newBlocks))
  }, [state.blocks, onChange])

  // Move block
  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    const index = state.blocks.findIndex(b => b.id === blockId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= state.blocks.length) return

    dispatch({ type: 'MOVE_BLOCK', blockId, direction })

    // Notify parent
    const newBlocks = [...state.blocks]
    const [removed] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, removed)
    onChange(editorBlocksToBlocks(newBlocks))
  }, [state.blocks, onChange])

  // Change block type
  const changeBlockType = useCallback((blockId: string, newType: BlockType) => {
    dispatch({ type: 'CHANGE_BLOCK_TYPE', blockId, newType })

    // Notify parent
    const newBlocks = state.blocks.map(block => {
      if (block.id !== blockId) return block

      const newListItem = blockTypeToListItem(newType)
      const newStyle = blockTypeToStyle(newType)

      return {
        ...block,
        type: newType,
        data: {
          ...block.data,
          style: newStyle,
          listItem: newListItem
        }
      }
    })
    onChange(editorBlocksToBlocks(newBlocks))
  }, [state.blocks, onChange])

  // Focus block
  const focusBlock = useCallback((blockId: string | null) => {
    dispatch({ type: 'SET_FOCUS', blockId })

    // Also focus the DOM element
    if (blockId) {
      setTimeout(() => {
        const el = blockRefs.current.get(blockId)
        if (el) {
          const editable = el.querySelector('[contenteditable="true"]') as HTMLElement
          if (editable) {
            editable.focus()
          }
        }
      }, 0)
    }
  }, [])

  // Get blocks as content
  const getBlocksAsContent = useCallback(() => {
    return editorBlocksToBlocks(state.blocks)
  }, [state.blocks])

  const value: BlockEditorContextType = {
    state,
    dispatch,
    updateBlockContent,
    addBlockAfter,
    duplicateBlock,
    deleteBlock,
    moveBlock,
    changeBlockType,
    focusBlock,
    getBlocksAsContent,
    blockRefs
  }

  return (
    <BlockEditorContext.Provider value={value}>
      {children}
    </BlockEditorContext.Provider>
  )
}

// Hook to use the context
export function useBlockEditorContext() {
  const context = useContext(BlockEditorContext)
  if (!context) {
    throw new Error('useBlockEditorContext must be used within a BlockEditorProvider')
  }
  return context
}
