import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import { writeClient } from '@/sanity/lib/writeClient'

interface PurchaseRecord {
  _id: string
  downloadToken: string
  downloadTokenExpiresAt: string
  status: string
  downloadedAt: string | null
  customerName: string | null
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID manquant' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Service de paiement non disponible' },
        { status: 500 }
      )
    }

    // Verify the session with Stripe
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId)
    } catch {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 400 }
      )
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        {
          status: 'pending',
          message: 'Paiement en cours de traitement...',
        }
      )
    }

    // Check if purchase record exists in Sanity
    const purchase = await writeClient.fetch(
      `*[_type == "ebookPurchase" && stripeSessionId == $sessionId][0]{
        _id,
        downloadToken,
        downloadTokenExpiresAt,
        status,
        downloadedAt,
        customerName
      }`,
      { sessionId } as unknown as Record<string, never>
    ) as PurchaseRecord | null

    if (!purchase) {
      // Webhook might not have processed yet, tell user to wait
      return NextResponse.json({
        status: 'processing',
        message: 'Votre achat est en cours de traitement. Veuillez patienter quelques instants.',
      })
    }

    // Check if already downloaded
    if (purchase.status === 'downloaded' || purchase.downloadedAt) {
      return NextResponse.json({
        status: 'already_downloaded',
        message: 'Ce lien a déjà été utilisé. Vérifiez vos téléchargements ou contactez-nous si besoin.',
      })
    }

    // Check if expired
    const expiresAt = new Date(purchase.downloadTokenExpiresAt)
    if (new Date() > expiresAt) {
      // Mark as expired
      await writeClient
        .patch(purchase._id)
        .set({ status: 'expired' })
        .commit()

      return NextResponse.json({
        status: 'expired',
        message: 'Ce lien a expiré. Veuillez nous contacter pour obtenir un nouveau lien.',
      })
    }

    // Check if refunded
    if (purchase.status === 'refunded') {
      return NextResponse.json({
        status: 'refunded',
        message: 'Cet achat a été remboursé.',
      })
    }

    // All good - return the download token
    return NextResponse.json({
      status: 'ready',
      downloadToken: purchase.downloadToken,
      expiresAt: purchase.downloadTokenExpiresAt,
      customerName: purchase.customerName,
    })
  } catch (error) {
    console.error('Erreur vérification achat:', error)

    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
