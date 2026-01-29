import Stripe from 'stripe'

// Constants for the ebook product
export const EBOOK_PRICE_ID = process.env.STRIPE_EBOOK_PRICE_ID || 'price_1Suqd71VBcKZoJCqzvAFw3m5'
export const EBOOK_PRODUCT_NAME = 'La Santé dans l\'assiette - E-book'

// Create a lazy-loaded Stripe instance
let stripeInstance: Stripe | null = null

export function getStripeClient(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe operations will fail.')
    return null
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
    })
  }

  return stripeInstance
}

// Helper to verify webhook signatures
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripeClient()
  if (!stripe) {
    throw new Error('Stripe client not initialized')
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
