// Client types
export interface ClientAddress {
  street?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface ClientHealthProfile {
  concerns?: string[]
  allergies?: string
  medications?: string
}

export type ClientStatus = 'actif' | 'pause' | 'archive'
export type ClientSource = 'questionnaire' | 'import' | 'manuel' | 'recommandation'
export type ConsultationType = 'sante-generale' | 'troubles-digestifs' | 'equilibre-hormonal' | 'suivi-complet'

export interface Client {
  _id: string
  _type: 'client'
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  address?: ClientAddress
  status: ClientStatus
  source: ClientSource
  linkedSubmission?: {
    _ref: string
    _type: 'reference'
  }
  healthProfile?: ClientHealthProfile
  consultationType?: ConsultationType
  internalNotes?: string
  createdAt?: string
  lastContactAt?: string
}

// Client Note types
export type NoteType = 'appel' | 'email' | 'consultation' | 'general' | 'important'

export interface ClientNote {
  _id: string
  _type: 'clientNote'
  client: {
    _ref: string
    _type: 'reference'
  }
  content: string
  type: NoteType
  createdAt?: string
}

export interface ClientNoteWithClient extends Omit<ClientNote, 'client'> {
  client: {
    _id: string
    firstName: string
    lastName: string
  }
}

// Prospect types (questionnaire submission)
export type ProspectProfile = 'equilibre' | 'alerte' | 'difficulte' | 'urgent'
export type ProspectStatus = 'nouveau' | 'contacte' | 'discussion' | 'converti' | 'non_interesse'

export interface ProspectCategoryScores {
  etatGeneral?: number
  energieVitalite?: number
  digestionTransit?: number
  alimentationComportement?: number
  emotionsMental?: number
  sommeil?: number
  peauCheveux?: number
  douleursInconforts?: number
  modeVie?: number
}

export interface ProspectAnswer {
  questionId?: string
  questionText?: string
  answerText?: string
  points?: number
  additionalInfo?: string
}

export interface Prospect {
  _id: string
  _type: 'questionnaireSubmission'
  firstName: string
  lastName: string
  email: string
  age: number
  totalScore?: number
  profile?: ProspectProfile
  categoryScores?: ProspectCategoryScores
  answers?: ProspectAnswer[]
  status: ProspectStatus
  notes?: string
  submittedAt?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalClients: number
  activeClients: number
  newProspects: number
  pendingProspects: number
  recentActivity: RecentActivity[]
}

export interface RecentActivity {
  id: string
  type: 'new_prospect' | 'new_client' | 'note_added' | 'status_change'
  title: string
  description: string
  timestamp: string
}

// Form types
export interface CreateClientInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  address?: ClientAddress
  status?: ClientStatus
  source?: ClientSource
  healthProfile?: ClientHealthProfile
  consultationType?: ConsultationType
  internalNotes?: string
  linkedSubmissionId?: string
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  lastContactAt?: string
}

export interface CreateNoteInput {
  clientId: string
  content: string
  type: NoteType
}

// CSV Import
export interface CSVImportRow {
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  city?: string
  postalCode?: string
  country?: string
  consultationType?: string
  notes?: string
}

export interface CSVImportResult {
  success: number
  failed: number
  errors: Array<{
    row: number
    error: string
  }>
}

// ============================================
// BLOG & RECIPES TYPES
// ============================================

// Category type (shared between blog and recipes)
export type CategoryColor = 'forest' | 'sage' | 'gold' | 'blush'

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: { current: string }
  description?: string
  color?: CategoryColor
}

export interface CreateCategoryInput {
  title: string
  slug?: string
  description?: string
  color?: CategoryColor
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>

// Author type
export interface Author {
  _id: string
  _type: 'author'
  name: string
  slug?: { current: string }
  image?: SanityImage
  bio?: BlockContent[]
}

// Sanity image type
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// Image layout options
export type ImageLayout = 'full' | 'center' | 'left' | 'right'
export type ImageSize = 'small' | 'medium' | 'large'

// Block content type (for rich text)
export interface BlockContent {
  _type: 'block' | 'image'
  _key: string
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
  children?: Array<{
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: 'link'
    _key: string
    href: string
  }>
  listItem?: 'bullet' | 'number'
  level?: number
  // For images in block content
  asset?: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  layout?: ImageLayout
  size?: ImageSize
}

// SEO type
export interface SEO {
  metaTitle?: string
  metaDescription?: string
}

// Gallery image type
export interface GalleryImage extends SanityImage {
  _key: string
}

// Blog Post types
export interface Post {
  _id: string
  _type: 'post'
  title: string
  slug: { current: string }
  author?: {
    _ref: string
    _type: 'reference'
  }
  mainImage?: SanityImage
  gallery?: GalleryImage[]
  categories?: Array<{
    _ref: string
    _type: 'reference'
  }>
  publishedAt?: string
  excerpt?: string
  body?: BlockContent[]
  featured?: boolean
  seo?: SEO
  _createdAt?: string
  _updatedAt?: string
}

// Expanded post with resolved references
export interface PostExpanded extends Omit<Post, 'author' | 'categories'> {
  author?: Author
  categories?: Category[]
}

// Recipe types
export type RecipeDifficulty = 'easy' | 'medium' | 'hard'

export interface Ingredient {
  _key?: string
  quantity?: string
  ingredient: string
  notes?: string
}

export interface RecipeStep {
  _key?: string
  step: string
  image?: SanityImage
  tip?: string
}

export interface Recipe {
  _id: string
  _type: 'recipe'
  title: string
  slug: { current: string }
  author?: {
    _ref: string
    _type: 'reference'
  }
  mainImage?: SanityImage
  gallery?: GalleryImage[]
  categories?: Array<{
    _ref: string
    _type: 'reference'
  }>
  publishedAt?: string
  description?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: RecipeDifficulty
  ingredients?: Ingredient[]
  steps?: RecipeStep[]
  healthBenefits?: string[]
  tips?: BlockContent[]
  featured?: boolean
  _createdAt?: string
  _updatedAt?: string
}

// Expanded recipe with resolved references
export interface RecipeExpanded extends Omit<Recipe, 'author' | 'categories'> {
  author?: Author
  categories?: Category[]
}

// Form input types for creating/updating
export interface CreatePostInput {
  title: string
  slug: string
  authorId?: string
  mainImage?: SanityImage
  gallery?: GalleryImage[]
  categoryIds?: string[]
  publishedAt?: string
  excerpt?: string
  body?: BlockContent[]
  featured?: boolean
  seo?: SEO
}

export type UpdatePostInput = Partial<CreatePostInput>

export interface CreateRecipeInput {
  title: string
  slug: string
  authorId?: string
  mainImage?: SanityImage
  gallery?: GalleryImage[]
  categoryIds?: string[]
  publishedAt?: string
  description?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: RecipeDifficulty
  ingredients?: Ingredient[]
  steps?: RecipeStep[]
  healthBenefits?: string[]
  tips?: BlockContent[]
  featured?: boolean
}

export type UpdateRecipeInput = Partial<CreateRecipeInput>

// API response types
export interface PostListResponse {
  posts: PostExpanded[]
  total: number
}

export interface RecipeListResponse {
  recipes: RecipeExpanded[]
  total: number
}
