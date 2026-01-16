import {defineField, defineType} from 'sanity'

export const questionnaireSubmission = defineType({
  name: 'questionnaireSubmission',
  title: 'Soumission Questionnaire',
  type: 'document',
  fields: [
    // Informations personnelles
    defineField({
      name: 'firstName',
      title: 'Prénom',
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
      name: 'age',
      title: 'Âge',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(120),
    }),

    // Résultats
    defineField({
      name: 'totalScore',
      title: 'Score Total',
      type: 'number',
      description: 'Score total sur 50',
    }),
    defineField({
      name: 'profile',
      title: 'Profil',
      type: 'string',
      options: {
        list: [
          {title: '🌟 Équilibré (0-12)', value: 'equilibre'},
          {title: '⚠️ En Alerte (13-25)', value: 'alerte'},
          {title: '🔴 En Difficulté (26-37)', value: 'difficulte'},
          {title: '🚨 Urgent (38-50)', value: 'urgent'},
        ],
      },
    }),

    // Scores par catégorie
    defineField({
      name: 'categoryScores',
      title: 'Scores par Catégorie',
      type: 'object',
      fields: [
        {name: 'etatGeneral', title: 'État Général', type: 'number'},
        {name: 'energieVitalite', title: 'Énergie & Vitalité', type: 'number'},
        {name: 'digestionTransit', title: 'Digestion & Transit', type: 'number'},
        {name: 'alimentationComportement', title: 'Alimentation & Comportement', type: 'number'},
        {name: 'emotionsMental', title: 'Émotions & Mental', type: 'number'},
        {name: 'sommeil', title: 'Sommeil', type: 'number'},
        {name: 'peauCheveux', title: 'Peau & Cheveux', type: 'number'},
        {name: 'douleursInconforts', title: 'Douleurs & Inconforts', type: 'number'},
        {name: 'modeVie', title: 'Mode de Vie', type: 'number'},
      ],
    }),

    // Réponses détaillées
    defineField({
      name: 'answers',
      title: 'Réponses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'questionId', title: 'ID Question', type: 'string'},
            {name: 'questionText', title: 'Question', type: 'string'},
            {name: 'answerText', title: 'Réponse', type: 'string'},
            {name: 'points', title: 'Points', type: 'number'},
            {name: 'additionalInfo', title: 'Précisions', type: 'string'},
          ],
        },
      ],
    }),

    // Statut CRM
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          {title: '🆕 Nouveau', value: 'nouveau'},
          {title: '📧 Contacté', value: 'contacte'},
          {title: '📞 En discussion', value: 'discussion'},
          {title: '✅ Converti', value: 'converti'},
          {title: '❌ Non intéressé', value: 'non_interesse'},
        ],
      },
      initialValue: 'nouveau',
    }),

    // Notes internes
    defineField({
      name: 'notes',
      title: 'Notes internes',
      type: 'text',
      rows: 4,
      description: 'Notes privées sur ce contact',
    }),

    // Date de soumission
    defineField({
      name: 'submittedAt',
      title: 'Date de soumission',
      type: 'datetime',
    }),
  ],

  // Prévisualisation dans le Studio
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      profile: 'profile',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare(selection) {
      const {firstName, lastName, email, profile, status, submittedAt} = selection
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString('fr-FR') : ''
      const statusEmoji = status === 'nouveau' ? '🆕' :
                          status === 'contacte' ? '📧' :
                          status === 'converti' ? '✅' : ''

      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${statusEmoji} ${email} • ${profile} • ${date}`,
      }
    },
  },

  // Ordre par défaut
  orderings: [
    {
      title: 'Date (récent)',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
    {
      title: 'Statut',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
    {
      title: 'Score',
      name: 'scoreDesc',
      by: [{field: 'totalScore', direction: 'desc'}],
    },
  ],
})
