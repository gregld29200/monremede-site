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

export async function GET(request: NextRequest) {
  try {
    const client = getReadClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sourceTag = searchParams.get('source') // 'questionnaire-sante' | 'cadeau-ramadan' | 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build filter for both document types
    let typeFilter = '_type in ["questionnaireSubmission", "leadMagnetSubscriber"]'

    // Filter by source tag
    if (sourceTag && sourceTag !== 'all') {
      if (sourceTag === 'questionnaire-sante') {
        typeFilter = '_type == "questionnaireSubmission"'
      } else if (sourceTag === 'cadeau-ramadan') {
        typeFilter = '_type == "leadMagnetSubscriber"'
      }
    }

    let filter = typeFilter

    // Filter by status (use coalesce for documents without status)
    if (status && status !== 'all') {
      filter += ` && coalesce(status, "nouveau") == "${status}"`
    }

    // Filter by search (handle both document types)
    if (search) {
      filter += ` && (firstName match "*${search}*" || lastName match "*${search}*" || email match "*${search}*")`
    }

    const query = `{
      "prospects": *[${filter}] | order(coalesce(submittedAt, subscribedAt) desc) [${offset}...${offset + limit}] {
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
        acquisitionSource,
        wantsConsultation,
        hasConsultedNaturopath,
        source,
        downloadToken,
        linkSent
      },
      "total": count(*[${filter}])
    }`

    const result = await client.fetch<{ prospects: UnifiedProspect[]; total: number }>(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Prospects list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des prospects' },
      { status: 500 }
    )
  }
}
