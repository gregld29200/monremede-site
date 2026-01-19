import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { RecipeExpanded, CreateRecipeInput } from '@/types/admin'
import crypto from 'crypto'

// Generate short unique ID
function generateKey(): string {
  return crypto.randomUUID().slice(0, 8)
}

// Default author ID - Zayneb Old
const DEFAULT_AUTHOR_ID = 'zayneb-old-author'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'published' | 'draft' | 'all'
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty')
    const categoryId = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filter = '_type == "recipe"'

    // Filter by publish status
    if (status === 'published') {
      filter += ' && defined(publishedAt)'
    } else if (status === 'draft') {
      filter += ' && !defined(publishedAt)'
    }

    // Filter by search
    if (search) {
      filter += ` && (title match "*${search}*" || description match "*${search}*")`
    }

    // Filter by difficulty
    if (difficulty) {
      filter += ` && difficulty == "${difficulty}"`
    }

    // Filter by category
    if (categoryId) {
      filter += ` && "${categoryId}" in categories[]._ref`
    }

    const query = `{
      "recipes": *[${filter}] | order(coalesce(publishedAt, _createdAt) desc) [${offset}...${offset + limit}] {
        _id,
        title,
        "slug": slug.current,
        author->{
          _id,
          name,
          image
        },
        mainImage,
        categories[]->{
          _id,
          title,
          "slug": slug.current
        },
        publishedAt,
        description,
        prepTime,
        cookTime,
        servings,
        difficulty,
        featured,
        _createdAt,
        _updatedAt
      },
      "total": count(*[${filter}])
    }`

    const result = await client.fetch<{ recipes: RecipeExpanded[]; total: number }>(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Recipes list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des recettes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRecipeInput = await request.json()

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Le titre et le slug sont requis' },
        { status: 400 }
      )
    }

    // Check for duplicate slug
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "recipe" && slug.current == $slug][0]{ _id }`,
      { slug: body.slug }
    )

    if (existing) {
      return NextResponse.json(
        { error: 'Une recette avec ce slug existe déjà' },
        { status: 409 }
      )
    }

    // Ensure author exists (create if needed)
    const authorId = body.authorId || DEFAULT_AUTHOR_ID
    let authorExists = await client.fetch<{ _id: string } | null>(
      `*[_type == "author" && _id == $authorId][0]{ _id }`,
      { authorId }
    )

    // If using default author and it doesn't exist, create it
    if (!authorExists && authorId === DEFAULT_AUTHOR_ID) {
      await writeClient.createIfNotExists({
        _id: DEFAULT_AUTHOR_ID,
        _type: 'author',
        name: 'Zayneb Old',
        slug: { _type: 'slug', current: 'zayneb-old' },
        role: 'Naturopathe',
      })
      authorExists = { _id: DEFAULT_AUTHOR_ID }
    }

    if (!authorExists) {
      return NextResponse.json(
        { error: 'Auteur non trouvé' },
        { status: 404 }
      )
    }

    // Build the document
    const doc = {
      _type: 'recipe' as const,
      title: body.title,
      slug: { _type: 'slug' as const, current: body.slug },
      author: { _type: 'reference' as const, _ref: authorId },
      description: body.description || undefined,
      prepTime: body.prepTime || undefined,
      cookTime: body.cookTime || undefined,
      servings: body.servings || undefined,
      difficulty: body.difficulty || undefined,
      healthBenefits: body.healthBenefits || undefined,
      tips: body.tips || undefined,
      featured: body.featured || false,
    } as { _type: 'recipe'; [key: string]: unknown }

    // Add main image if provided
    if (body.mainImage?.asset?._ref) {
      doc.mainImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: body.mainImage.asset._ref },
        alt: body.mainImage.alt || body.title,
      }
    }

    // Add categories if provided
    if (body.categoryIds && body.categoryIds.length > 0) {
      doc.categories = body.categoryIds.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: id,
      }))
    }

    // Add ingredients with keys
    if (body.ingredients && body.ingredients.length > 0) {
      doc.ingredients = body.ingredients.map((ing) => ({
        _key: ing._key || generateKey(),
        _type: 'object',
        quantity: ing.quantity || '',
        ingredient: ing.ingredient,
        notes: ing.notes || '',
      }))
    }

    // Add steps with keys
    if (body.steps && body.steps.length > 0) {
      doc.steps = body.steps.map((step) => {
        const stepDoc: Record<string, unknown> = {
          _key: step._key || generateKey(),
          _type: 'object',
          step: step.step,
          tip: step.tip || undefined,
        }
        if (step.image?.asset?._ref) {
          stepDoc.image = {
            _type: 'image',
            asset: { _type: 'reference', _ref: step.image.asset._ref },
          }
        }
        return stepDoc
      })
    }

    // Add publishedAt if provided (publish immediately)
    if (body.publishedAt) {
      doc.publishedAt = body.publishedAt
    }

    const newRecipe = await writeClient.create(doc)

    return NextResponse.json(newRecipe, { status: 201 })
  } catch (error) {
    console.error('Create recipe error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la recette' },
      { status: 500 }
    )
  }
}
