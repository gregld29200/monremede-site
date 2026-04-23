import type { TelegramChannel } from '@/types/telegram'

const TELEGRAM_TEXT_LIMIT = 4096
const TELEGRAM_CAPTION_LIMIT = 1024

interface TelegramMessageResponse {
  message_id: number
}

interface TelegramApiSuccess<T> {
  ok: true
  result: T
}

interface TelegramApiFailure {
  ok: false
  error_code?: number
  description?: string
}

function getTelegramBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN

  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN n’est pas configuré.')
  }

  return token
}

function normalizeMessageText(message: string): string {
  return message.replace(/\r\n/g, '\n').trim()
}

function buildInlineKeyboard(buttonLabel?: string, buttonUrl?: string) {
  if (!buttonLabel || !buttonUrl) {
    return undefined
  }

  return {
    inline_keyboard: [[{ text: buttonLabel, url: buttonUrl }]],
  }
}

async function telegramRequest<T>(method: string, payload: Record<string, unknown>): Promise<T> {
  const token = getTelegramBotToken()
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  const data = (await response.json()) as TelegramApiSuccess<T> | TelegramApiFailure

  if (!response.ok || !data.ok) {
    const description = 'description' in data ? data.description : undefined
    throw new Error(description || `Telegram API error (${response.status})`)
  }

  return data.result
}

export function isValidTelegramChatId(chatId: string): boolean {
  const value = chatId.trim()
  return /^@[\w\d_]{4,}$/.test(value) || /^-?\d+$/.test(value)
}

export async function sendTelegramPost({
  channel,
  title,
  message,
  imageUrl,
  buttonLabel,
  buttonUrl,
  disableNotification = false,
}: {
  channel: Pick<TelegramChannel, '_id' | 'title' | 'chatId'>
  title: string
  message: string
  imageUrl?: string
  buttonLabel?: string
  buttonUrl?: string
  disableNotification?: boolean
}): Promise<{ messageId: number }> {
  const normalizedTitle = title.trim()
  const normalizedMessage = normalizeMessageText(message)
  const finalText = [normalizedTitle, normalizedMessage]
    .filter(Boolean)
    .join('\n\n')
    .trim()

  if (!finalText) {
    throw new Error('Le message Telegram est vide.')
  }

  if (finalText.length > TELEGRAM_TEXT_LIMIT) {
    throw new Error(`Le message dépasse la limite Telegram de ${TELEGRAM_TEXT_LIMIT} caractères.`)
  }

  const replyMarkup = buildInlineKeyboard(buttonLabel, buttonUrl)

  if (imageUrl?.trim() && finalText.length <= TELEGRAM_CAPTION_LIMIT) {
    const result = await telegramRequest<TelegramMessageResponse>('sendPhoto', {
      chat_id: channel.chatId,
      photo: imageUrl.trim(),
      caption: finalText,
      disable_notification: disableNotification,
      reply_markup: replyMarkup,
    })

    return { messageId: result.message_id }
  }

  const result = await telegramRequest<TelegramMessageResponse>('sendMessage', {
    chat_id: channel.chatId,
    text: finalText,
    disable_notification: disableNotification,
    reply_markup: replyMarkup,
  })

  return { messageId: result.message_id }
}
