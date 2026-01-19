import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { PostExpanded, CreatePostInput } from '@/types/admin'

// Default author ID - Zayneb Old
const DEFAULT_AUTHOR_ID = 'zayneb-old-author'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'published' | 'draft' | 'all'
    const search = searchParams.get('search')
    const categoryId = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filter = '_type == "post"'

    // Filter by publish status
    if (status === 'published') {
      filter += ' && defined(publishedAt)'
    } else if (status === 'draft') {
      filter += ' && !defined(publishedAt)'
    }

    // Filter by search
    if (search) {
      filter += ` && (title match "*${search}*" || excerpt match "*${search}*")`
    }

    // Filter by category
    if (categoryId) {
      filter += ` && "${categoryId}" in categories[]._ref`
    }

    const query = `{
      "posts": *[${filter}] | order(coalesce(publishedAt, _createdAt) desc) [${offset}...${offset + limit}] {
        _id,
        title,
        "slug": slug.current,
        author->{
          _id,
          name,
          image
        },
        mainImage,
        gallery,
        categories[]->{
          _id,
          title,
          "slug": slug.current
        },
        publishedAt,
        excerpt,
        featured,
        seo,
        _createdAt,
        _updatedAt
      },
      "total": count(*[${filter}])
    }`

    const result = await client.fetch<{ posts: PostExpanded[]; total: number }>(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Posts list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostInput = await request.json()

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Le titre et le slug sont requis' },
        { status: 400 }
      )
    }

    // Check for duplicate slug
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "post" && slug.current == $slug][0]{ _id }`,
      { slug: body.slug }
    )

    if (existing) {
      return NextResponse.json(
        { error: 'Un article avec ce slug existe déjà' },
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
      _type: 'post' as const,
      title: body.title,
      slug: { _type: 'slug' as const, current: body.slug },
      author: { _type: 'reference' as const, _ref: authorId },
      excerpt: body.excerpt || undefined,
      body: body.body || undefined,
      featured: body.featured || false,
      seo: body.seo || undefined,
    } as { _type: 'post'; [key: string]: unknown }

    // Add main image if provided
    if (body.mainImage?.asset?._ref) {
      doc.mainImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: body.mainImage.asset._ref },
        alt: body.mainImage.alt || body.title,
      }
    }

    // Add gallery if provided
    if (body.gallery && body.gallery.length > 0) {
      doc.gallery = body.gallery.map((img) => ({
        _key: img._key,
        _type: 'image',
        asset: { _type: 'reference', _ref: img.asset._ref },
        alt: img.alt || '',
      }))
    }

    // Add categories if provided
    if (body.categoryIds && body.categoryIds.length > 0) {
      doc.categories = body.categoryIds.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: id,
      }))
    }

    // Add publishedAt if provided (publish immediately)
    if (body.publishedAt) {
      doc.publishedAt = body.publishedAt
    }

    const newPost = await writeClient.create(doc)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    )
  }
}
