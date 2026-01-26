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
      name: 'downloadToken',
      title: 'Token de téléchargement',
      type: 'string',
      readOnly: true,
      description: 'Token unique généré automatiquement pour l\'accès aux téléchargements',
    }),
    defineField({
      name: 'linkSent',
      title: 'Lien envoyé',
      type: 'boolean',
      initialValue: false,
      description: 'Indique si l\'email a été envoyé avec succès',
    }),
    defineField({
      name: 'emailError',
      title: 'Erreur d\'envoi',
      type: 'string',
      readOnly: true,
      description: 'Message d\'erreur si l\'envoi a échoué',
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
      emailError: 'emailError',
    },
    prepare(selection) {
      const {firstName, email, source, subscribedAt, linkSent, emailError} = selection
      const date = subscribedAt ? new Date(subscribedAt).toLocaleDateString('fr-FR') : ''
      const linkIcon = emailError ? '❌' : linkSent ? '✅' : '⏳'

      return {
        title: `${firstName} - ${email}`,
        subtitle: `${linkIcon} ${source} • ${date}${emailError ? ` • ${emailError}` : ''}`,
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
