'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SocialTemplates } from '@/components/admin/design-studio'
import type { SocialTemplate, GeneratedImage } from '@/types/design-studio'

const ADMIN_PATH = '/gestion-mon-remede-oum'

// Get image URL from Sanity asset ref
function getImageUrl(ref?: string): string | null {
  if (!ref) return null
  const match = ref.match(/^image-([a-z0-9]+)-(\d+x\d+)-(\w+)$/)
  if (match) {
    const [, id, dimensions, format] = match
    return `https://cdn.sanity.io/images/4otm8dqd/production/${id}-${dimensions}.${format}`
  }
  return null
}

interface Article {
  _id: string
  title: string
  slug: string
  mainImage?: {
    asset?: { _ref: string }
  }
}

export default function DesignStudioPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [recentGenerations, setRecentGenerations] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<SocialTemplate | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent articles without images
        const articlesRes = await fetch(`/api/gestion-mon-remede-oum/blog?limit=5`)
        const articlesData = await articlesRes.json()
        const articlesWithoutImage = (articlesData.posts || []).filter(
          (a: Article) => !a.mainImage?.asset?._ref
        )
        setArticles(articlesWithoutImage.slice(0, 3))

        // TODO: Fetch recent generations from Sanity
        // For now, we'll show an empty state
        setRecentGenerations([])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSocialTemplateSelect = (template: SocialTemplate) => {
    setSelectedTemplate(template)
    // Navigate to social generation page with template
    window.location.href = `${ADMIN_PATH}/design-studio/social?template=${template.id}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="font-display text-2xl text-forest">Design Studio</h2>
          <span className="px-2.5 py-1 bg-gradient-to-r from-gold/20 to-blush/20 text-gold text-xs font-accent uppercase tracking-wider rounded-full border border-gold/20">
            AI
          </span>
        </div>
        <p className="font-body text-sm text-ink-soft/70">
          Générez des images pour vos articles et réseaux sociaux avec l&apos;IA
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Illustrate article card */}
        <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
          <div className="p-6 border-b border-forest/5 bg-gradient-to-br from-forest/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg text-forest">Illustrer un article</h3>
                <p className="font-body text-sm text-ink-soft/70">
                  Générez l&apos;image principale ou des images pour la galerie
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-3 mb-4">
                <p className="font-accent text-xs text-forest/60 uppercase tracking-wider">
                  Articles sans image
                </p>
                {articles.map((article) => (
                  <Link
                    key={article._id}
                    href={`${ADMIN_PATH}/design-studio/article/${article._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-cream hover:bg-cream-warm border border-transparent hover:border-forest/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-forest/5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-body text-sm text-forest group-hover:text-gold transition-colors truncate">
                      {article.title}
                    </span>
                    <svg className="w-4 h-4 text-forest/30 group-hover:text-gold ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-ink-soft/60 text-center py-4">
                Tous vos articles ont une image
              </p>
            )}

            <Link
              href={`${ADMIN_PATH}/design-studio/article`}
              className={cn(
                'flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl',
                'bg-forest text-cream hover:bg-forest-deep',
                'font-body text-sm transition-all'
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Choisir un article
            </Link>
          </div>
        </div>

        {/* Social media card */}
        <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
          <div className="p-6 border-b border-forest/5 bg-gradient-to-br from-gold/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg text-forest">Créer pour les réseaux</h3>
                <p className="font-body text-sm text-ink-soft/70">
                  Instagram, Facebook, Pinterest, YouTube...
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <SocialTemplates
              selectedId={selectedTemplate?.id || null}
              onSelect={handleSocialTemplateSelect}
            />
          </div>
        </div>
      </div>

      {/* Recent generations */}
      <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
        <div className="p-6 border-b border-forest/5">
          <h3 className="font-display text-lg text-forest">Générations récentes</h3>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-forest/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-display text-lg text-forest mb-1">Aucune génération</h4>
            <p className="font-body text-sm text-ink-soft/60">
              Vos images générées apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            {recentGenerations.map((gen) => {
              const imageUrl = gen.sanityImage?.asset?._ref
                ? getImageUrl(gen.sanityImage.asset._ref)
                : gen.resultUrl

              return (
                <div
                  key={gen._id}
                  className="aspect-video rounded-xl bg-forest/5 overflow-hidden relative group"
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={gen.prompt.slice(0, 50)}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="font-body text-xs text-white line-clamp-2">
                        {gen.prompt.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
