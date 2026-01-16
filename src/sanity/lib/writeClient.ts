import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Client avec token d'écriture pour les mutations (côté serveur uniquement)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Pas de CDN pour les écritures
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// Vérifier que le token est présent (pour debug)
if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.warn(
    '⚠️ SANITY_API_WRITE_TOKEN non défini. Les écritures vers Sanity échoueront.'
  )
}
