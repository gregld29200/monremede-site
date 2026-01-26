import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { UnifiedProspect } from '@/types/admin'

interface ConvertRequestBody {
  consultationType?: string
  internalNotes?: string
  lastName?: string // Required for leadMagnetSubscriber
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: ConvertRequestBody = await request.json()
    const { consultationType, internalNotes, lastName: providedLastName } = body

    // Fetch the prospect (both types)
    const prospect = await client.fetch<UnifiedProspect | null>(
      `*[_id == $id && _type in ["questionnaireSubmission", "leadMagnetSubscriber"]][0]{
        _id,
        _type,
        firstName,
        lastName,
        email,
        phone,
        age,
        totalScore,
        profile,
        categoryScores,
        acquisitionSource,
        wantsConsultation,
        hasConsultedNaturopath
      }`,
      { id }
    )

    if (!prospect) {
      return NextResponse.json(
        { error: 'Prospect non trouve' },
        { status: 404 }
      )
    }

    // For leadMagnetSubscriber, lastName is required in the request
    const finalLastName = prospect.lastName || providedLastName
    if (!finalLastName) {
      return NextResponse.json(
        { error: 'Le nom de famille est requis pour la conversion' },
        { status: 400 }
      )
    }

    // Determine health concerns from category scores (only for questionnaire)
    const concerns: string[] = []
    if (prospect._type === 'questionnaireSubmission' && prospect.categoryScores) {
      const scores = prospect.categoryScores
      if (scores.digestionTransit && scores.digestionTransit > 3) concerns.push('digestion')
      if (scores.energieVitalite && scores.energieVitalite > 3) concerns.push('fatigue')
      if (scores.sommeil && scores.sommeil > 3) concerns.push('sommeil')
      if (scores.emotionsMental && scores.emotionsMental > 3) concerns.push('stress')
      if (scores.peauCheveux && scores.peauCheveux > 3) concerns.push('peau')
      if (scores.douleursInconforts && scores.douleursInconforts > 3) concerns.push('douleurs')
    }

    // Determine source based on document type
    const clientSource = prospect._type === 'questionnaireSubmission' ? 'questionnaire' : 'lead-magnet'

    // Build internal notes with acquisition info for lead magnet
    let notes = internalNotes || ''
    if (prospect._type === 'leadMagnetSubscriber') {
      const acquisitionInfo: string[] = []
      if (prospect.acquisitionSource) acquisitionInfo.push(`Canal: ${prospect.acquisitionSource}`)
      if (prospect.wantsConsultation) acquisitionInfo.push(`Souhaite consultation: ${prospect.wantsConsultation}`)
      if (prospect.hasConsultedNaturopath) acquisitionInfo.push(`A consulté naturopathe: ${prospect.hasConsultedNaturopath}`)
      if (acquisitionInfo.length > 0) {
        notes = notes ? `${notes}\n\n[Infos lead magnet]\n${acquisitionInfo.join('\n')}` : `[Infos lead magnet]\n${acquisitionInfo.join('\n')}`
      }
    }

    // Create the client document
    const newClient = await writeClient.create({
      _type: 'client',
      firstName: prospect.firstName,
      lastName: finalLastName,
      email: prospect.email,
      phone: prospect.phone || undefined,
      status: 'actif',
      source: clientSource,
      linkedSubmission: {
        _type: 'reference',
        _ref: prospect._id,
      },
      healthProfile: {
        concerns: concerns.length > 0 ? concerns : undefined,
      },
      consultationType: consultationType || undefined,
      internalNotes: notes || undefined,
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
