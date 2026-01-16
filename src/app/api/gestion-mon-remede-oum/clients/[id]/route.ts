import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { Client, UpdateClientInput } from '@/types/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const clientData = await client.fetch<Client>(
      `*[_type == "client" && _id == $id][0]{
        _id,
        firstName,
        lastName,
        email,
        phone,
        birthDate,
        address,
        status,
        source,
        linkedSubmission->{
          _id,
          totalScore,
          profile,
          submittedAt
        },
        healthProfile,
        consultationType,
        internalNotes,
        createdAt,
        lastContactAt
      }`,
      { id }
    )

    if (!clientData) {
      return NextResponse.json(
        { error: 'Cliente non trouvee' },
        { status: 404 }
      )
    }

    return NextResponse.json(clientData)
  } catch (error) {
    console.error('Client detail error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de la cliente' },
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
    const updates: UpdateClientInput = await request.json()

    // Build patch object
    const patchData: Record<string, unknown> = {}

    if (updates.firstName !== undefined) patchData.firstName = updates.firstName
    if (updates.lastName !== undefined) patchData.lastName = updates.lastName
    if (updates.email !== undefined) patchData.email = updates.email
    if (updates.phone !== undefined) patchData.phone = updates.phone
    if (updates.birthDate !== undefined) patchData.birthDate = updates.birthDate
    if (updates.address !== undefined) patchData.address = updates.address
    if (updates.status !== undefined) patchData.status = updates.status
    if (updates.healthProfile !== undefined) patchData.healthProfile = updates.healthProfile
    if (updates.consultationType !== undefined) patchData.consultationType = updates.consultationType
    if (updates.internalNotes !== undefined) patchData.internalNotes = updates.internalNotes
    if (updates.lastContactAt !== undefined) patchData.lastContactAt = updates.lastContactAt

    const result = await writeClient
      .patch(id)
      .set(patchData)
      .commit()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Update client error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la cliente' },
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

    // Archive instead of delete
    await writeClient
      .patch(id)
      .set({ status: 'archive' })
      .commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Archive client error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'archivage de la cliente' },
      { status: 500 }
    )
  }
}
