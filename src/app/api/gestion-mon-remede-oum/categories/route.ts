import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import type { Category, CreateCategoryInput } from '@/types/admin'

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

export async function GET() {
  try {
    const query = `*[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      color
    }`

    const categories = await client.fetch<Category[]>(query)

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Categories list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateCategoryInput = await request.json()

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      )
    }

    const slug = body.slug?.trim() || generateSlug(body.title)

    // Check if slug already exists
    const existingCategory = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug }
    )

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    const doc = {
      _type: 'category',
      title: body.title.trim(),
      slug: { _type: 'slug', current: slug },
      description: body.description?.trim() || undefined,
      color: body.color || undefined,
    }

    const result = await client.create(doc)

    return NextResponse.json({
      category: {
        _id: result._id,
        title: result.title,
        slug: slug,
        description: result.description,
        color: result.color,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}
