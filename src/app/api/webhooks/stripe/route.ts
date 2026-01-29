import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent, getStripeClient } from '@/lib/stripe'
import { writeClient } from '@/sanity/lib/writeClient'
import { randomUUID } from 'crypto'
import { getResendClient, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/resend'
import {
  generateEbookPurchaseEmail,
  getEbookPurchaseEmailSubject,
} from '@/lib/email-templates/ebook-purchase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = constructWebhookEvent(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Only process ebook purchases
  if (session.metadata?.product_type !== 'ebook') {
    console.log('Ignoring non-ebook purchase')
    return
  }

  // Check for idempotency - don't process if already exists
  const existingPurchase = await writeClient.fetch(
    `*[_type == "ebookPurchase" && stripeSessionId == $sessionId][0]._id`,
    { sessionId: session.id } as unknown as Record<string, never>
  ) as string | null

  if (existingPurchase) {
    console.log('Purchase already processed:', session.id)
    return
  }

  // Generate download token and expiration (1 hour from now)
  const downloadToken = randomUUID()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  const customerEmail = session.customer_details?.email || session.customer_email || ''
  const customerName = session.customer_details?.name || ''

  // Create purchase record in Sanity
  const purchaseDoc = await writeClient.create({
    _type: 'ebookPurchase',
    stripeSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id,
    customerEmail,
    customerName,
    amountPaid: session.amount_total,
    downloadToken,
    downloadTokenExpiresAt: expiresAt.toISOString(),
    downloadCount: 0,
    status: 'paid',
    purchasedAt: new Date().toISOString(),
    emailSent: false,
  })

  console.log('Created purchase record:', purchaseDoc._id)

  // Send confirmation email with download link
  const resend = getResendClient()
  if (resend && customerEmail) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monremede.com'
      const downloadUrl = `${siteUrl}/api/ebook/download?token=${downloadToken}`
      const expirationTime = expiresAt.toLocaleString('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short',
      })

      await resend.emails.send({
        from: FROM_EMAIL,
        replyTo: REPLY_TO_EMAIL,
        to: customerEmail,
        subject: getEbookPurchaseEmailSubject(),
        html: generateEbookPurchaseEmail({
          customerName: customerName || 'cher client',
          downloadUrl,
          expirationTime,
        }),
      })

      // Update email status
      await writeClient
        .patch(purchaseDoc._id)
        .set({ emailSent: true })
        .commit()

      console.log('Confirmation email sent to:', customerEmail)
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)

      // Record the error
      await writeClient
        .patch(purchaseDoc._id)
        .set({
          emailError: emailError instanceof Error ? emailError.message : 'Unknown error',
        })
        .commit()
    }
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const stripe = getStripeClient()
  if (!stripe) return

  // Find the payment intent to get the session
  const paymentIntentId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id

  if (!paymentIntentId) {
    console.log('No payment intent ID found in refund')
    return
  }

  // Update the purchase status to refunded
  const result = await writeClient.fetch(
    `*[_type == "ebookPurchase" && stripePaymentIntentId == $paymentIntentId][0]._id`,
    { paymentIntentId } as unknown as Record<string, never>
  ) as string | null

  if (result) {
    await writeClient
      .patch(result)
      .set({ status: 'refunded' })
      .commit()

    console.log('Purchase marked as refunded:', result)
  }
}
