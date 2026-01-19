'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { PostExpanded, Category } from '@/types/admin'
import { SearchInput } from '@/components/admin/search-input'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

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

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<PostExpanded[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [total, setTotal] = useState(0)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter) params.append('category', categoryFilter)

      const response = await fetch(`${API_ADMIN_PATH}/blog?${params}`)
      const data = await response.json()
      setPosts(data.posts || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, searchTerm, categoryFilter])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_ADMIN_PATH}/categories`)
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handlePublishToggle = async (post: PostExpanded) => {
    const action = post.publishedAt ? 'unpublish' : 'publish'
    try {
      const response = await fetch(`${API_ADMIN_PATH}/blog/${post._id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }

  const handleDelete = async (post: PostExpanded) => {
    if (post.publishedAt) {
      alert('Dépubliez l\'article avant de le supprimer.')
      return
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return

    try {
      const response = await fetch(`${API_ADMIN_PATH}/blog/${post._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-forest">Articles de blog</h2>
          <p className="font-body text-sm text-ink-soft/70 mt-1">
            {total} article{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href={`${ADMIN_PATH}/blog/nouveau`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-white rounded-xl font-body text-sm hover:bg-gold/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher un article..."
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest bg-white focus:outline-none focus:border-gold/50"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-forest/10 rounded-lg font-body text-sm text-forest bg-white focus:outline-none focus:border-gold/50"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts list */}
      <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 font-body text-sm text-ink-soft/60">Chargement...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-forest/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-forest mb-1">Aucun article</h3>
            <p className="font-body text-sm text-ink-soft/60 mb-4">
              Commencez par créer votre premier article de blog.
            </p>
            <Link
              href={`${ADMIN_PATH}/blog/nouveau`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg font-body text-sm hover:bg-gold/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer un article
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-forest/5 border-b border-forest/5">
              <tr>
                <th className="px-4 py-3 text-left font-accent text-xs text-forest/70 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-4 py-3 text-left font-accent text-xs text-forest/70 uppercase tracking-wider">
                  Catégories
                </th>
                <th className="px-4 py-3 text-left font-accent text-xs text-forest/70 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left font-accent text-xs text-forest/70 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-right font-accent text-xs text-forest/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/5">
              {posts.map((post, index) => {
                const imageUrl = getImageUrl(post.mainImage?.asset?._ref)
                return (
                  <tr
                    key={post._id}
                    className="hover:bg-forest/[0.02] transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg bg-forest/5 overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-forest/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`${ADMIN_PATH}/blog/${post._id}`}
                            className="font-body text-sm text-forest hover:text-gold transition-colors font-medium truncate block"
                          >
                            {post.title}
                          </Link>
                          <p className="font-body text-xs text-ink-soft/50 truncate">
                            /{post.slug?.current}
                          </p>
                        </div>
                        {post.featured && (
                          <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-accent uppercase tracking-wider rounded-full">
                            Mis en avant
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.categories?.map((cat) => (
                          <span
                            key={cat._id}
                            className="px-2 py-0.5 bg-sage/10 text-sage text-xs rounded-full font-body"
                          >
                            {cat.title}
                          </span>
                        ))}
                        {(!post.categories || post.categories.length === 0) && (
                          <span className="text-xs text-ink-soft/40">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body',
                          post.publishedAt
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            post.publishedAt ? 'bg-emerald-500' : 'bg-amber-500'
                          )}
                        />
                        {post.publishedAt ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-body text-sm text-ink-soft/70">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : post._createdAt
                          ? new Date(post._createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`${ADMIN_PATH}/blog/${post._id}`}
                          className="p-2 text-ink-soft/50 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handlePublishToggle(post)}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            post.publishedAt
                              ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                          )}
                          title={post.publishedAt ? 'Dépublier' : 'Publier'}
                        >
                          {post.publishedAt ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="p-2 text-ink-soft/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
