import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import type { Category } from '@/types/admin'

export async function GET() {
  try {
    const query = `*[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description
    }`

    const categories = await client.fetch<Category[]>(query)

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Categories list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}
