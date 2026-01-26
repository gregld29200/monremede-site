import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import type { UnifiedProspect } from '@/types/admin'

// Create read client at request time (no CDN for admin routes)
function getReadClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-01-13',
    useCdn: false, // No CDN for admin - need real-time data
  })
}

// Create write client at request time to ensure env vars are available
function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!token) {
    console.error('[Sanity Delete] SANITY_API_WRITE_TOKEN is not configured')
    throw new Error('SANITY_API_WRITE_TOKEN is not configured')
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-01-13',
    useCdn: false,
    token,
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = getReadClient()

    // Query both document types
    const prospect = await client.fetch<UnifiedProspect | null>(
      `*[_id == $id && _type in ["questionnaireSubmission", "leadMagnetSubscriber"]][0]{
        _id,
        _type,
        "sourceTag": select(
          _type == "questionnaireSubmission" => "questionnaire-sante",
          _type == "leadMagnetSubscriber" => "cadeau-ramadan",
          "autre"
        ),
        firstName,
        lastName,
        email,
        phone,
        age,
        "status": coalesce(status, "nouveau"),
        "submittedAt": coalesce(submittedAt, subscribedAt),
        notes,
        totalScore,
        profile,
        categoryScores,
        answers,
        acquisitionSource,
        wantsConsultation,
        hasConsultedNaturopath,
        source
      }`,
      { id }
    )

    if (!prospect) {
      return NextResponse.json(
        { error: 'Prospect non trouve' },
        { status: 404 }
      )
    }

    return NextResponse.json(prospect)
  } catch (error) {
    console.error('Prospect detail error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du prospect' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    const writeClient = getWriteClient()

    // Only allow updating status and notes
    const allowedUpdates: Record<string, unknown> = {}
    if (updates.status) allowedUpdates.status = updates.status
    if (updates.notes !== undefined) allowedUpdates.notes = updates.notes

    const result = await writeClient
      .patch(id)
      .set(allowedUpdates)
      .commit()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Prospect update error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du prospect' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = getReadClient()
    const writeClient = getWriteClient()

    console.log('[Prospect Delete] Attempting to delete:', id)

    // Verify the document exists and is one of the allowed types
    const existing = await client.fetch(
      `*[_id == $id && _type in ["questionnaireSubmission", "leadMagnetSubscriber"]][0]{ _id, _type }`,
      { id }
    )

    if (!existing) {
      console.log('[Prospect Delete] Document not found:', id)
      return NextResponse.json(
        { error: 'Prospect non trouvé' },
        { status: 404 }
      )
    }

    // Delete the document
    console.log('[Prospect Delete] Deleting document:', id, 'type:', existing._type)
    await writeClient.delete(id)
    console.log('[Prospect Delete] Successfully deleted:', id)

    return NextResponse.json({ success: true, message: 'Prospect supprimé avec succès' })
  } catch (error) {
    console.error('Prospect delete error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du prospect' },
      { status: 500 }
    )
  }
}
