import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Author {
  _id: string
  name: string
  slug?: { current: string }
  image?: SanityImage
  bio?: PortableTextBlock[]
  certifications?: string[]
  socialLinks?: {
    instagram?: string
    facebook?: string
    youtube?: string
  }
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
  body?: PortableTextBlock[]
  author?: Author
  categories?: Category[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface Recipe {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: 'facile' | 'moyen' | 'difficile'
  ingredients?: Array<{
    _key: string
    name: string
    quantity: string
    unit?: string
    notes?: string
  }>
  steps?: Array<{
    _key: string
    title?: string
    description: string
    image?: SanityImage
  }>
  tips?: string[]
  healthBenefits?: string[]
  categories?: Category[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}
