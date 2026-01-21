'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { PostExpanded, Category, SanityImage, GalleryImage, BlockContent, SEO } from '@/types/admin'
import { AdminImageUpload } from './admin-image-upload'
import { AdminGalleryUpload } from './admin-gallery-upload'
import { AdminSlugInput } from './admin-slug-input'
import { BlockEditor } from './block-editor'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface BlogFormProps {
  post?: PostExpanded | null
  isEdit?: boolean
}

export function BlogForm({ post, isEdit = false }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  // Form state
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug?.current || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [body, setBody] = useState<BlockContent[]>(post?.body || [])
  const [mainImage, setMainImage] = useState<SanityImage | null>(
    post?.mainImage || null
  )
  const [gallery, setGallery] = useState<GalleryImage[]>(post?.gallery || [])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map((c) => c._id) || []
  )
  const [featured, setFeatured] = useState(post?.featured || false)
  const [seo, setSeo] = useState<SEO>(post?.seo || {})

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_ADMIN_PATH}/categories`)
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = useCallback(async (publish: boolean = false) => {
    if (!title.trim()) {
      setError('Le titre est requis')
      return
    }
    if (!slug.trim()) {
      setError('Le slug est requis')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        body: body.length > 0 ? body : undefined,
        mainImage: mainImage || undefined,
        gallery: gallery.length > 0 ? gallery : undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        featured,
        seo: seo.metaTitle || seo.metaDescription ? seo : undefined,
        publishedAt: publish ? new Date().toISOString() : undefined,
      }

      const url = isEdit
        ? `${API_ADMIN_PATH}/blog/${post?._id}`
        : `${API_ADMIN_PATH}/blog`

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      router.push(`${ADMIN_PATH}/blog`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }, [title, slug, excerpt, body, mainImage, gallery, selectedCategories, featured, seo, isEdit, post?._id, router])

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }, [])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(false)
      }}
      className="space-y-8"
    >
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-body text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block font-accent text-sm text-forest tracking-wide mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'article"
              className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>

          {/* Slug */}
          <AdminSlugInput
            value={slug}
            onChange={setSlug}
            sourceValue={title}
            prefix="/blog/"
            description="URL de l'article. Générée automatiquement depuis le titre."
          />

          {/* Excerpt */}
          <div>
            <label className="block font-accent text-sm text-forest tracking-wide mb-2">
              Extrait
            </label>
            <p className="text-xs text-ink-soft/60 mb-2">
              Court résumé affiché dans les aperçus et les résultats de recherche.
            </p>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumez votre article en 2-3 phrases..."
              rows={3}
              className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 resize-none"
            />
          </div>

          {/* Body */}
          <BlockEditor
            value={body}
            onChange={setBody}
            label="Contenu"
            description="Le contenu principal de votre article."
            placeholder="Commencez à écrire votre article..."
            minHeight="400px"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white border border-forest/5 rounded-2xl p-5 space-y-4">
            <h3 className="font-accent text-sm text-forest tracking-wide uppercase">
              Publication
            </h3>

            {/* Status indicator */}
            {isEdit && (
              <div className="flex items-center gap-2 pb-3 border-b border-forest/5">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    post?.publishedAt ? 'bg-emerald-500' : 'bg-amber-500'
                  )}
                />
                <span className="font-body text-sm text-ink-soft/70">
                  {post?.publishedAt ? 'Publié' : 'Brouillon'}
                </span>
              </div>
            )}

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'w-10 h-6 rounded-full transition-colors',
                    featured ? 'bg-gold' : 'bg-forest/10'
                  )}
                />
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                    featured ? 'left-5' : 'left-1'
                  )}
                />
              </div>
              <span className="font-body text-sm text-forest">
                Article mis en avant
              </span>
            </label>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-forest/5 text-forest rounded-xl font-body text-sm hover:bg-forest/10 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le brouillon'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gold text-white rounded-xl font-body text-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Publication...' : isEdit && post?.publishedAt ? 'Mettre à jour' : 'Publier'}
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="bg-white border border-forest/5 rounded-2xl p-5">
            <AdminImageUpload
              value={mainImage}
              onChange={setMainImage}
              label="Image principale"
              description="Image de couverture de l'article"
              aspectRatio="16:9"
              recommendedWidth={1200}
              recommendedHeight={675}
            />
          </div>

          {/* Gallery */}
          <div className="bg-white border border-forest/5 rounded-2xl p-5">
            <AdminGalleryUpload
              value={gallery}
              onChange={setGallery}
              label="Galerie d'images"
              description="Images supplémentaires pour l'article"
              maxImages={8}
              aspectRatio="4:3"
              recommendedWidth={800}
              recommendedHeight={600}
            />
          </div>

          {/* Categories */}
          <div className="bg-white border border-forest/5 rounded-2xl p-5 space-y-4">
            <h3 className="font-accent text-sm text-forest tracking-wide uppercase">
              Catégories
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="font-body text-sm text-ink-soft/50">
                  Aucune catégorie disponible
                </p>
              ) : (
                categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="w-4 h-4 rounded border-forest/20 text-gold focus:ring-gold/20"
                    />
                    <span className="font-body text-sm text-forest">
                      {category.title}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-forest/5 rounded-2xl p-5 space-y-4">
            <h3 className="font-accent text-sm text-forest tracking-wide uppercase">
              SEO
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block font-body text-xs text-ink-soft/70 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seo.metaTitle || ''}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  placeholder={title || 'Titre pour les moteurs de recherche'}
                  className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-ink-soft/70 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={seo.metaDescription || ''}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  placeholder={excerpt || 'Description pour les moteurs de recherche'}
                  rows={2}
                  className="w-full px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
