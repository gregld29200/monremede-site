import {defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rôle / Description',
      type: 'string',
      description: 'Ex: Maman de 3 enfants, Lyon',
    }),
    defineField({
      name: 'avatar',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'quote',
      title: 'Témoignage',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Note',
      type: 'number',
      options: {
        list: [
          {title: '5 étoiles', value: 5},
          {title: '4 étoiles', value: 4},
          {title: '3 étoiles', value: 3},
        ],
      },
      initialValue: 5,
    }),
    defineField({
      name: 'product',
      title: 'Produit concerné',
      type: 'reference',
      to: [{type: 'product'}],
    }),
    defineField({
      name: 'featured',
      title: 'Témoignage mis en avant',
      type: 'boolean',
      initialValue: false,
      description: 'Afficher sur la page d\'accueil',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'quote',
      media: 'avatar',
    },
    prepare(selection) {
      const {subtitle} = selection
      return {
        ...selection,
        subtitle: subtitle ? subtitle.substring(0, 60) + '...' : '',
      }
    },
  },
})
