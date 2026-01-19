import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { PostExpanded, UpdatePostInput } from '@/types/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const query = `*[_type == "post" && _id == $id][0] {
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
      body,
      featured,
      seo,
      _createdAt,
      _updatedAt
    }`

    const post = await client.fetch<PostExpanded | null>(query, { id })

    if (!post) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body: UpdatePostInput = await request.json()

    // Check if post exists
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "post" && _id == $id][0]{ _id }`,
      { id }
    )

    if (!existing) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Check for duplicate slug if changed
    if (body.slug) {
      const duplicateSlug = await client.fetch<{ _id: string } | null>(
        `*[_type == "post" && slug.current == $slug && _id != $id][0]{ _id }`,
        { slug: body.slug, id }
      )

      if (duplicateSlug) {
        return NextResponse.json(
          { error: 'Un article avec ce slug existe déjà' },
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

    if (body.excerpt !== undefined) {
      if (body.excerpt) {
        patch.excerpt = body.excerpt
      } else {
        unset.push('excerpt')
      }
    }

    if (body.body !== undefined) {
      if (body.body && body.body.length > 0) {
        patch.body = body.body
      } else {
        unset.push('body')
      }
    }

    if (body.featured !== undefined) {
      patch.featured = body.featured
    }

    if (body.seo !== undefined) {
      if (body.seo) {
        patch.seo = body.seo
      } else {
        unset.push('seo')
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

    // Handle gallery
    if (body.gallery !== undefined) {
      if (body.gallery && body.gallery.length > 0) {
        patch.gallery = body.gallery.map((img) => ({
          _key: img._key,
          _type: 'image',
          asset: { _type: 'reference', _ref: img.asset._ref },
          alt: img.alt || '',
        }))
      } else {
        unset.push('gallery')
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
    const updatedPost = await transaction.commit()

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'article' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if post exists
    const existing = await client.fetch<{ _id: string; publishedAt: string | null } | null>(
      `*[_type == "post" && _id == $id][0]{ _id, publishedAt }`,
      { id }
    )

    if (!existing) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Only allow deletion of unpublished posts (drafts)
    if (existing.publishedAt) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un article publié. Dépubliez-le d\'abord.' },
        { status: 400 }
      )
    }

    await writeClient.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
}
