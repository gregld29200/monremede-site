import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import { isValidTelegramChatId } from '@/lib/telegram'
import type { CreateTelegramChannelInput, TelegramChannel } from '@/types/telegram'

function normalizeChannelInput(body: CreateTelegramChannelInput) {
  return {
    title: body.title.trim(),
    chatId: body.chatId.trim(),
    username: body.username?.trim().replace(/^@/, '') || undefined,
    description: body.description?.trim() || undefined,
    isActive: body.isActive !== false,
  }
}

function validateChannelInput(body: CreateTelegramChannelInput) {
  const normalized = normalizeChannelInput(body)

  if (!normalized.title) {
    return { error: 'Le nom du canal est requis.' }
  }

  if (!normalized.chatId) {
    return { error: 'Le chat ID du canal est requis.' }
  }

  if (!isValidTelegramChatId(normalized.chatId)) {
    return { error: 'Utilisez un @username Telegram ou un identifiant numérique valide.' }
  }

  return { value: normalized }
}

export async function GET() {
  try {
    const channels = await client.fetch<TelegramChannel[]>(
      `*[_type == "telegramChannel"] | order(isActive desc, title asc) {
        _id,
        _type,
        title,
        chatId,
        username,
        description,
        isActive,
        _createdAt,
        _updatedAt
      }`
    )

    return NextResponse.json({ channels })
  } catch (error) {
    console.error('Telegram channels list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des canaux Telegram.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateTelegramChannelInput
    const validated = validateChannelInput(body)

    if ('error' in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "telegramChannel" && chatId == $chatId][0]{ _id }`,
      { chatId: validated.value.chatId }
    )

    if (existing) {
      return NextResponse.json(
        { error: 'Un canal Telegram avec ce chat ID existe déjà.' },
        { status: 409 }
      )
    }

    const created = await writeClient.create({
      _type: 'telegramChannel',
      ...validated.value,
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Telegram channel create error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du canal Telegram.' },
      { status: 500 }
    )
  }
}

