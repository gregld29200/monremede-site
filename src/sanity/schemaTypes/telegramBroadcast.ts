import { defineArrayMember, defineField, defineType } from 'sanity'

export const telegramBroadcast = defineType({
  name: 'telegramBroadcast',
  title: 'Envoi Telegram',
  type: 'document',
  fields: [
    defineField({
      name: 'sourceType',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Message libre', value: 'custom' },
          { title: 'Article', value: 'post' },
          { title: 'Recette', value: 'recipe' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourcePost',
      title: 'Article source',
      type: 'reference',
      weak: true,
      to: [{ type: 'post' }],
      hidden: ({ parent }) => parent?.sourceType !== 'post',
    }),
    defineField({
      name: 'sourceRecipe',
      title: 'Recette source',
      type: 'reference',
      weak: true,
      to: [{ type: 'recipe' }],
      hidden: ({ parent }) => parent?.sourceType !== 'recipe',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 8,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Texte du bouton',
      type: 'string',
    }),
    defineField({
      name: 'buttonUrl',
      title: 'URL du bouton',
      type: 'url',
    }),
    defineField({
      name: 'imageUrl',
      title: 'URL image',
      type: 'url',
    }),
    defineField({
      name: 'channels',
      title: 'Canaux ciblés',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          weak: true,
          to: [{ type: 'telegramChannel' }],
        }),
      ],
    }),
    defineField({
      name: 'sentAt',
      title: 'Envoyé le',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Statut global',
      type: 'string',
      options: {
        list: [
          { title: 'Succès', value: 'success' },
          { title: 'Partiel', value: 'partial' },
          { title: 'Échec', value: 'failed' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'results',
      title: 'Résultats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'channel',
              title: 'Canal',
              type: 'reference',
              weak: true,
              to: [{ type: 'telegramChannel' }],
            }),
            defineField({
              name: 'channelName',
              title: 'Nom du canal',
              type: 'string',
            }),
            defineField({
              name: 'chatId',
              title: 'Chat ID',
              type: 'string',
            }),
            defineField({
              name: 'status',
              title: 'Statut',
              type: 'string',
              options: {
                list: [
                  { title: 'Succès', value: 'success' },
                  { title: 'Échec', value: 'failed' },
                ],
              },
            }),
            defineField({
              name: 'messageId',
              title: 'Message ID',
              type: 'number',
            }),
            defineField({
              name: 'error',
              title: 'Erreur',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: 'channelName',
              status: 'status',
              subtitle: 'error',
            },
            prepare({ title, status, subtitle }) {
              const icon = status === 'success' ? '✅' : '❌'
              return {
                title: `${icon} ${title || 'Canal'}`,
                subtitle,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sentAt: 'sentAt',
      status: 'status',
    },
    prepare({ title, sentAt, status }) {
      const icon = {
        success: '✅',
        partial: '⚠️',
        failed: '❌',
      }[status as string] || '📨'

      const date = sentAt ? new Date(sentAt).toLocaleString('fr-FR') : 'Date inconnue'

      return {
        title: `${icon} ${title || 'Envoi Telegram'}`,
        subtitle: date,
      }
    },
  },
  orderings: [
    {
      title: 'Plus récents',
      name: 'sentAtDesc',
      by: [{ field: 'sentAt', direction: 'desc' }],
    },
  ],
})

