import { defineField, defineType } from 'sanity'

export const telegramChannel = defineType({
  name: 'telegramChannel',
  title: 'Canal Telegram',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'chatId',
      title: 'Chat ID / @username',
      type: 'string',
      description: 'Utilisez soit @nomducanal, soit l’identifiant numérique du canal.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) {
            return 'Le chat ID est requis'
          }

          if (/^@[\w\d_]{4,}$/.test(value) || /^-?\d+$/.test(value)) {
            return true
          }

          return 'Utilisez un @username Telegram ou un identifiant numérique'
        }),
    }),
    defineField({
      name: 'username',
      title: 'Username public',
      type: 'string',
      description: 'Optionnel, sans le @ si vous voulez seulement garder une trace lisible.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isActive',
      title: 'Actif',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      chatId: 'chatId',
      isActive: 'isActive',
    },
    prepare({ title, chatId, isActive }) {
      const prefix = isActive === false ? '⏸️' : '📣'
      return {
        title: `${prefix} ${title || 'Canal Telegram'}`,
        subtitle: chatId,
      }
    },
  },
})

