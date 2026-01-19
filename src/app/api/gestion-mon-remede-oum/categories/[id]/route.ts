import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import type { UpdateCategoryInput } from '@/types/admin'

// Helper to generate slug from title
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const query = `*[_type == "category" && _id == $id][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      color
    }`

    const category = await client.fetch(query, { id })

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Category fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la catégorie' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateCategoryInput = await request.json()

    // Check if category exists
    const existingCategory = await client.fetch(
      `*[_type == "category" && _id == $id][0]`,
      { id }
    )

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    // Build patch object
    const patch: Record<string, unknown> = {}

    if (body.title?.trim()) {
      patch.title = body.title.trim()
    }

    if (body.slug !== undefined) {
      const slug = body.slug?.trim() || (body.title ? generateSlug(body.title) : undefined)
      if (slug) {
        // Check if slug is taken by another category
        const slugExists = await client.fetch(
          `*[_type == "category" && slug.current == $slug && _id != $id][0]`,
          { slug, id }
        )
        if (slugExists) {
          return NextResponse.json(
            { error: 'Une autre catégorie utilise déjà ce slug' },
            { status: 400 }
          )
        }
        patch.slug = { _type: 'slug', current: slug }
      }
    }

    if (body.description !== undefined) {
      patch.description = body.description?.trim() || undefined
    }

    if (body.color !== undefined) {
      patch.color = body.color || undefined
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: 'Aucune modification fournie' },
        { status: 400 }
      )
    }

    const result = await client
      .patch(id)
      .set(patch)
      .commit()

    return NextResponse.json({
      category: {
        _id: result._id,
        title: result.title,
        slug: result.slug?.current,
        description: result.description,
        color: result.color,
      }
    })
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if category exists
    const existingCategory = await client.fetch(
      `*[_type == "category" && _id == $id][0]`,
      { id }
    )

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    // Check if category is used by posts or recipes
    const usageCount = await client.fetch(
      `count(*[_type in ["post", "recipe"] && references($id)])`,
      { id }
    )

    if (usageCount > 0) {
      return NextResponse.json(
        { error: `Cette catégorie est utilisée par ${usageCount} article(s) ou recette(s). Retirez-la d'abord de ces contenus.` },
        { status: 400 }
      )
    }

    await client.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    )
  }
}
