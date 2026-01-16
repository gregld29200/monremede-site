import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import type { Prospect } from '@/types/admin'

export async function GET(request: NextRequest) {
  try {
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
