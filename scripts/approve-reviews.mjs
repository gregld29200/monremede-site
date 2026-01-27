import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '4otm8dqd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Reviews to approve with featured status
const featuredReviews = [
  '632SdIEtpsoOUoGaJFp6uk', // Bb - 5 stars, great comment about hijama
  'E2XmNZsRyu9R3Ht0KzwHhK', // Virginie - 5 stars, Ramadan preparation
  'E2XmNZsRyu9R3Ht0Kz2KDC', // Gabriela - 5 stars, clear and detailed
]

// Reviews to approve (not featured)
const approvedReviews = [
  'AgiO9mxeVdoceuXPgbtPFE', // Alisha - 5 stars
  '632SdIEtpsoOUoGaJFPGnZ', // Jessica - 4 stars
  '632SdIEtpsoOUoGaJFdX0h', // Mahora - 4 stars
  'Av7TDC9UQQ6N6GLpoLcyI2', // Aurelie - 4 stars
  'AgiO9mxeVdoceuXPgbu0DU', // Karima - 4 stars
]

async function approveReviews() {
  console.log('Approving guide reviews...\n')

  // Approve and feature
  for (const id of featuredReviews) {
    try {
      await client.patch(id).set({ approved: true, featured: true }).commit()
      console.log('✓ Featured:', id)
    } catch (e) {
      console.error('✗ Error featuring', id, e.message)
    }
  }

  // Just approve
  for (const id of approvedReviews) {
    try {
      await client.patch(id).set({ approved: true }).commit()
      console.log('✓ Approved:', id)
    } catch (e) {
      console.error('✗ Error approving', id, e.message)
    }
  }

  console.log('\nDone!')
}

approveReviews()
