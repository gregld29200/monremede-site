import {defineField, defineType} from 'sanity'

export const clientNote = defineType({
  name: 'clientNote',
  title: 'Note Cliente',
  type: 'document',
  fields: [
    // Reference a la cliente
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'reference',
      to: [{type: 'client'}],
      validation: (Rule) => Rule.required(),
    }),

    // Contenu de la note
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),

    // Type de note
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: '📞 Appel', value: 'appel'},
          {title: '📧 Email', value: 'email'},
          {title: '🩺 Consultation', value: 'consultation'},
          {title: '📝 Note generale', value: 'general'},
          {title: '⚠️ Important', value: 'important'},
        ],
      },
      initialValue: 'general',
    }),

    // Date de creation
    defineField({
      name: 'createdAt',
      title: 'Date',
      type: 'datetime',
    }),
  ],

  // Preview
  preview: {
    select: {
      content: 'content',
      type: 'type',
      createdAt: 'createdAt',
      clientFirstName: 'client.firstName',
      clientLastName: 'client.lastName',
    },
    prepare(selection) {
      const {content, type, createdAt, clientFirstName, clientLastName} = selection
      const typeIcon = type === 'appel' ? '📞' :
                       type === 'email' ? '📧' :
                       type === 'consultation' ? '🩺' :
                       type === 'important' ? '⚠️' : '📝'
      const date = createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : ''
      const preview = content?.substring(0, 50) + (content?.length > 50 ? '...' : '')

      return {
        title: `${typeIcon} ${preview || 'Note vide'}`,
        subtitle: `${clientFirstName || ''} ${clientLastName || ''} • ${date}`,
      }
    },
  },

  // Orderings
  orderings: [
    {
      title: 'Date (recent)',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Type',
      name: 'typeAsc',
      by: [{field: 'type', direction: 'asc'}],
    },
  ],
})
