# Implementation Guide: Image Management in Block Editor

This document describes the implementation of image management features for the Notion-style block editor. This was implemented but reverted - saved here for future reference.

---

## Overview

This implementation adds:
- Image insertion via slash command (`/image` or `/img`)
- Upload via modal with drag & drop
- Alignment options (left, center, full width)
- 3 predefined sizes (S=40%, M=70%, L=100%)
- Editable caption
- Alt text for accessibility

---

## UX Design

### Slash Menu with Image
```
┌──────────────────────────────────────────┐
│ 🖼️  Image                                │ ← First in list
│     Insérer une image                    │
├──────────────────────────────────────────┤
│ ¶  Paragraphe                            │
│ H2 Titre 2                               │
│ ...                                      │
└──────────────────────────────────────────┘
```

### Upload Modal
```
┌──────────────────────────────────────────┐
│  Insérer une image                    ✕  │
├──────────────────────────────────────────┤
│    ┌────────────────────────────────┐    │
│    │   📷 Glissez une image ici     │    │
│    │      ou cliquez pour choisir   │    │
│    └────────────────────────────────┘    │
│    Formats: JPEG, PNG, GIF, WebP         │
│    Taille max: 5 MB                      │
│                                          │
│    Alt text (accessibilité):             │
│    [_________________________________]   │
│              [Annuler] [Insérer]         │
└──────────────────────────────────────────┘
```

### Image Block with Toolbar
```
              ┌─ Toolbar on hover ─────────────────┐
              │ [⬅] [⬜] [➡]  [S] [M] [L]  [🗑]     │
              │  Alignment    Size       Delete    │
              └────────────────────────────────────┘
    ┌─────────────────────────────────────────────────┐
    │                  📷 Image                       │
    └─────────────────────────────────────────────────┘
              Click to add a caption
```

---

## Implementation Details

### 1. Types (`types.ts`)

Add these new types:

```typescript
// Image alignment options
export type ImageAlignment = 'left' | 'center' | 'full'

// Image size options
export type ImageSize = 'small' | 'medium' | 'large'

// Update EditorBlock.data to include:
data: BlockContent & {
  alignment?: ImageAlignment
  size?: ImageSize
}

// Update EditorState to include:
showImageUploadModal: boolean
imageUploadTargetBlockId: string | null

// Add new actions:
| { type: 'SHOW_IMAGE_UPLOAD_MODAL'; targetBlockId: string | null }
| { type: 'HIDE_IMAGE_UPLOAD_MODAL' }
| { type: 'UPDATE_IMAGE_OPTIONS'; blockId: string; alignment?: ImageAlignment; size?: ImageSize }
```

### 2. Slash Commands (`utils.ts`)

Add SlashCommandDef interface and image command:

```typescript
export interface SlashCommandDef {
  id: string
  label: string
  description: string
  icon: string
  blockType?: BlockType
  shortcut: string
  shortcuts?: string[] // Alternative shortcuts
  action?: 'openImageUpload' // Special actions
}

export const SLASH_COMMANDS: SlashCommandDef[] = [
  {
    id: 'image',
    label: 'Image',
    description: 'Insérer une image',
    icon: '🖼️',
    shortcut: '/image',
    shortcuts: ['/image', '/img'],
    action: 'openImageUpload'
  },
  // ... other commands
]
```

### 3. Context (`BlockEditorContext.tsx`)

Add to initial state:
```typescript
showImageUploadModal: false,
imageUploadTargetBlockId: null
```

Add reducer cases:
```typescript
case 'SHOW_IMAGE_UPLOAD_MODAL':
  return {
    ...state,
    showImageUploadModal: true,
    imageUploadTargetBlockId: action.targetBlockId,
    showSlashMenu: false,
    slashMenuFilter: ''
  }

case 'HIDE_IMAGE_UPLOAD_MODAL':
  return {
    ...state,
    showImageUploadModal: false,
    imageUploadTargetBlockId: null
  }

case 'UPDATE_IMAGE_OPTIONS': {
  return {
    ...state,
    blocks: state.blocks.map(block => {
      if (block.id !== action.blockId || block.type !== 'image') return block
      return {
        ...block,
        data: {
          ...block.data,
          ...(action.alignment !== undefined && { alignment: action.alignment }),
          ...(action.size !== undefined && { size: action.size })
        }
      }
    })
  }
}
```

