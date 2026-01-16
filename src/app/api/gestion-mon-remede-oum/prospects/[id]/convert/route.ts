import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { Prospect } from '@/types/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { consultationType, internalNotes } = body

    // Fetch the prospect
    const prospect = await client.fetch<Prospect>(
      `*[_type == "questionnaireSubmission" && _id == $id][0]{
        _id,
        firstName,
        lastName,
        email,
        age,
        totalScore,
        profile,
        categoryScores
      }`,
      { id }
    )

    if (!prospect) {
      return NextResponse.json(
        { error: 'Prospect non trouve' },
        { status: 404 }
      )
    }

    // Determine health concerns from category scores
    const concerns: string[] = []
    if (prospect.categoryScores) {
      const scores = prospect.categoryScores
      if (scores.digestionTransit && scores.digestionTransit > 3) concerns.push('digestion')
      if (scores.energieVitalite && scores.energieVitalite > 3) concerns.push('fatigue')
      if (scores.sommeil && scores.sommeil > 3) concerns.push('sommeil')
      if (scores.emotionsMental && scores.emotionsMental > 3) concerns.push('stress')
      if (scores.peauCheveux && scores.peauCheveux > 3) concerns.push('peau')
      if (scores.douleursInconforts && scores.douleursInconforts > 3) concerns.push('douleurs')
    }

    // Create the client document
    const newClient = await writeClient.create({
      _type: 'client',
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      email: prospect.email,
      status: 'actif',
      source: 'questionnaire',
      linkedSubmission: {
        _type: 'reference',
        _ref: prospect._id,
      },
      healthProfile: {
        concerns: concerns.length > 0 ? concerns : undefined,
      },
      consultationType: consultationType || undefined,
      internalNotes: internalNotes || undefined,
      createdAt: new Date().toISOString(),
    })

    // Update prospect status to converted
    await writeClient
      .patch(id)
      .set({ status: 'converti' })
      .commit()

    return NextResponse.json({
      success: true,
      clientId: newClient._id,
    })
  } catch (error) {
    console.error('Convert prospect error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la conversion du prospect' },
      { status: 500 }
    )
  }
}
