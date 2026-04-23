import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramPost } from '@/lib/telegram'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type {
  TelegramBroadcastResult,
  TelegramBroadcastStatus,
  TelegramChannel,
  TelegramSendInput,
} from '@/types/telegram'

const VALID_SOURCE_TYPES = new Set(['custom', 'post', 'recipe'])

function createResultKey() {
  return crypto.randomUUID().slice(0, 12)
}

function getBroadcastStatus(results: TelegramBroadcastResult[]): TelegramBroadcastStatus {
  const successCount = results.filter((result) => result.status === 'success').length

  if (successCount === 0) {
    return 'failed'
  }

  if (successCount === results.length) {
    return 'success'
  }

  return 'partial'
}

function normalizeOptionalUrl(value?: string) {
  const trimmed = value?.trim()
  return trimmed || undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelegramSendInput
    const title = body.title?.trim()
    const message = body.message?.trim()
    const buttonLabel = body.buttonLabel?.trim() || undefined
    const buttonUrl = normalizeOptionalUrl(body.buttonUrl)
    const imageUrl = normalizeOptionalUrl(body.imageUrl)
    const sourceType = body.sourceType

    if (!VALID_SOURCE_TYPES.has(sourceType)) {
      return NextResponse.json(
        { error: 'Type de contenu Telegram invalide.' },
        { status: 400 }
      )
    }

    if (!title) {
      return NextResponse.json({ error: 'Le titre est requis.' }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ error: 'Le message est requis.' }, { status: 400 })
    }

    if (message.length > 4096) {
      return NextResponse.json(
        { error: 'Le message dépasse la limite Telegram de 4096 caractères.' },
        { status: 400 }
      )
    }

    if (!Array.isArray(body.channelIds) || body.channelIds.length === 0) {
      return NextResponse.json(
        { error: 'Sélectionnez au moins un canal Telegram.' },
        { status: 400 }
      )
    }

    if (buttonLabel && !buttonUrl) {
      return NextResponse.json(
        { error: 'Ajoutez une URL si vous définissez un bouton.' },
        { status: 400 }
      )
    }

    if (buttonUrl && !buttonLabel) {
      return NextResponse.json(
        { error: 'Ajoutez un texte de bouton si vous définissez une URL.' },
        { status: 400 }
      )
    }

    if (buttonUrl) {
      try {
        new URL(buttonUrl)
      } catch {
        return NextResponse.json(
          { error: 'L’URL du bouton est invalide.' },
          { status: 400 }
        )
      }
    }

    if (imageUrl) {
      try {
        new URL(imageUrl)
      } catch {
        return NextResponse.json(
          { error: 'L’URL de l’image est invalide.' },
          { status: 400 }
        )
      }
    }

    const fetchedChannels = await client.fetch<TelegramChannel[]>(
      `*[_type == "telegramChannel" && _id in $ids] {
        _id,
        _type,
        title,
        chatId,
        username,
        description,
        isActive
      }`,
      { ids: body.channelIds }
    )

    const channelsById = new Map(fetchedChannels.map((channel) => [channel._id, channel]))
    const channels = body.channelIds
      .map((id) => channelsById.get(id))
      .filter((channel): channel is TelegramChannel => Boolean(channel))

    if (channels.length === 0) {
      return NextResponse.json(
        { error: 'Aucun canal Telegram valide n’a été trouvé.' },
        { status: 404 }
      )
    }

    const results: TelegramBroadcastResult[] = []

    for (const channel of channels) {
      try {
        if (channel.isActive === false) {
          throw new Error('Ce canal est désactivé dans l’administration.')
        }

        const result = await sendTelegramPost({
          channel,
          title,
          message,
          imageUrl,
          buttonLabel,
          buttonUrl,
          disableNotification: body.disableNotification,
        })

        results.push({
          _key: createResultKey(),
          channel: {
            _ref: channel._id,
            _type: 'reference',
          },
          channelName: channel.title,
          chatId: channel.chatId,
          status: 'success',
          messageId: result.messageId,
        })
      } catch (error) {
        results.push({
          _key: createResultKey(),
          channel: {
            _ref: channel._id,
            _type: 'reference',
          },
          channelName: channel.title,
          chatId: channel.chatId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Erreur inconnue',
        })
      }
    }

    const status = getBroadcastStatus(results)
    const broadcast = await writeClient.create({
      _type: 'telegramBroadcast',
      sourceType,
      title,
      message,
      buttonLabel,
      buttonUrl,
      imageUrl,
      status,
      sentAt: new Date().toISOString(),
      channels: channels.map((channel) => ({
        _type: 'reference',
        _ref: channel._id,
      })),
      ...(sourceType === 'post' && body.sourceId
        ? {
            sourcePost: {
              _type: 'reference',
              _ref: body.sourceId,
            },
          }
        : {}),
      ...(sourceType === 'recipe' && body.sourceId
        ? {
            sourceRecipe: {
              _type: 'reference',
              _ref: body.sourceId,
            },
          }
        : {}),
      results,
    })

    return NextResponse.json({
      success: status !== 'failed',
      broadcastId: broadcast._id,
      status,
      results,
    })
  } catch (error) {
    console.error('Telegram send error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Erreur lors de l’envoi du message Telegram.',
      },
      { status: 500 }
    )
  }
}
