'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { RecipeExpanded, Category, SanityImage, BlockContent, Ingredient, RecipeStep, RecipeDifficulty } from '@/types/admin'
import { AdminImageUpload } from './admin-image-upload'
import { AdminSlugInput } from './admin-slug-input'
import { AdminRichEditor } from './admin-rich-editor'
import { AdminIngredientsEditor } from './admin-ingredients-editor'
import { AdminStepsEditor } from './admin-steps-editor'
import { AdminTagsInput } from './admin-tags-input'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

// Common health benefits suggestions
const healthBenefitsSuggestions = [
  'Riche en fibres',
  'Riche en protéines',
  'Riche en antioxydants',
  'Riche en vitamines',
  'Riche en minéraux',
  'Anti-inflammatoire',
  'Bon pour la digestion',
  'Boost immunitaire',
  'Énergie naturelle',
  'Santé cardiaque',
  'Santé des os',
  'Peau saine',
  'Sans gluten',
  'Sans lactose',
  'Vegan',
  'Faible en calories',
]

interface RecipeFormProps {
  recipe?: RecipeExpanded | null
  isEdit?: boolean
}

export function RecipeForm({ recipe, isEdit = false }: RecipeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeSection, setActiveSection] = useState(0)

  // Form state
  const [title, setTitle] = useState(recipe?.title || '')
  const [slug, setSlug] = useState(recipe?.slug?.current || '')
  const [description, setDescription] = useState(recipe?.description || '')
  const [mainImage, setMainImage] = useState<SanityImage | null>(
    recipe?.mainImage || null
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    recipe?.categories?.map((c) => c._id) || []
  )
  const [prepTime, setPrepTime] = useState<number | ''>(recipe?.prepTime || '')
  const [cookTime, setCookTime] = useState<number | ''>(recipe?.cookTime || '')
  const [servings, setServings] = useState<number | ''>(recipe?.servings || '')
  const [difficulty, setDifficulty] = useState<RecipeDifficulty | ''>(recipe?.difficulty || '')
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || [])
  const [steps, setSteps] = useState<RecipeStep[]>(recipe?.steps || [])
  const [healthBenefits, setHealthBenefits] = useState<string[]>(recipe?.healthBenefits || [])
  const [tips, setTips] = useState<BlockContent[]>(recipe?.tips || [])
  const [featured, setFeatured] = useState(recipe?.featured || false)

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
        description: description.trim() || undefined,
        mainImage: mainImage || undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        prepTime: prepTime || undefined,
        cookTime: cookTime || undefined,
        servings: servings || undefined,
        difficulty: difficulty || undefined,
        ingredients: ingredients.length > 0 ? ingredients : undefined,
        steps: steps.length > 0 ? steps : undefined,
        healthBenefits: healthBenefits.length > 0 ? healthBenefits : undefined,
        tips: tips.length > 0 ? tips : undefined,
        featured,
        publishedAt: publish ? new Date().toISOString() : undefined,
      }

      const url = isEdit
        ? `${API_ADMIN_PATH}/recettes/${recipe?._id}`
        : `${API_ADMIN_PATH}/recettes`

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      router.push(`${ADMIN_PATH}/recettes`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }, [title, slug, description, mainImage, selectedCategories, prepTime, cookTime, servings, difficulty, ingredients, steps, healthBenefits, tips, featured, isEdit, recipe?._id, router])

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }, [])

  const sections = [
    { id: 'info', label: 'Informations' },
    { id: 'time', label: 'Temps & Portions' },
    { id: 'ingredients', label: 'Ingrédients' },
    { id: 'steps', label: 'Étapes' },
    { id: 'health', label: 'Bienfaits' },
  ]

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(false)
      }}
      className="space-y-6"
    >
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-body text-sm">
          {error}
        </div>
      )}

      {/* Section tabs (mobile) */}
      <div className="lg:hidden overflow-x-auto pb-2">
        <div className="flex gap-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(index)}
              className={cn(
                'px-4 py-2 rounded-lg font-body text-sm whitespace-nowrap transition-colors',
                activeSection === index
                  ? 'bg-gold text-white'
                  : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section navigation (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(index)}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg font-body text-sm text-left transition-colors',
                  activeSection === index
                    ? 'bg-gold/10 text-gold'
                    : 'text-forest/60 hover:bg-forest/5 hover:text-forest'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                    activeSection === index
                      ? 'bg-gold text-white'
                      : 'bg-forest/10 text-forest/50'
                  )}>
                    {index + 1}
                  </span>
                  {section.label}
                </span>
              </button>
            ))}

            {/* Actions on sidebar */}
            <div className="pt-6 space-y-3">
              {/* Status indicator */}
              {isEdit && (
                <div className="flex items-center gap-2 pb-3 px-4">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      recipe?.publishedAt ? 'bg-emerald-500' : 'bg-amber-500'
                    )}
                  />
                  <span className="font-body text-sm text-ink-soft/70">
                    {recipe?.publishedAt ? 'Publiée' : 'Brouillon'}
                  </span>
                </div>
              )}

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer px-4">
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
                  Mise en avant
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-forest/5 text-forest rounded-xl font-body text-sm hover:bg-forest/10 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gold text-white rounded-xl font-body text-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Publication...' : isEdit && recipe?.publishedAt ? 'Mettre à jour' : 'Publier'}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section 1: Basic Info */}
          <section className={cn(activeSection !== 0 && 'hidden lg:block')}>
            <div className="bg-white border border-forest/5 rounded-2xl p-6 space-y-6">
              <h3 className="font-display text-lg text-forest">Informations de base</h3>

              {/* Title */}
              <div>
                <label className="block font-accent text-sm text-forest tracking-wide mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la recette"
                  className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>

              {/* Slug */}
              <AdminSlugInput
                value={slug}
                onChange={setSlug}
                sourceValue={title}
                prefix="/recettes/"
                description="URL de la recette"
              />

              {/* Main image */}
              <AdminImageUpload
                value={mainImage}
                onChange={setMainImage}
                label="Photo du plat"
                description="Photo principale de la recette"
              />

              {/* Description */}
              <div>
                <label className="block font-accent text-sm text-forest tracking-wide mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Présentez votre recette en quelques phrases..."
                  rows={3}
                  className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-sm text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 resize-none"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block font-accent text-sm text-forest tracking-wide mb-2">
                  Catégories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.length === 0 ? (
                    <p className="font-body text-sm text-ink-soft/50">
                      Aucune catégorie disponible
                    </p>
                  ) : (
                    categories.map((category) => (
                      <label
                        key={category._id}
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors border',
                          selectedCategories.includes(category._id)
                            ? 'bg-gold/10 border-gold/30 text-gold'
                            : 'bg-forest/5 border-transparent text-forest/70 hover:bg-forest/10'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryToggle(category._id)}
                          className="sr-only"
                        />
                        <span className="font-body text-sm">{category.title}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Time & Portions */}
          <section className={cn(activeSection !== 1 && 'hidden lg:block')}>
            <div className="bg-white border border-forest/5 rounded-2xl p-6 space-y-6">
              <h3 className="font-display text-lg text-forest">Temps et portions</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Prep time */}
                <div>
                  <label className="block font-accent text-sm text-forest tracking-wide mb-2">
                    Préparation
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 pr-12 border border-forest/10 rounded-xl font-body text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-ink-soft/50">
                      min
                    </span>
                  </div>
                </div>

                {/* Cook time */}
                <div>
                  <label className="block font-accent text-sm text-forest tracking-wide mb-2">
                    Cuisson
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 pr-12 border border-forest/10 rounded-xl font-body text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-ink-soft/50">
                      min
                    </span>
                  </div>
                </div>

                {/* Servings */}
                <div>
                  <label className="block font-accent text-sm text-forest tracking-wide mb-2">
                    Portions
                  </label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="4"
                    min="1"
                    className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-forest placeholder:text-ink-soft/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block font-accent text-sm text-forest tracking-wide mb-2">
                    Difficulté
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty | '')}
                    className="w-full px-4 py-3 border border-forest/10 rounded-xl font-body text-forest bg-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  >
                    <option value="">Choisir...</option>
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Ingredients */}
          <section className={cn(activeSection !== 2 && 'hidden lg:block')}>
            <div className="bg-white border border-forest/5 rounded-2xl p-6">
              <AdminIngredientsEditor
                value={ingredients}
                onChange={setIngredients}
                description="Ajoutez les ingrédients avec leurs quantités"
              />
            </div>
          </section>

          {/* Section 4: Steps */}
          <section className={cn(activeSection !== 3 && 'hidden lg:block')}>
            <div className="bg-white border border-forest/5 rounded-2xl p-6">
              <AdminStepsEditor
                value={steps}
                onChange={setSteps}
                description="Décrivez chaque étape de la préparation"
              />
            </div>
          </section>

          {/* Section 5: Health & Tips */}
          <section className={cn(activeSection !== 4 && 'hidden lg:block')}>
            <div className="bg-white border border-forest/5 rounded-2xl p-6 space-y-6">
              <h3 className="font-display text-lg text-forest">Bienfaits et conseils</h3>

              {/* Health benefits */}
              <AdminTagsInput
                value={healthBenefits}
                onChange={setHealthBenefits}
                label="Bienfaits santé"
                description="Les bienfaits nutritionnels de cette recette"
                suggestions={healthBenefitsSuggestions}
              />

              {/* Tips */}
              <AdminRichEditor
                value={tips}
                onChange={setTips}
                label="Conseils et variantes"
                description="Astuces, variantes ou conseils de conservation"
                placeholder="Partagez vos conseils..."
                minHeight="150px"
              />
            </div>
          </section>

          {/* Mobile actions */}
          <div className="lg:hidden space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-forest/5 rounded-xl">
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
                Recette mise en avant
              </span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-forest/5 text-forest rounded-xl font-body text-sm hover:bg-forest/10 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gold text-white rounded-xl font-body text-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
