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

      {/* Quick actions grid - Variant C: Minimal with Accent Borders */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Illustrate article card */}
        <div className="group bg-white rounded-2xl border-l-4 border-l-forest border border-forest/8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg text-forest">Illustrer un article</h3>
                <p className="font-body text-sm text-ink-soft/50">Image principale ou galerie</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-1 mb-5">
                {articles.map((article) => (
                  <Link
                    key={article._id}
                    href={`${ADMIN_PATH}/design-studio/article/${article._id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-forest/[0.03] transition-colors group/item"
                  >
                    <div className="w-2 h-2 rounded-full bg-blush flex-shrink-0" />
                    <span className="font-body text-sm text-ink/80 truncate">{article.title}</span>
                    <svg className="w-4 h-4 text-forest/0 group-hover/item:text-forest/40 flex-shrink-0 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 mb-4">
                <p className="font-body text-sm text-forest/50">Tous vos articles ont une image</p>
              </div>
            )}

            <Link
              href={`${ADMIN_PATH}/design-studio/article`}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-forest text-cream hover:bg-forest-deep font-body text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Choisir un article
            </Link>
          </div>
        </div>

        {/* Social media card */}
        <div className="group bg-white rounded-2xl border-l-4 border-l-gold border border-forest/8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg text-forest">Réseaux sociaux</h3>
                <p className="font-body text-sm text-ink-soft/50">Instagram, Facebook, Pinterest...</p>
              </div>
            </div>

            <SocialTemplates
              selectedId={selectedTemplate?.id || null}
              onSelect={handleSocialTemplateSelect}
            />
          </div>
        </div>

        {/* Quote card */}
        <div className="group bg-white rounded-2xl border-l-4 border-l-blush border border-forest/8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blush/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-forest">Cartes citations</h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-accent uppercase tracking-wider bg-gold/15 text-gold rounded flex-shrink-0">Nouveau</span>
                </div>
                <p className="font-body text-sm text-ink-soft/50">Visuels avec texte</p>
              </div>
            </div>

            <div className="bg-forest/[0.02] rounded-xl p-6 mb-5">
              <div className="w-12 h-12 rounded-lg bg-blush/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blush-deep/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <p className="font-body text-xs text-forest/50 text-center">Citations inspirantes avec fond IA ou personnalisé</p>
            </div>

            <Link
              href={`${ADMIN_PATH}/design-studio/quote`}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blush-deep text-white hover:bg-blush-deep/90 font-body text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Créer une carte
            </Link>
          </div>
        </div>
      </div>

      {/* Recent generations */}
      <div className="bg-white rounded-2xl border border-forest/8 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-forest/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-forest">Générations récentes</h3>
          </div>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="relative p-16 text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h4 className="font-display text-lg text-forest mb-2">Aucune génération</h4>
              <p className="font-body text-sm text-forest/50 max-w-sm mx-auto">
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
                  className="aspect-video rounded-xl bg-forest/5 overflow-hidden relative group border border-forest/5"
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
