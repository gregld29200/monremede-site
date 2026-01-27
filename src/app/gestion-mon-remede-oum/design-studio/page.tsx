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
    window.location.href = `${ADMIN_PATH}/design-studio/social?template=${template.id}`
  }

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-deep via-forest to-forest-deep p-8 md:p-10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sage/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              </div>
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-accent uppercase tracking-wider rounded-full border border-gold/30 backdrop-blur-sm">
                Nano Banana Pro
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-cream mb-2">Design Studio</h1>
            <p className="font-body text-cream/70 max-w-md">
              Créez des visuels uniques pour vos articles et réseaux sociaux grâce à l&apos;intelligence artificielle
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4">
            <div className="px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="font-display text-2xl text-gold mb-0.5">$0.04</p>
              <p className="font-body text-xs text-cream/60">par image 1K</p>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="font-display text-2xl text-sage-light mb-0.5">~30s</p>
              <p className="font-body text-xs text-cream/60">génération</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Illustrate article card */}
        <div className="group relative bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-forest/10 hover:-translate-y-1">
          {/* Decorative gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-forest/5 via-transparent to-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6 border-b border-forest/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest/15 to-forest/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl text-forest">Illustrer un article</h3>
                <p className="font-body text-sm text-ink-soft/60">
                  Image principale ou galerie
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-2 mb-5">
                <p className="font-accent text-xs text-forest/50 uppercase tracking-wider mb-3">
                  Articles sans image
                </p>
                {articles.map((article) => (
                  <Link
                    key={article._id}
                    href={`${ADMIN_PATH}/design-studio/article/${article._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white border border-transparent hover:border-forest/10 transition-all group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blush/30 to-blush/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blush-deep/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <span className="font-body text-sm text-ink group-hover/item:text-forest transition-colors truncate flex-1">
                      {article.title}
                    </span>
                    <svg className="w-4 h-4 text-forest/20 group-hover/item:text-gold group-hover/item:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 mb-4">
                <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-body text-sm text-ink-soft/60">
                  Tous vos articles ont une image
                </p>
              </div>
            )}

            <Link
              href={`${ADMIN_PATH}/design-studio/article`}
              className={cn(
                'group/btn relative flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-2xl',
                'bg-gradient-to-r from-forest to-forest-deep text-cream',
                'hover:shadow-lg hover:shadow-forest/20',
                'font-body text-sm transition-all duration-300 overflow-hidden'
              )}
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="relative">Choisir un article</span>
            </Link>
          </div>
        </div>

        {/* Social media card */}
        <div className="group relative bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-1">
          {/* Decorative gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-blush/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6 border-b border-forest/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl text-forest">Créer pour les réseaux</h3>
                <p className="font-body text-sm text-ink-soft/60">
                  Instagram, Facebook, Pinterest...
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-6">
            <SocialTemplates
              selectedId={selectedTemplate?.id || null}
              onSelect={handleSocialTemplateSelect}
            />
          </div>
        </div>
      </div>

      {/* Recent generations */}
      <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 overflow-hidden">
        <div className="p-6 border-b border-forest/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage/30 to-sage/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-forest">Générations récentes</h3>
          </div>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="relative p-16 text-center overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-8 right-12 w-32 h-32 bg-sage/5 rounded-full blur-3xl" />
            <div className="absolute bottom-8 left-12 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-forest/10 to-forest/5 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h4 className="font-display text-xl text-forest mb-2">Aucune génération</h4>
              <p className="font-body text-sm text-ink-soft/60 max-w-sm mx-auto">
                Commencez à créer des images et elles apparaîtront ici pour un accès rapide
              </p>
            </div>
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
                  className="aspect-video rounded-2xl bg-gradient-to-br from-cream-warm to-cream overflow-hidden relative group border border-forest/5"
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={gen.prompt.slice(0, 50)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-body text-xs text-cream line-clamp-2">
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
