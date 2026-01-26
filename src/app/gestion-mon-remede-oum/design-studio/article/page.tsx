'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArticleSelector } from '@/components/admin/design-studio'

const ADMIN_PATH = '/gestion-mon-remede-oum'

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

export default function ArticleSelectorPage() {
  const router = useRouter()
  const [articleType, setArticleType] = useState<'post' | 'recipe'>('post')

  const handleSelect = (article: Article) => {
    router.push(`${ADMIN_PATH}/design-studio/article/${article._id}?type=${articleType}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN_PATH}/design-studio`}
          className="p-2 text-forest/50 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="font-display text-2xl text-forest">Choisir un article</h2>
          <p className="font-body text-sm text-ink-soft/70 mt-1">
            Sélectionnez l&apos;article à illustrer
          </p>
        </div>
      </div>

      {/* Type selector */}
      <div className="flex gap-2 p-1 bg-forest/5 rounded-xl w-fit">
        <button
          onClick={() => setArticleType('post')}
          className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
            articleType === 'post'
              ? 'bg-white text-forest shadow-sm'
              : 'text-forest/60 hover:text-forest'
          }`}
        >
          Articles de blog
        </button>
        <button
          onClick={() => setArticleType('recipe')}
          className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
            articleType === 'recipe'
              ? 'bg-white text-forest shadow-sm'
              : 'text-forest/60 hover:text-forest'
          }`}
        >
          Recettes
        </button>
      </div>

      {/* Article list */}
      <div className="bg-white rounded-2xl border border-forest/5 p-6">
        <ArticleSelector
          onSelect={handleSelect}
          articleType={articleType}
        />
      </div>
    </div>
  )
}
