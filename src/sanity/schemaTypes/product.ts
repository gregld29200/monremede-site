import {defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Produit',
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
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      description: 'Ex: 30 jours pour se soigner naturellement',
    }),
    defineField({
      name: 'productType',
      title: 'Type de produit',
      type: 'string',
      options: {
        list: [
          {title: 'Livre / Ebook', value: 'book'},
          {title: 'Formation', value: 'course'},
          {title: 'Consultation', value: 'consultation'},
          {title: 'Autre', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie d\'images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', type: 'string', title: 'Texte alternatif'},
          ],
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'fullDescription',
      title: 'Description complète',
      type: 'blockContent',
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'comparePrice',
      title: 'Prix barré (ancien prix)',
      type: 'number',
      description: 'Laisser vide si pas de promotion',
    }),
    defineField({
      name: 'currency',
      title: 'Devise',
      type: 'string',
      options: {
        list: [
          {title: 'Euro (€)', value: 'EUR'},
          {title: 'Dollar ($)', value: 'USD'},
        ],
      },
      initialValue: 'EUR',
    }),
    defineField({
      name: 'features',
      title: 'Points clés',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Liste des caractéristiques ou ce qui est inclus',
    }),
    defineField({
      name: 'tableOfContents',
      title: 'Table des matières',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'chapter', title: 'Chapitre', type: 'string'},
            {name: 'description', title: 'Description', type: 'string'},
          ],
        },
      ],
    }),
    defineField({
      name: 'purchaseUrl',
      title: 'Lien d\'achat',
      type: 'url',
      description: 'Lien externe vers la page d\'achat (Gumroad, Stripe, etc.)',
    }),
    defineField({
      name: 'featured',
      title: 'Produit mis en avant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'available',
      title: 'Disponible à la vente',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {name: 'metaTitle', title: 'Meta Title', type: 'string'},
        {name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'productType',
      media: 'mainImage',
      price: 'price',
    },
    prepare(selection) {
      const {price, subtitle} = selection
      const types: Record<string, string> = {
        book: 'Livre',
        course: 'Formation',
        consultation: 'Consultation',
        other: 'Autre',
      }
      return {
        ...selection,
        subtitle: `${types[subtitle] || subtitle} • ${price}€`,
      }
    },
  },
})
