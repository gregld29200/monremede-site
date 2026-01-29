import { NextResponse } from 'next/server'
import { getStripeClient, EBOOK_PRICE_ID } from '@/lib/stripe'

export async function POST() {
  try {
    const stripe = getStripeClient()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe non configuré' },
        { status: 500 }
      )
    }

    if (!EBOOK_PRICE_ID) {
      return NextResponse.json(
        { error: 'Prix e-book non configuré' },
        { status: 500 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monremede.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: EBOOK_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_creation: 'always',
      success_url: `${siteUrl}/livre/achat-reussi?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/livre#commander`,
      locale: 'fr',
      metadata: {
        product_type: 'ebook',
        product_name: 'La Santé dans l\'assiette - E-book',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur création session Stripe:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Erreur lors de la création du paiement',
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
