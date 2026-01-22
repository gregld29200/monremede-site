import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Client principal - sans CDN pour ISR (revalidation fonctionne correctement)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Désactivé pour que les mises à jour d'images soient immédiatement visibles
})
