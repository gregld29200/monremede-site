import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { RecipeExpanded, UpdateRecipeInput } from '@/types/admin'
import crypto from 'crypto'

// Generate short unique ID
function generateKey(): string {
  return crypto.randomUUID().slice(0, 8)
}

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const query = `*[_type == "recipe" && _id == $id][0] {
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
      ingredients,
      steps,
      healthBenefits,
      tips,
      featured,
      _createdAt,
      _updatedAt
    }`

    const recipe = await client.fetch<RecipeExpanded | null>(query, { id })

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Get recipe error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la recette' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body: UpdateRecipeInput = await request.json()

    // Check if recipe exists
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "recipe" && _id == $id][0]{ _id }`,
      { id }
    )

    if (!existing) {
      return NextResponse.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      )
    }

    // Check for duplicate slug if changed
    if (body.slug) {
      const duplicateSlug = await client.fetch<{ _id: string } | null>(
        `*[_type == "recipe" && slug.current == $slug && _id != $id][0]{ _id }`,
        { slug: body.slug, id }
      )

      if (duplicateSlug) {
        return NextResponse.json(
          { error: 'Une recette avec ce slug existe déjà' },
          { status: 409 }
        )
      }
    }

    // Build patch
    const patch: Record<string, unknown> = {}
    const unset: string[] = []

    if (body.title !== undefined) {
      patch.title = body.title
    }

    if (body.slug !== undefined) {
      patch.slug = { _type: 'slug', current: body.slug }
    }

    if (body.description !== undefined) {
      if (body.description) {
        patch.description = body.description
      } else {
        unset.push('description')
      }
    }

    if (body.prepTime !== undefined) {
      if (body.prepTime !== null) {
        patch.prepTime = body.prepTime
      } else {
        unset.push('prepTime')
      }
    }

    if (body.cookTime !== undefined) {
      if (body.cookTime !== null) {
        patch.cookTime = body.cookTime
      } else {
        unset.push('cookTime')
      }
    }

    if (body.servings !== undefined) {
      if (body.servings !== null) {
        patch.servings = body.servings
      } else {
        unset.push('servings')
      }
    }

    if (body.difficulty !== undefined) {
      if (body.difficulty) {
        patch.difficulty = body.difficulty
      } else {
        unset.push('difficulty')
      }
    }

    if (body.featured !== undefined) {
      patch.featured = body.featured
    }

    if (body.healthBenefits !== undefined) {
      if (body.healthBenefits && body.healthBenefits.length > 0) {
        patch.healthBenefits = body.healthBenefits
      } else {
        unset.push('healthBenefits')
      }
    }

    if (body.tips !== undefined) {
      if (body.tips && body.tips.length > 0) {
        patch.tips = body.tips
      } else {
        unset.push('tips')
      }
    }

    // Handle main image
    if (body.mainImage !== undefined) {
      if (body.mainImage?.asset?._ref) {
        patch.mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: body.mainImage.asset._ref },
          alt: body.mainImage.alt || body.title,
        }
      } else {
        unset.push('mainImage')
      }
    }

    // Handle categories
    if (body.categoryIds !== undefined) {
      if (body.categoryIds && body.categoryIds.length > 0) {
        patch.categories = body.categoryIds.map((catId) => ({
          _type: 'reference',
          _ref: catId,
          _key: catId,
        }))
      } else {
        unset.push('categories')
      }
    }

    // Handle author
    if (body.authorId !== undefined) {
      if (body.authorId) {
        patch.author = { _type: 'reference', _ref: body.authorId }
      }
    }

    // Handle ingredients
    if (body.ingredients !== undefined) {
      if (body.ingredients && body.ingredients.length > 0) {
        patch.ingredients = body.ingredients.map((ing) => ({
          _key: ing._key || generateKey(),
          _type: 'object',
          quantity: ing.quantity || '',
          ingredient: ing.ingredient,
          notes: ing.notes || '',
        }))
      } else {
        unset.push('ingredients')
      }
    }

    // Handle steps
    if (body.steps !== undefined) {
      if (body.steps && body.steps.length > 0) {
        patch.steps = body.steps.map((step) => {
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
      } else {
        unset.push('steps')
      }
    }

    // Handle publishedAt
    if (body.publishedAt !== undefined) {
      if (body.publishedAt) {
        patch.publishedAt = body.publishedAt
      } else {
        unset.push('publishedAt')
      }
    }

    // Execute patch
    let transaction = writeClient.patch(id).set(patch)
    if (unset.length > 0) {
      transaction = transaction.unset(unset)
    }
    const updatedRecipe = await transaction.commit()

    return NextResponse.json(updatedRecipe)
  } catch (error) {
    console.error('Update recipe error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la recette' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if recipe exists
    const existing = await client.fetch<{ _id: string; publishedAt: string | null } | null>(
      `*[_type == "recipe" && _id == $id][0]{ _id, publishedAt }`,
      { id }
    )

    if (!existing) {
      return NextResponse.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      )
    }

    // Only allow deletion of unpublished recipes (drafts)
    if (existing.publishedAt) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une recette publiée. Dépubliez-la d\'abord.' },
        { status: 400 }
      )
    }

    await writeClient.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete recipe error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la recette' },
      { status: 500 }
    )
  }
}
