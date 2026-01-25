import {defineField, defineType} from 'sanity'

export const leadMagnetSubscriber = defineType({
  name: 'leadMagnetSubscriber',
  title: 'Abonnés Lead Magnet',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Identifiant du lead magnet (ex: cadeaux-ramadan)',
      options: {
        list: [
          {title: '🌙 Cadeaux Ramadan', value: 'cadeaux-ramadan'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'downloadedAt',
      title: 'Date d\'inscription',
      type: 'datetime',
    }),
    defineField({
      name: 'emailSent',
      title: 'Email envoyé',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'notes',
      title: 'Notes internes',
      type: 'text',
      rows: 3,
      description: 'Notes privées sur cet abonné',
    }),
  ],

  preview: {
    select: {
      email: 'email',
      source: 'source',
      downloadedAt: 'downloadedAt',
      emailSent: 'emailSent',
    },
    prepare(selection) {
      const {email, source, downloadedAt, emailSent} = selection
      const date = downloadedAt ? new Date(downloadedAt).toLocaleDateString('fr-FR') : ''
      const emailIcon = emailSent ? '✅' : '⏳'

      return {
        title: email,
        subtitle: `${emailIcon} ${source} • ${date}`,
      }
    },
  },

  orderings: [
    {
      title: 'Date (récent)',
      name: 'downloadedAtDesc',
      by: [{field: 'downloadedAt', direction: 'desc'}],
    },
    {
      title: 'Source',
      name: 'sourceAsc',
      by: [{field: 'source', direction: 'asc'}],
    },
  ],
})
