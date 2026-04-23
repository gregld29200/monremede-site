import type { BlockContent, SanityImage } from './admin'

export type TelegramSourceType = 'custom' | 'post' | 'recipe'
export type TelegramDeliveryStatus = 'success' | 'failed'
export type TelegramBroadcastStatus = 'success' | 'partial' | 'failed'

export interface TelegramChannel {
  _id: string
  _type: 'telegramChannel'
  title: string
  chatId: string
  username?: string
  description?: string
  isActive?: boolean
  _createdAt?: string
  _updatedAt?: string
}

export interface CreateTelegramChannelInput {
  title: string
  chatId: string
  username?: string
  description?: string
  isActive?: boolean
}

export type UpdateTelegramChannelInput = Partial<CreateTelegramChannelInput>

export interface TelegramContentItem {
  _id: string
  _type: 'post' | 'recipe'
  title: string
  slug: string
  excerpt?: string
  description?: string
  body?: BlockContent[]
  tips?: BlockContent[]
  mainImage?: SanityImage
  publishedAt?: string
}

export interface TelegramBroadcastResult {
  _key: string
  channel?: {
    _ref: string
    _type: 'reference'
  }
  channelName: string
  chatId: string
  status: TelegramDeliveryStatus
  messageId?: number
  error?: string
}

export interface TelegramBroadcast {
  _id: string
  _type: 'telegramBroadcast'
  sourceType: TelegramSourceType
  title: string
  message: string
  buttonLabel?: string
  buttonUrl?: string
  imageUrl?: string
  status: TelegramBroadcastStatus
  sentAt: string
  channels?: Array<{
    _ref: string
    _type: 'reference'
  }>
  sourcePost?: {
    _ref: string
    _type: 'reference'
  }
  sourceRecipe?: {
    _ref: string
    _type: 'reference'
  }
  results?: TelegramBroadcastResult[]
  _createdAt?: string
  _updatedAt?: string
}

export interface TelegramSendInput {
  sourceType: TelegramSourceType
  sourceId?: string
  title: string
  message: string
  buttonLabel?: string
  buttonUrl?: string
  imageUrl?: string
  channelIds: string[]
  disableNotification?: boolean
}

export interface TelegramSendResponse {
  success: boolean
  broadcastId?: string
  status?: TelegramBroadcastStatus
  results?: TelegramBroadcastResult[]
  error?: string
}

