import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { Client, CreateClientInput } from '@/types/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filter = '_type == "client"'

    if (status && status !== 'all') {
      filter += ` && status == "${status}"`
    }

    if (search) {
      filter += ` && (firstName match "*${search}*" || lastName match "*${search}*" || email match "*${search}*")`
    }

    const query = `{
      "clients": *[${filter}] | order(lastName asc) [${offset}...${offset + limit}] {
        _id,
        firstName,
        lastName,
        email,
        phone,
        status,
        source,
        consultationType,
        createdAt,
        lastContactAt
      },
      "total": count(*[${filter}])
    }`

    const result = await client.fetch<{ clients: Client[]; total: number }>(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Clients list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des clientes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateClientInput = await request.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: 'Prenom, nom et email sont requis' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "client" && email == $email][0]{ _id }`,
      { email: body.email }
    )

    if (existing) {
      return NextResponse.json(
        { error: 'Une cliente avec cet email existe deja' },
        { status: 409 }
      )
    }

    // Create the client
    const newClient = await writeClient.create({
      _type: 'client',
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || undefined,
      birthDate: body.birthDate || undefined,
      address: body.address || undefined,
      status: body.status || 'actif',
      source: body.source || 'manuel',
      healthProfile: body.healthProfile || undefined,
      consultationType: body.consultationType || undefined,
      internalNotes: body.internalNotes || undefined,
      linkedSubmission: body.linkedSubmissionId
        ? { _type: 'reference', _ref: body.linkedSubmissionId }
        : undefined,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la cliente' },
      { status: 500 }
    )
  }
}
