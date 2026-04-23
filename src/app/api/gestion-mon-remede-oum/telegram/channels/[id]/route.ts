import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import { isValidTelegramChatId } from '@/lib/telegram'
import type { UpdateTelegramChannelInput } from '@/types/telegram'

function normalizeChannelInput(body: UpdateTelegramChannelInput) {
  return {
    title: body.title?.trim(),
    chatId: body.chatId?.trim(),
    username: body.username?.trim().replace(/^@/, '') || undefined,
    description: body.description?.trim() || undefined,
    isActive: body.isActive,
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as UpdateTelegramChannelInput
    const normalized = normalizeChannelInput(body)

    if (normalized.title !== undefined && !normalized.title) {
      return NextResponse.json(
        { error: 'Le nom du canal ne peut pas être vide.' },
        { status: 400 }
      )
    }

    if (normalized.chatId !== undefined && !normalized.chatId) {
      return NextResponse.json(
        { error: 'Le chat ID du canal ne peut pas être vide.' },
        { status: 400 }
      )
    }

    if (normalized.chatId && !isValidTelegramChatId(normalized.chatId)) {
      return NextResponse.json(
        { error: 'Utilisez un @username Telegram ou un identifiant numérique valide.' },
        { status: 400 }
      )
    }

    if (normalized.chatId) {
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "telegramChannel" && chatId == $chatId && _id != $id][0]{ _id }`,
        { chatId: normalized.chatId, id }
      )

      if (existing) {
        return NextResponse.json(
          { error: 'Un autre canal utilise déjà ce chat ID.' },
          { status: 409 }
        )
      }
    }

    const patch: Record<string, unknown> = {}

    if (normalized.title !== undefined) patch.title = normalized.title
    if (normalized.chatId !== undefined) patch.chatId = normalized.chatId
    if (body.username !== undefined) patch.username = normalized.username
    if (body.description !== undefined) patch.description = normalized.description
    if (normalized.isActive !== undefined) patch.isActive = normalized.isActive

    const updated = await writeClient.patch(id).set(patch).commit()

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Telegram channel update error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du canal Telegram.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await writeClient.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Telegram channel delete error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du canal Telegram.' },
      { status: 500 }
    )
  }
}

