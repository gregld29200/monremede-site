import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import type { TelegramBroadcast } from '@/types/telegram'

export async function GET() {
  try {
    const broadcasts = await client.fetch<TelegramBroadcast[]>(
      `*[_type == "telegramBroadcast"] | order(sentAt desc, _createdAt desc) [0...30] {
        _id,
        _type,
        sourceType,
        title,
        message,
        buttonLabel,
        buttonUrl,
        imageUrl,
        status,
        sentAt,
        channels[] {
          _ref,
          _type
        },
        sourcePost {
          _ref,
          _type
        },
        sourceRecipe {
          _ref,
          _type
        },
        results[] {
          _key,
          channel {
            _ref,
            _type
          },
          channelName,
          chatId,
          status,
          messageId,
          error
        },
        _createdAt,
        _updatedAt
      }`
    )

    return NextResponse.json({ broadcasts })
  } catch (error) {
    console.error('Telegram broadcasts list error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l’historique Telegram.' },
      { status: 500 }
    )
  }
}

