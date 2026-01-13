import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Couleur',
      type: 'string',
      description: 'Couleur d\'accent pour cette catégorie',
      options: {
        list: [
          {title: 'Vert forêt', value: 'forest'},
          {title: 'Sauge', value: 'sage'},
          {title: 'Or', value: 'gold'},
          {title: 'Rose', value: 'blush'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
