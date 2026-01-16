import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { ClientNote, CreateNoteInput } from '@/types/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const notes = await client.fetch<ClientNote[]>(
      `*[_type == "clientNote" && client._ref == $id] | order(createdAt desc) {
        _id,
        content,
        type,
        createdAt
      }`,
      { id }
    )

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Notes list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des notes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: Omit<CreateNoteInput, 'clientId'> = await request.json()

    if (!body.content) {
      return NextResponse.json(
        { error: 'Le contenu de la note est requis' },
        { status: 400 }
      )
    }

    const newNote = await writeClient.create({
      _type: 'clientNote',
      client: {
        _type: 'reference',
        _ref: id,
      },
      content: body.content,
      type: body.type || 'general',
      createdAt: new Date().toISOString(),
    })

    // Update client's lastContactAt
    await writeClient
      .patch(id)
      .set({ lastContactAt: new Date().toISOString() })
      .commit()

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error('Create note error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la note' },
      { status: 500 }
    )
  }
}
