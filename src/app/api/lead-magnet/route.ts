import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { randomUUID } from 'crypto'
import { getResendClient, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/resend'
import { generateRamadanGiftsEmail, getRamadanGiftsEmailSubject } from '@/lib/email-templates/ramadan-gifts-confirmation'

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
      // Already subscribed - resend email with existing token
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monremede.com'
      const downloadUrl = `${siteUrl}/cadeaux-ramadan/telechargement?token=${existingSubscriber.downloadToken}`

      const resend = getResendClient()
      let emailSent = false

      if (resend && existingSubscriber.downloadToken) {
        try {
          const emailHtml = generateRamadanGiftsEmail({
            firstName: existingSubscriber.firstName || data.firstName.trim(),
            downloadUrl,
          })

          await resend.emails.send({
            from: FROM_EMAIL,
            to: data.email,
            replyTo: REPLY_TO_EMAIL,
            subject: getRamadanGiftsEmailSubject(),
            html: emailHtml,
          })

          emailSent = true
          console.log(`Email renvoyé à ${data.email} (abonné existant)`)
        } catch (emailError) {
          console.error('Erreur lors du renvoi de l\'email:', emailError)
        }
      }

      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        emailSent,
        message: 'Vous êtes déjà inscrit(e) ! L\'email a été renvoyé.',
      })
    }

    // Generate unique download token
    const downloadToken = randomUUID()

    // Build download URL first (needed for email)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monremede.com'
    const downloadUrl = `${siteUrl}/cadeaux-ramadan/telechargement?token=${downloadToken}`

    // Send confirmation email BEFORE creating the document
    const resend = getResendClient()
    let emailSent = false
    let emailError: string | undefined

    if (resend) {
      try {
        const emailHtml = generateRamadanGiftsEmail({
          firstName: data.firstName.trim(),
          downloadUrl,
        })

        const emailResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: data.email,
          replyTo: REPLY_TO_EMAIL,
          subject: getRamadanGiftsEmailSubject(),
          html: emailHtml,
        })

        if (emailResult.error) {
          emailError = emailResult.error.message
          console.error('Erreur Resend:', emailResult.error)
        } else {
          emailSent = true
          console.log(`Email de confirmation envoyé à ${data.email}, ID: ${emailResult.data?.id}`)
        }
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Erreur inconnue'
        console.error('Erreur lors de l\'envoi de l\'email:', err)
      }
    } else {
      emailError = 'RESEND_API_KEY non configuré'
      console.error('Resend client non disponible - RESEND_API_KEY manquant')
    }

    // Create the document in Sanity with accurate linkSent status
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
      linkSent: emailSent,
      emailError: emailError || undefined,
    })

    return NextResponse.json({
      success: true,
      id: result._id,
      emailSent,
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