Add helper functions:
```typescript
// Insert image block
const insertImageBlock = useCallback((assetRef: string, alt: string, targetBlockId?: string | null) => {
  const key = generateKey()
  const afterId = targetBlockId ?? state.focusedBlockId

  const imageBlock = {
    id: key,
    type: 'image' as BlockType,
    content: alt,
    marks: [],
    data: {
      _type: 'image' as const,
      _key: key,
      asset: {
        _ref: assetRef,
        _type: 'reference' as const
      },
      alt,
      caption: '',
      alignment: 'center' as ImageAlignment,
      size: 'medium' as ImageSize
    },
    meta: {}
  }

  dispatch({ type: 'ADD_BLOCK', afterId, block: imageBlock })
  // ... notify parent
  return key
}, [state.blocks, state.focusedBlockId, onChange])

// Update image options
const updateImageOptions = useCallback((blockId: string, options: { alignment?: ImageAlignment; size?: ImageSize }) => {
  dispatch({ type: 'UPDATE_IMAGE_OPTIONS', blockId, ...options })
  // ... notify parent
}, [state.blocks, onChange])
```

### 4. SlashCommandMenu Modification

Update to handle special actions:
```typescript
const selectCommand = useCallback((command: SlashCommandDef) => {
  // Clear slash text
  if (state.focusedBlockId) {
    const blockEl = document.querySelector(`[data-block-id="${state.focusedBlockId}"]`)
    if (blockEl) blockEl.textContent = ''
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
```

### 5. ImageUploadModal Component

Create `components/ImageUploadModal.tsx`:
- Modal with backdrop
- Drag & drop zone (reuse logic from AdminImageUpload)
- Alt text input
- Cancel/Insert buttons
- Calls `insertImageBlock` on insert

Key features:
- Uses `/api/gestion-mon-remede-oum/upload` endpoint
- Validates file type (JPEG, PNG, GIF, WebP)
- Validates file size (max 5MB)
- Shows preview after upload
- Escape key to close

### 6. ImageOptionsToolbar Component

Create `components/ImageOptionsToolbar.tsx`:
- Floating toolbar positioned above image
- 3 alignment buttons (left, center, full)
- 3 size buttons (S, M, L)
- Delete button with confirmation

### 7. ImageBlock Enhancement

Update `components/blocks/ImageBlock.tsx`:

CSS classes for alignment:
```typescript
const alignmentClasses: Record<ImageAlignment, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  full: 'w-full'
}
```

CSS classes for size:
```typescript
const sizeClasses: Record<ImageSize, string> = {
  small: 'max-w-[40%]',
  medium: 'max-w-[70%]',
  large: 'w-full'
}
```

Features:
- Shows toolbar on hover/focus
- Editable caption (click to edit, Enter to save, Escape to cancel)
- Editable alt text (shown when focused)
- Alignment and size applied to container
- All changes persisted to block.data

### 8. BlockEditor Integration

Add to `BlockEditor.tsx`:
```typescript
import { ImageUploadModal } from './components/ImageUploadModal'

// In BlockEditorInner return:
{/* Image upload modal */}
<ImageUploadModal />
```

---

## Data Structure

Image block in BlockContent[]:
```typescript
{
  _type: 'image',
  _key: 'abc123',
  asset: {
    _ref: 'image-xyz-800x600-jpg',
    _type: 'reference'
  },
  alt: 'Description de l\'image',
  caption: 'Légende visible sous l\'image',
  alignment: 'center',  // 'left' | 'center' | 'full'
  size: 'medium'        // 'small' | 'medium' | 'large'
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `types.ts` | Add ImageAlignment, ImageSize types, new actions |
| `utils.ts` | Add SlashCommandDef, image command |
| `BlockEditorContext.tsx` | Add state, reducer cases, helper functions |
| `SlashCommandMenu.tsx` | Handle special actions |
| `BlockEditor.tsx` | Import and render ImageUploadModal |
| `ImageUploadModal.tsx` | **Create** |
| `ImageOptionsToolbar.tsx` | **Create** |
| `blocks/ImageBlock.tsx` | Enhance with toolbar, alignment, size |

---

## Testing Checklist

### Upload
- [ ] Type `/image` in empty block
- [ ] Modal opens
- [ ] Drag & drop image (or click to select)
- [ ] See preview
- [ ] Fill alt text
- [ ] Click "Insérer"
- [ ] Image appears in editor

### Options
- [ ] Hover over image → toolbar appears
- [ ] Click left alignment → image aligns left
- [ ] Click size L → image full width
- [ ] Click delete → confirmation then deletion

### Caption
- [ ] Click "Cliquez pour ajouter une légende"
- [ ] Edit mode activates
- [ ] Type caption
- [ ] Click elsewhere → saves

### Persistence
- [ ] Save article
- [ ] Reload page
- [ ] Verify: image, alignment, size, caption, alt preserved
