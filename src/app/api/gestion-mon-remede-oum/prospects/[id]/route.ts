import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { Prospect } from '@/types/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const prospect = await client.fetch<Prospect>(
      `*[_type == "questionnaireSubmission" && _id == $id][0]{
        _id,
        firstName,
        lastName,
        email,
        age,
        totalScore,
        profile,
        categoryScores,
        answers,
        status,
        notes,
        submittedAt
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
