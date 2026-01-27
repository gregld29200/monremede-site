import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { randomUUID } from 'crypto'
// Email automatique désactivé - Oum Soumaya envoie manuellement les liens
// import { getResendClient, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/resend'
// import { generateRamadanGiftsEmail, getRamadanGiftsEmailSubject } from '@/lib/email-templates/ramadan-gifts-confirmation'

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!token) {
    throw new Error('SANITY_API_WRITE_TOKEN is not configured')
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-01-13',
    useCdn: false,
    token,
  })
}

interface SubscriptionData {
  firstName: string
  email: string
  source: string
  acquisitionSource?: string
  hasConsultedNaturopath?: string
  wantsConsultation?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: SubscriptionData = await request.json()

    // Basic validation
    if (!data.firstName || !data.email || !data.source) {
      return NextResponse.json(
        { error: 'Prénom, email et source requis' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    const writeClient = getWriteClient()

    // Check for duplicate (same email + source)
    const existingSubscriber = await writeClient.fetch<{ _id: string; firstName: string; downloadToken: string } | null>(
      `*[_type == "leadMagnetSubscriber" && email == $email && source == $source][0]{
        _id,
        firstName,
        downloadToken
      }`,
      { email: data.email.toLowerCase(), source: data.source }
    )

    if (existingSubscriber) {
      // Already subscribed - no automatic email, admin will send manually
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        emailSent: false,
        message: 'Vous êtes déjà inscrit(e) ! Nous vous contactons sous 24h.',
      })
    }

    // Generate unique download token
    const downloadToken = randomUUID()

    // Email automatique désactivé - Oum Soumaya envoie manuellement les liens
    // Le lien est accessible dans l'admin: /gestion-mon-remede-oum/prospects

    // Create the document in Sanity - linkSent: false car envoi manuel
    const result = await writeClient.create({
      _type: 'leadMagnetSubscriber',
      firstName: data.firstName.trim(),
      email: data.email.toLowerCase(),
      source: data.source,
      acquisitionSource: data.acquisitionSource || undefined,
      hasConsultedNaturopath: data.hasConsultedNaturopath || undefined,
      wantsConsultation: data.wantsConsultation || undefined,
      subscribedAt: new Date().toISOString(),
      downloadToken,
      linkSent: false, // L'admin enverra manuellement le lien
    })

    return NextResponse.json({
      success: true,
      id: result._id,
      emailSent: false, // Email manuel par l'admin
      message: 'Inscription réussie !',
    })
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Erreur lors de l\'inscription',
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
