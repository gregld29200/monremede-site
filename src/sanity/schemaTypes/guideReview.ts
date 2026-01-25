import {defineField, defineType} from 'sanity'

export const guideReview = defineType({
  name: 'guideReview',
  title: 'Avis Guides',
  type: 'document',
  fields: [
    defineField({
      name: 'subscriber',
      title: 'Abonné',
      type: 'reference',
      to: [{type: 'leadMagnetSubscriber'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Note',
      type: 'number',
      validation: (Rule) => Rule.required().min(3).max(5).integer(),
      options: {
        list: [
          {title: '⭐⭐⭐ (3 étoiles)', value: 3},
          {title: '⭐⭐⭐⭐ (4 étoiles)', value: 4},
          {title: '⭐⭐⭐⭐⭐ (5 étoiles)', value: 5},
        ],
      },
    }),
    defineField({
      name: 'comment',
      title: 'Commentaire',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(1000),
    }),
    defineField({
      name: 'displayName',
      title: 'Nom affiché',
      type: 'string',
      description: 'Prénom de l\'abonné (rempli automatiquement)',
      readOnly: true,
    }),
    defineField({
      name: 'approved',
      title: 'Approuvé',
      type: 'boolean',
      initialValue: false,
      description: 'Cocher pour afficher cet avis publiquement',
    }),
    defineField({
      name: 'featured',
      title: 'Mis en avant',
      type: 'boolean',
      initialValue: false,
      description: 'Cocher pour mettre cet avis en avant sur la page',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Date de soumission',
      type: 'datetime',
    }),
  ],

  preview: {
    select: {
      displayName: 'displayName',
      rating: 'rating',
      comment: 'comment',
      approved: 'approved',
      featured: 'featured',
      submittedAt: 'submittedAt',
    },
    prepare(selection) {
      const {displayName, rating, comment, approved, featured, submittedAt} = selection
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString('fr-FR') : ''
      const stars = '⭐'.repeat(rating || 0)
      const status = approved ? (featured ? '✨' : '✅') : '⏳'

      return {
        title: `${status} ${displayName || 'Anonyme'} - ${stars}`,
        subtitle: `${date} - ${comment?.substring(0, 50)}...`,
      }
    },
  },

  orderings: [
    {
      title: 'Date (récent)',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
    {
      title: 'Note (haute)',
      name: 'ratingDesc',
      by: [{field: 'rating', direction: 'desc'}],
    },
  ],
})
