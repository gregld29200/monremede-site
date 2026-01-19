import {defineField, defineType} from 'sanity'

export const recipe = defineType({
  name: 'recipe',
  title: 'Recette',
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
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'mainImage',
      title: 'Photo du plat',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie d\'images',
      type: 'array',
      description: 'Photos supplémentaires de la recette',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texte alternatif',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'prepTime',
      title: 'Temps de préparation',
      type: 'number',
      description: 'En minutes',
    }),
    defineField({
      name: 'cookTime',
      title: 'Temps de cuisson',
      type: 'number',
      description: 'En minutes',
    }),
    defineField({
      name: 'servings',
      title: 'Nombre de portions',
      type: 'number',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulté',
      type: 'string',
      options: {
        list: [
          {title: 'Facile', value: 'easy'},
          {title: 'Moyen', value: 'medium'},
          {title: 'Difficile', value: 'hard'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingrédients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'quantity', title: 'Quantité', type: 'string'},
            {name: 'ingredient', title: 'Ingrédient', type: 'string'},
            {name: 'notes', title: 'Notes', type: 'string'},
          ],
          preview: {
            select: {
              quantity: 'quantity',
              ingredient: 'ingredient',
            },
            prepare({quantity, ingredient}) {
              return {
                title: `${quantity || ''} ${ingredient || ''}`.trim(),
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'steps',
      title: 'Étapes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'step', title: 'Étape', type: 'text', rows: 3},
            {name: 'image', title: 'Photo (optionnel)', type: 'image'},
            {name: 'tip', title: 'Astuce (optionnel)', type: 'string'},
          ],
          preview: {
            select: {
              title: 'step',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'healthBenefits',
      title: 'Bienfaits santé',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Liste des bienfaits pour la santé',
    }),
    defineField({
      name: 'tips',
      title: 'Conseils et variantes',
      type: 'blockContent',
    }),
    defineField({
      name: 'featured',
      title: 'Recette mise en avant',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      prepTime: 'prepTime',
      cookTime: 'cookTime',
    },
    prepare(selection) {
      const {prepTime, cookTime} = selection
      const totalTime = (prepTime || 0) + (cookTime || 0)
      return {
        ...selection,
        subtitle: totalTime ? `${totalTime} min` : '',
      }
    },
  },
})
