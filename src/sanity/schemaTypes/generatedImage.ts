import { defineField, defineType } from 'sanity'

export const generatedImage = defineType({
  name: 'generatedImage',
  title: 'Image générée',
  type: 'document',
  fields: [
    defineField({
      name: 'prompt',
      title: 'Prompt',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kieTaskId',
      title: 'KIE.AI Task ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'En attente', value: 'pending' },
          { title: 'En cours', value: 'generating' },
          { title: 'Terminé', value: 'success' },
          { title: 'Échec', value: 'failed' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Ratio d\'aspect',
      type: 'string',
      options: {
        list: [
          { title: '1:1 (Carré)', value: '1:1' },
          { title: '16:9 (Paysage)', value: '16:9' },
          { title: '9:16 (Portrait)', value: '9:16' },
          { title: '4:5 (Facebook)', value: '4:5' },
          { title: '2:3 (Pinterest)', value: '2:3' },
          { title: '3:2 (Classique)', value: '3:2' },
        ],
      },
    }),
    defineField({
      name: 'resolution',
      title: 'Résolution',
      type: 'string',
      options: {
        list: [
          { title: '1K (1024px)', value: '1K' },
          { title: '2K (2048px)', value: '2K' },
          { title: '4K (4096px)', value: '4K' },
        ],
      },
      initialValue: '2K',
    }),
    defineField({
      name: 'resultUrl',
      title: 'URL du résultat (KIE.AI)',
      type: 'url',
      readOnly: true,
    }),
    defineField({
      name: 'sanityImage',
      title: 'Image Sanity',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'linkedPost',
      title: 'Article lié',
      type: 'reference',
      to: [{ type: 'post' }],
    }),
    defineField({
      name: 'linkedRecipe',
      title: 'Recette liée',
      type: 'reference',
      to: [{ type: 'recipe' }],
    }),
    defineField({
      name: 'purpose',
      title: 'Usage',
      type: 'string',
      options: {
        list: [
          { title: 'Image principale', value: 'mainImage' },
          { title: 'Galerie', value: 'gallery' },
          { title: 'Réseaux sociaux', value: 'social' },
        ],
      },
    }),
    defineField({
      name: 'socialPlatform',
      title: 'Plateforme sociale',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram Post', value: 'instagram-post' },
          { title: 'Instagram Story', value: 'instagram-story' },
          { title: 'Facebook Post', value: 'facebook-post' },
          { title: 'Facebook Cover', value: 'facebook-cover' },
          { title: 'Pinterest', value: 'pinterest' },
          { title: 'YouTube', value: 'youtube' },
        ],
      },
      hidden: ({ parent }) => parent?.purpose !== 'social',
    }),
    defineField({
      name: 'cost',
      title: 'Coût ($)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'errorMessage',
      title: 'Message d\'erreur',
      type: 'string',
      readOnly: true,
      hidden: ({ parent }) => parent?.status !== 'failed',
    }),
  ],
  preview: {
    select: {
      prompt: 'prompt',
      status: 'status',
      media: 'sanityImage',
      purpose: 'purpose',
    },
    prepare({ prompt, status, media, purpose }) {
      const statusEmoji = {
        pending: '⏳',
        generating: '🔄',
        success: '✅',
        failed: '❌',
      }[status as string] || '❓'

      const purposeLabel = {
        mainImage: 'Image principale',
        gallery: 'Galerie',
        social: 'Réseaux sociaux',
      }[purpose as string] || ''

      return {
        title: prompt?.substring(0, 50) + (prompt?.length > 50 ? '...' : ''),
        subtitle: `${statusEmoji} ${purposeLabel}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Date de création',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
