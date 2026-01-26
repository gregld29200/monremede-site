'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Article {
  _id: string
  title: string
  slug: string
  mainImage?: {
    asset?: { _ref: string }
  }
  excerpt?: string
  _createdAt: string
}

interface ArticleSelectorProps {
  selectedId?: string
  onSelect: (article: Article) => void
  articleType?: 'post' | 'recipe'
}

export function ArticleSelector({ selectedId, onSelect, articleType = 'post' }: ArticleSelectorProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const endpoint = articleType === 'post'
          ? '/api/gestion-mon-remede-oum/blog'
          : '/api/gestion-mon-remede-oum/recettes'

        const response = await fetch(`${endpoint}?limit=100`)
        const data = await response.json()
        setArticles(data.posts || data.recipes || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [articleType])

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un article..."
          className="w-full pl-10 pr-4 py-2.5 bg-cream border border-forest/10 rounded-lg
                     font-body text-sm text-ink placeholder:text-ink-soft/50
                     focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
        />
      </div>

      {/* Articles list */}
      <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
        {filteredArticles.length === 0 ? (
          <p className="text-center py-8 text-ink-soft/70 font-body text-sm">
            Aucun article trouvé
          </p>
        ) : (
          filteredArticles.map((article) => (
            <button
              key={article._id}
              onClick={() => onSelect(article)}
              className={cn(
                'w-full p-4 rounded-xl border text-left transition-all',
                selectedId === article._id
                  ? 'bg-gold/10 border-gold/30 ring-2 ring-gold/20'
                  : 'bg-cream hover:bg-cream-warm border-forest/10 hover:border-forest/20'
              )}
            >
              <h4 className="font-display text-sm text-forest font-medium line-clamp-1">
                {article.title}
              </h4>
              {article.excerpt && (
                <p className="mt-1 font-body text-xs text-ink-soft/70 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
