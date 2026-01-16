import {defineField, defineType} from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Cliente',
  type: 'document',
  fields: [
    // Informations personnelles
    defineField({
      name: 'firstName',
      title: 'Prenom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Nom',
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
      name: 'phone',
      title: 'Telephone',
      type: 'string',
    }),
    defineField({
      name: 'birthDate',
      title: 'Date de naissance',
      type: 'date',
    }),

    // Adresse
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'object',
      fields: [
        {name: 'street', title: 'Rue', type: 'string'},
        {name: 'city', title: 'Ville', type: 'string'},
        {name: 'postalCode', title: 'Code postal', type: 'string'},
        {name: 'country', title: 'Pays', type: 'string', initialValue: 'France'},
      ],
    }),

    // Statut et source
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          {title: 'Actif', value: 'actif'},
          {title: 'En pause', value: 'pause'},
          {title: 'Archive', value: 'archive'},
        ],
      },
      initialValue: 'actif',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          {title: 'Questionnaire', value: 'questionnaire'},
          {title: 'Import CSV', value: 'import'},
          {title: 'Saisie manuelle', value: 'manuel'},
          {title: 'Recommandation', value: 'recommandation'},
        ],
      },
      initialValue: 'manuel',
    }),

    // Lien avec la soumission questionnaire
    defineField({
      name: 'linkedSubmission',
      title: 'Questionnaire lie',
      type: 'reference',
      to: [{type: 'questionnaireSubmission'}],
      description: 'Si la cliente vient du questionnaire',
    }),

    // Profil sante
    defineField({
      name: 'healthProfile',
      title: 'Profil sante',
      type: 'object',
      fields: [
        {
          name: 'concerns',
          title: 'Preoccupations',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Digestion', value: 'digestion'},
              {title: 'Fatigue', value: 'fatigue'},
              {title: 'Sommeil', value: 'sommeil'},
              {title: 'Stress', value: 'stress'},
              {title: 'Poids', value: 'poids'},
              {title: 'Peau', value: 'peau'},
              {title: 'Hormones', value: 'hormones'},
              {title: 'Douleurs', value: 'douleurs'},
              {title: 'Immunite', value: 'immunite'},
              {title: 'Autre', value: 'autre'},
            ],
          },
        },
        {
          name: 'allergies',
          title: 'Allergies connues',
          type: 'text',
          rows: 2,
        },
        {
          name: 'medications',
          title: 'Medicaments en cours',
          type: 'text',
          rows: 2,
        },
      ],
    }),

    // Type de consultation
    defineField({
      name: 'consultationType',
      title: 'Type de consultation',
      type: 'string',
      options: {
        list: [
          {title: 'Sante Generale', value: 'sante-generale'},
          {title: 'Troubles Digestifs', value: 'troubles-digestifs'},
          {title: 'Equilibre Hormonal', value: 'equilibre-hormonal'},
          {title: 'Suivi Complet', value: 'suivi-complet'},
        ],
      },
    }),

    // Notes internes
    defineField({
      name: 'internalNotes',
      title: 'Notes internes',
      type: 'text',
      rows: 4,
      description: 'Notes privees sur cette cliente',
    }),

    // Dates
    defineField({
      name: 'createdAt',
      title: 'Date de creation',
      type: 'datetime',
    }),
    defineField({
      name: 'lastContactAt',
      title: 'Dernier contact',
      type: 'datetime',
    }),
  ],

  // Preview
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      status: 'status',
      consultationType: 'consultationType',
    },
    prepare(selection) {
      const {firstName, lastName, email, status, consultationType} = selection
      const statusIcon = status === 'actif' ? '🟢' :
                         status === 'pause' ? '🟡' : '⚪'
      const consultation = consultationType || 'Non defini'

      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${statusIcon} ${email} • ${consultation}`,
      }
    },
  },

  // Orderings
  orderings: [
    {
      title: 'Nom (A-Z)',
      name: 'nameAsc',
      by: [{field: 'lastName', direction: 'asc'}],
    },
    {
      title: 'Creation (recent)',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Dernier contact',
      name: 'lastContactDesc',
      by: [{field: 'lastContactAt', direction: 'desc'}],
    },
  ],
})
