import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { action } = body as { action: 'approve' | 'reject' | 'feature' | 'unfeature' }

    if (!action) {
      return NextResponse.json(
        { error: 'Action requise' },
        { status: 400 }
      )
    }

    let updates: Record<string, boolean> = {}

    switch (action) {
      case 'approve':
        updates = { approved: true }
        break
      case 'reject':
        updates = { approved: false, featured: false }
        break
      case 'feature':
        // Check if we already have 3 featured reviews
        const featuredCount = await writeClient.fetch<number>(
          `count(*[_type == "guideReview" && featured == true && _id != $id])`,
          { id }
        )
        if (featuredCount >= 3) {
          return NextResponse.json(
            { error: 'Maximum 3 avis peuvent être mis en avant' },
            { status: 400 }
          )
        }
        updates = { approved: true, featured: true }
        break
      case 'unfeature':
        updates = { featured: false }
        break
      default:
        return NextResponse.json(
          { error: 'Action invalide' },
          { status: 400 }
        )
    }

    const result = await writeClient
      .patch(id)
      .set(updates)
      .commit()

    return NextResponse.json({
      success: true,
      review: result,
    })
  } catch (error) {
    console.error('Error updating guide review:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'avis' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    await writeClient.delete(id)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting guide review:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'avis' },
      { status: 500 }
    )
  }
}
