import {defineField, defineType} from 'sanity'

export const leadMagnetSubscriber = defineType({
  name: 'leadMagnetSubscriber',
  title: 'Abonnés Lead Magnet',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'Prénom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
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
      name: 'acquisitionSource',
      title: 'Canal d\'acquisition',
      type: 'string',
      description: 'Où la personne a vu l\'annonce',
      options: {
        list: [
          {title: 'Instagram', value: 'instagram'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Bouche à oreille', value: 'bouche-a-oreille'},
          {title: 'Recherche Google', value: 'google'},
          {title: 'Autre', value: 'autre'},
        ],
      },
    }),
    defineField({
      name: 'hasConsultedNaturopath',
      title: 'A déjà consulté une naturopathe',
      type: 'string',
      options: {
        list: [
          {title: 'Oui', value: 'oui'},
          {title: 'Non', value: 'non'},
        ],
      },
    }),
    defineField({
      name: 'wantsConsultation',
      title: 'Souhaite consulter une naturopathe',
      type: 'string',
      options: {
        list: [
          {title: 'Oui', value: 'oui'},
          {title: 'Non', value: 'non'},
          {title: 'Peut-être', value: 'peut-etre'},
        ],
      },
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Date d\'inscription',
      type: 'datetime',
    }),
    defineField({
      name: 'linkSent',
      title: 'Lien envoyé',
      type: 'boolean',
      initialValue: false,
      description: 'Cocher quand le lien de téléchargement a été envoyé manuellement',
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
      firstName: 'firstName',
      email: 'email',
      source: 'source',
      subscribedAt: 'subscribedAt',
      linkSent: 'linkSent',
    },
    prepare(selection) {
      const {firstName, email, source, subscribedAt, linkSent} = selection
      const date = subscribedAt ? new Date(subscribedAt).toLocaleDateString('fr-FR') : ''
      const linkIcon = linkSent ? '✅' : '⏳'

      return {
        title: `${firstName} - ${email}`,
        subtitle: `${linkIcon} ${source} • ${date}`,
      }
    },
  },

  orderings: [
    {
      title: 'Date (récent)',
      name: 'subscribedAtDesc',
      by: [{field: 'subscribedAt', direction: 'desc'}],
    },
    {
      title: 'Source',
      name: 'sourceAsc',
      by: [{field: 'source', direction: 'asc'}],
    },
  ],
})
