'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Category, CategoryColor } from '@/types/admin'
import { CategoryForm } from '@/components/admin/category-form'

const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

const colorLabels: Record<CategoryColor, string> = {
  forest: 'Forêt',
  sage: 'Sauge',
  gold: 'Or',
  blush: 'Rose',
}

const colorClasses: Record<CategoryColor, string> = {
  forest: 'bg-forest/10 text-forest',
  sage: 'bg-sage/20 text-sage',
  gold: 'bg-gold/20 text-gold',
  blush: 'bg-blush-deep/20 text-blush-deep',
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_ADMIN_PATH}/categories`)
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return
    }

    setDeletingId(id)
    setDeleteError(null)

    try {
      const response = await fetch(`${API_ADMIN_PATH}/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      setCategories((prev) => prev.filter((c) => c._id !== id))
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = (category: Category, isNew: boolean) => {
    if (isNew) {
      setCategories((prev) => [...prev, category].sort((a, b) => a.title.localeCompare(b.title)))
    } else {
      setCategories((prev) =>
        prev.map((c) => (c._id === category._id ? category : c))
      )
    }
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-forest">Catégories</h2>
          <p className="font-body text-sm text-ink-soft/70 mt-1">
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-white rounded-xl font-body text-sm hover:bg-gold/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle catégorie
        </button>
      </div>

      {/* Error message */}
      {deleteError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-body text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Erreur</p>
            <p>{deleteError}</p>
          </div>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="admin-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-body text-sm text-ink-soft/50 mt-4">Chargement...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-forest/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-forest mb-1">Aucune catégorie</h3>
            <p className="font-body text-sm text-ink-soft/60 mb-6">
              Créez votre première catégorie pour organiser vos articles et recettes.
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-white rounded-xl font-body text-sm hover:bg-gold/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer une catégorie
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Couleur</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>
                    <span className="font-body text-sm text-forest font-medium">
                      {category.title}
                    </span>
                  </td>
                  <td>
                    <code className="font-mono text-xs text-ink-soft/60 bg-forest/5 px-2 py-1 rounded">
                      {typeof category.slug === 'string' ? category.slug : category.slug?.current}
                    </code>
                  </td>
                  <td>
                    <span className="font-body text-sm text-ink-soft/70 line-clamp-1">
                      {category.description || '-'}
                    </span>
                  </td>
                  <td>
                    {category.color ? (
                      <span className={cn(
                        'inline-flex px-2 py-1 rounded-full text-xs font-accent uppercase tracking-wide',
                        colorClasses[category.color]
                      )}>
                        {colorLabels[category.color]}
                      </span>
                    ) : (
                      <span className="text-ink-soft/40 text-sm">-</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 rounded-lg text-forest/50 hover:text-forest hover:bg-forest/5 transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        disabled={deletingId === category._id}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          deletingId === category._id
                            ? 'text-ink-soft/30 cursor-not-allowed'
                            : 'text-red-400/60 hover:text-red-500 hover:bg-red-50'
                        )}
                        title="Supprimer"
                      >
                        {deletingId === category._id ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleModalClose}
          />

          {/* Centering wrapper */}
          <div className="min-h-full flex items-center justify-center p-4">
            {/* Modal content */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 flex flex-col animate-scale-up">
              {/* Header */}
              <div className="flex-shrink-0 bg-white px-6 py-4 border-b border-forest/5 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-display text-lg text-forest">
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="p-2 rounded-lg text-ink-soft/40 hover:text-forest hover:bg-forest/5 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form content */}
              <div className="p-6">
                <CategoryForm
                  category={editingCategory}
                  onSuccess={handleFormSuccess}
                  onCancel={handleModalClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
