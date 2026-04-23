import { urlFor } from '@/sanity/lib/image'
import type { BlockContent } from '@/types/admin'
import type { TelegramContentItem } from '@/types/telegram'

const FALLBACK_SITE_URL = 'https://www.monremede.com'

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function truncateText(value: string, maxLength: number): string {
  const trimmed = normalizeWhitespace(value)

  if (trimmed.length <= maxLength) {
    return trimmed
  }

  const shortened = trimmed.slice(0, maxLength - 1)
  const lastSpace = shortened.lastIndexOf(' ')
  const safeCut = lastSpace > maxLength * 0.6 ? shortened.slice(0, lastSpace) : shortened

  return `${safeCut.trimEnd()}…`
}

export function portableTextToPlainText(blocks?: BlockContent[]): string {
  if (!blocks || blocks.length === 0) {
    return ''
  }

  return blocks
    .filter((block) => block._type === 'block' && block.children)
    .map((block) =>
      block.children
        ?.map((child) => child.text)
        .join(' ')
        .trim()
    )
    .filter(Boolean)
    .join('\n\n')
    .trim()
}

export function buildTelegramContentUrl(contentType: 'post' | 'recipe', slug: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
  const basePath = contentType === 'post' ? 'blog' : 'recettes'

  return `${siteUrl.replace(/\/$/, '')}/${basePath}/${slug}`
}

export function buildDefaultTelegramMessage(content: TelegramContentItem): string {
  const summarySource = content._type === 'post'
    ? content.excerpt || portableTextToPlainText(content.body)
    : content.description || portableTextToPlainText(content.tips)

  const summary = summarySource ? truncateText(summarySource, 360) : ''

  return [content.title.trim(), summary].filter(Boolean).join('\n\n')
}

export function buildDefaultTelegramButton(content: TelegramContentItem): { label: string; url: string } {
  return {
    label: content._type === 'post' ? 'Lire l’article' : 'Voir la recette',
    url: buildTelegramContentUrl(content._type, content.slug),
  }
}

export function getTelegramImageUrl(content?: Pick<TelegramContentItem, 'mainImage'>): string {
  if (!content?.mainImage?.asset?._ref) {
    return ''
  }

  return urlFor(content.mainImage).width(1600).fit('max').auto('format').url()
}

