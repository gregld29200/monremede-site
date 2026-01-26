// Design Studio Types

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '2:3' | '3:2'

export type Resolution = '1K' | '2K' | '4K'

export type GenerationStatus = 'pending' | 'generating' | 'success' | 'failed'

export type ImagePurpose = 'mainImage' | 'gallery' | 'social'

export type SocialPlatform = 'instagram-post' | 'instagram-story' | 'facebook-post' | 'facebook-cover' | 'pinterest' | 'youtube'

export interface PromptSuggestion {
  id: string
  text: string
  suggestedRatio: AspectRatio
}

export interface GenerateImageRequest {
  prompt: string
  aspectRatio: AspectRatio
  resolution: Resolution
  articleId?: string
  purpose: ImagePurpose
}

export interface GenerateImageResponse {
  taskId: string
  documentId: string
}

export interface TaskStatusResponse {
  status: GenerationStatus
  resultUrl?: string
  error?: string
  progress?: number
}

export interface UploadToSanityRequest {
  generatedImageId: string
  targetDocumentId?: string
  targetField?: 'mainImage' | 'gallery'
}

export interface UploadToSanityResponse {
  success: boolean
  assetId?: string
  error?: string
}

export interface GeneratedImage {
  _id: string
  _type: 'generatedImage'
  prompt: string
  kieTaskId: string
  status: GenerationStatus
  aspectRatio: AspectRatio
  resolution: Resolution
  resultUrl?: string
  sanityImage?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  linkedPost?: {
    _ref: string
    _type: 'reference'
  }
  purpose: ImagePurpose
  cost?: number
  _createdAt: string
  _updatedAt: string
}

export interface SocialTemplate {
  id: SocialPlatform
  name: string
  aspectRatio: AspectRatio
  resolution: Resolution
  description: string
  icon: string
}

// KIE.AI API Types
export interface KieCreateTaskRequest {
  model: string
  prompt: string
  aspect_ratio: string
  resolution: string
  output_format: string
}

export interface KieCreateTaskResponse {
  code: number
  msg: string
  data: {
    taskId: string
  }
}

export interface KieTaskStatusResponse {
  code: number
  msg: string
  data: {
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress?: number
    resultUrl?: string
    error?: string
  }
}

// Brand Kit
export const BRAND_KIT = {
  colors: {
    forestDeep: '#1a2e23',
    forest: '#2D4A3E',
    sage: '#8b9e7e',
    sageLight: '#b5c4a8',
    cream: '#f7f4ed',
    creamWarm: '#efe9dc',
    blush: '#e8d4cf',
    blushDeep: '#d4aea5',
    gold: '#c4a35a',
    goldLight: '#dcc78e',
  },
  promptSuffix: `Style: Natural, organic, elegant, warm, feminine aesthetic.
Color palette: deep forest greens, soft sage, warm cream, golden accents, soft blush pink.
Mood: Peaceful, nurturing, wellness-focused, naturopathy-inspired.
Lighting: Soft, natural daylight with gentle shadows.`,
  claudeSystemPrompt: `Tu génères des descriptions d'images pour un site de naturopathie.
Marque: Mon Remède - élégante, naturelle, féminine.
Couleurs: vert forêt (#2D4A3E), sauge (#8b9e7e), crème (#f2ebe1), or (#c4a35a).
Style: Photos lifestyle organiques, ingrédients naturels, ambiance apaisante.
Génère des prompts en anglais pour la génération d'images.`,
}

// Social media templates
export const SOCIAL_TEMPLATES: SocialTemplate[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    aspectRatio: '1:1',
    resolution: '2K',
    description: 'Post carré pour le feed Instagram',
    icon: '📷',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    aspectRatio: '9:16',
    resolution: '2K',
    description: 'Story verticale pour Instagram/TikTok',
    icon: '📱',
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    aspectRatio: '4:5',
    resolution: '2K',
    description: 'Post optimisé pour Facebook',
    icon: '👍',
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    aspectRatio: '16:9',
    resolution: '2K',
    description: 'Bannière de couverture Facebook',
    icon: '🖼️',
  },
  {
    id: 'pinterest',
    name: 'Pinterest Pin',
    aspectRatio: '2:3',
    resolution: '2K',
    description: 'Épingle verticale pour Pinterest',
    icon: '📌',
  },
  {
    id: 'youtube',
    name: 'YouTube Thumbnail',
    aspectRatio: '16:9',
    resolution: '2K',
    description: 'Miniature YouTube',
    icon: '▶️',
  },
]
