import {defineField, defineType} from 'sanity'

export const ebookPurchase = defineType({
  name: 'ebookPurchase',
  title: 'Achats E-book',
  type: 'document',
  fields: [
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email client',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'customerName',
      title: 'Nom client',
      type: 'string',
    }),
    defineField({
      name: 'amountPaid',
      title: 'Montant payé (centimes)',
      type: 'number',
      readOnly: true,
      description: 'Montant en centimes (ex: 1499 = 14,99€)',
    }),
    defineField({
      name: 'downloadToken',
      title: 'Token de téléchargement',
      type: 'string',
      readOnly: true,
      description: 'Token UUID unique pour télécharger l\'e-book',
    }),
    defineField({
      name: 'downloadTokenExpiresAt',
      title: 'Expiration du token',
      type: 'datetime',
      readOnly: true,
      description: 'Le token expire 1 heure après création',
    }),
    defineField({
      name: 'downloadedAt',
      title: 'Date de téléchargement',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'downloadCount',
      title: 'Nombre de téléchargements',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          {title: 'En attente', value: 'pending'},
          {title: 'Payé', value: 'paid'},
          {title: 'Téléchargé', value: 'downloaded'},
          {title: 'Expiré', value: 'expired'},
          {title: 'Remboursé', value: 'refunded'},
        ],
      },
    }),
    defineField({
      name: 'purchasedAt',
      title: 'Date d\'achat',
      type: 'datetime',
    }),
    defineField({
      name: 'emailSent',
      title: 'Email envoyé',
      type: 'boolean',
      initialValue: false,
      description: 'Indique si l\'email de confirmation a été envoyé',
    }),
    defineField({
      name: 'emailError',
      title: 'Erreur email',
      type: 'string',
      readOnly: true,
      description: 'Message d\'erreur si l\'envoi a échoué',
    }),
  ],

  preview: {
    select: {
      email: 'customerEmail',
      name: 'customerName',
      status: 'status',
      purchasedAt: 'purchasedAt',
      downloadedAt: 'downloadedAt',
      amountPaid: 'amountPaid',
    },
    prepare(selection) {
      const {email, name, status, purchasedAt, downloadedAt, amountPaid} = selection
      const date = purchasedAt ? new Date(purchasedAt).toLocaleDateString('fr-FR') : ''
      const statusLabels: Record<string, string> = {
        pending: '⏳ En attente',
        paid: '✅ Payé',
        downloaded: '📥 Téléchargé',
        expired: '⏰ Expiré',
        refunded: '💸 Remboursé',
      }
      const statusLabel = statusLabels[status] || status
      const amount = amountPaid ? `${(amountPaid / 100).toFixed(2)}€` : ''
      const downloaded = downloadedAt ? ' • Téléchargé' : ''

      return {
        title: name || email,
        subtitle: `${statusLabel} • ${amount} • ${date}${downloaded}`,
      }
    },
  },

  orderings: [
    {
      title: 'Date (récent)',
      name: 'purchasedAtDesc',
      by: [{field: 'purchasedAt', direction: 'desc'}],
    },
    {
      title: 'Statut',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
