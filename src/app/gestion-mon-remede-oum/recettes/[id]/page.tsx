'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { RecipeForm } from '@/components/admin/recipe-form'
import type { RecipeExpanded } from '@/types/admin'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditRecipePage({ params }: PageProps) {
  const { id } = use(params)
  const [recipe, setRecipe] = useState<RecipeExpanded | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_ADMIN_PATH}/recettes/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Recette non trouvée')
          } else {
            setError('Erreur lors du chargement')
          }
          return
        }
        const data = await response.json()
        setRecipe(data)
      } catch {
        setError('Erreur lors du chargement')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 font-body text-sm text-ink-soft/60">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-forest mb-1">{error || 'Recette non trouvée'}</h3>
          <p className="font-body text-sm text-ink-soft/60 mb-4">
            La recette que vous cherchez n&apos;existe pas ou a été supprimée.
          </p>
          <Link
            href={`${ADMIN_PATH}/recettes`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg font-body text-sm hover:bg-forest/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux recettes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN_PATH}/recettes`}
          className="p-2 text-ink-soft/50 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="font-display text-2xl text-forest">Modifier la recette</h2>
          <p className="font-body text-sm text-ink-soft/70 mt-1">
            {recipe.title}
          </p>
        </div>
      </div>

      {/* Form */}
      <RecipeForm recipe={recipe} isEdit />
    </div>
  )
}
