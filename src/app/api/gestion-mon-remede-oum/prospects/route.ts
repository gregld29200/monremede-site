import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import type { Prospect } from '@/types/admin'

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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filter = '_type == "questionnaireSubmission"'

    if (status && status !== 'all') {
      filter += ` && status == "${status}"`
    }

    if (search) {
      filter += ` && (firstName match "*${search}*" || lastName match "*${search}*" || email match "*${search}*")`
    }

    const query = `{
      "prospects": *[${filter}] | order(submittedAt desc) [${offset}...${offset + limit}] {
        _id,
        firstName,
        lastName,
        email,
        age,
        totalScore,
        profile,
        status,
        notes,
        submittedAt
      },
      "total": count(*[${filter}])
    }`

    const result = await client.fetch<{ prospects: Prospect[]; total: number }>(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Prospects list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des prospects' },
      { status: 500 }
    )
  }
}
