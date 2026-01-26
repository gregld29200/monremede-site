import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body // 'publish' | 'unpublish'

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

    if (action === 'publish') {
      // Publish the post
      await writeClient
        .patch(id)
        .set({
          publishedAt: existing.publishedAt || new Date().toISOString(),
          isDraft: false
        })
        .commit()

      return NextResponse.json({
        success: true,
        message: 'Article publié avec succès',
        publishedAt: existing.publishedAt || new Date().toISOString()
      })
    } else if (action === 'unpublish') {
      // Unpublish the post (set as draft, keep publishedAt for reference)
      await writeClient
        .patch(id)
        .set({ isDraft: true })
        .commit()

      return NextResponse.json({
        success: true,
        message: 'Article dépublié avec succès'
      })
    } else {
      return NextResponse.json(
        { error: 'Action non valide. Utilisez "publish" ou "unpublish".' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Publish/unpublish post error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la publication/dépublication de l\'article' },
      { status: 500 }
    )
  }
}
