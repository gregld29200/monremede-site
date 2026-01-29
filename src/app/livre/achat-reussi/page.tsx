'use client'

import { Suspense, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui'

type VerifyStatus =
  | 'loading'
  | 'processing'
  | 'pending'
  | 'ready'
  | 'already_downloaded'
  | 'expired'
  | 'refunded'
  | 'error'

interface VerifyResponse {
  status: string
  message?: string
  downloadToken?: string
  expiresAt?: string
  customerName?: string
  error?: string
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-soft">Vérification de votre achat...</p>
      </div>
    </div>
  )
}

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream flex items-center justify-center py-20 px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="display-medium text-forest mb-4">{title}</h1>
          <p className="text-ink-soft mb-8">{message}</p>
          <div className="space-y-4">
            <Button variant="primary" asChild>
              <Link href="/livre">Retourner à la page du livre</Link>
            </Button>
            <p className="text-sm text-ink-soft">
              Besoin d&apos;aide ?{' '}
              <a
                href="mailto:contact@monremede.com"
                className="text-forest underline hover:no-underline"
              >
                Contactez-nous
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function ProcessingState() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream flex items-center justify-center py-20 px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-3 border-sage/30 border-t-sage rounded-full animate-spin" />
          </div>
          <h1 className="display-medium text-forest mb-4">
            Traitement en cours...
          </h1>
          <p className="text-ink-soft mb-6">
            Votre achat est en cours de traitement. Cette page se mettra à jour
            automatiquement dans quelques secondes.
          </p>
          <p className="text-sm text-sage">
            Vous recevrez également un email de confirmation avec votre lien de
            téléchargement.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

function SuccessState({
  downloadToken,
  expiresAt,
  customerName,
}: {
  downloadToken: string
  expiresAt: string
  customerName?: string
}) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate time remaining
  const expiresDate = new Date(expiresAt)
  const now = new Date()
  const minutesRemaining = Math.max(
    0,
    Math.floor((expiresDate.getTime() - now.getTime()) / 1000 / 60)
  )

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)

    try {
      const response = await fetch(`/api/ebook/download?token=${downloadToken}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors du téléchargement')
      }

      // Get the blob and trigger download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'La-Sante-dans-lassiette.epub'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setDownloaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de téléchargement')
    } finally {
      setDownloading(false)
    }
  }

  if (downloaded) {
    return (
      <>
        <Header />
        <main id="main-content">
          {/* Success Hero */}
          <section className="relative min-h-[50vh] bg-forest-deep flex items-center py-24 px-6">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-xs tracking-[0.3em] uppercase text-gold font-medium">
                  Téléchargement terminé
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
              </div>

              <h1 className="display-large text-cream mb-6">
                Bonne lecture !
              </h1>

              <p className="body-large text-cream/70 max-w-2xl mx-auto mb-8">
                Votre e-book a été téléchargé avec succès. Vous le trouverez dans
                votre dossier de téléchargements.
              </p>

              <div className="inline-flex items-center gap-2 bg-sage/20 px-4 py-2 rounded-full">
                <span className="text-sage-light">✓</span>
                <span className="text-cream/80 text-sm">
                  La-Sante-dans-lassiette.epub
                </span>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="py-16 lg:py-20 px-6 bg-cream">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="label text-sage mb-4">Et maintenant ?</p>
                <h2 className="display-medium text-forest">
                  Profitez de votre lecture
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="bg-cream-warm rounded-lg p-8 text-center">
                  <div className="w-3 h-3 rounded-full bg-gold mx-auto mb-6" />
                  <h3 className="display-medium text-forest text-xl mb-3">
                    Consultations personnalisées
                  </h3>
                  <p className="text-ink-soft text-sm mb-6">
                    Besoin d&apos;un accompagnement sur mesure ? Je propose des
                    consultations en ligne.
                  </p>
                  <Button variant="outline" size="md" asChild>
                    <Link href="/consultations">Voir les consultations</Link>
                  </Button>
                </div>

                <div className="bg-cream-warm rounded-lg p-8 text-center">
                  <div className="w-3 h-3 rounded-full bg-sage mx-auto mb-6" />
                  <h3 className="display-medium text-forest text-xl mb-3">
                    Blog &amp; recettes
                  </h3>
                  <p className="text-ink-soft text-sm mb-6">
                    Découvrez plus de conseils naturopathie et de recettes
                    santé gratuitement.
                  </p>
                  <Button variant="outline" size="md" asChild>
                    <Link href="/blog">Lire le blog</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] bg-forest-deep flex items-center py-24 px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-medium">
                Achat confirmé
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
            </div>

            <h1 className="display-large text-cream mb-4">
              Merci{customerName ? `, ${customerName}` : ''} !
            </h1>

            <p className="body-large text-cream/70 max-w-2xl mx-auto">
              Votre achat a été validé. Votre e-book est prêt à être téléchargé.
            </p>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 lg:py-20 px-6 bg-cream">
          <div className="max-w-2xl mx-auto">
            {/* Download Card */}
            <div className="bg-cream-warm rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📖</span>
              </div>

              <h2 className="display-medium text-forest mb-2">
                La Santé dans l&apos;assiette
              </h2>
              <p className="text-ink-soft mb-6">
                30 jours pour guérir naturellement
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                disabled={downloading}
                className="w-full sm:w-auto"
              >
                {downloading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    Télécharger mon e-book
                    <span className="ml-2">↓</span>
                  </>
                )}
              </Button>

              {/* Warning */}
              <div className="mt-8 p-4 bg-gold/10 border border-gold/30 rounded-lg">
                <p className="text-sm text-forest">
                  <strong>Important :</strong> Ce lien expire dans{' '}
                  <strong>{minutesRemaining} minutes</strong> et ne peut être
                  utilisé qu&apos;une seule fois. Téléchargez votre e-book
                  maintenant !
                </p>
              </div>
            </div>

            {/* Email reminder */}
            <div className="mt-8 text-center">
              <p className="text-ink-soft text-sm">
                Un email de confirmation avec le lien de téléchargement vous a
                également été envoyé.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function AchatReussiContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<VerifyStatus>('loading')
  const [data, setData] = useState<VerifyResponse | null>(null)
  const retryCountRef = useRef(0)

  // Handle missing sessionId before the effect
  const hasSessionId = Boolean(sessionId)

  useEffect(() => {
    // Skip if no sessionId (handled by render logic)
    if (!hasSessionId) return

    let isMounted = true
    let retryTimeout: NodeJS.Timeout | null = null

    async function verifyPurchase() {
      try {
        const response = await fetch(`/api/ebook/verify?session_id=${sessionId}`)
        const result: VerifyResponse = await response.json()

        if (!isMounted) return

        if (result.error) {
          setStatus('error')
          setData(result)
          return
        }

        switch (result.status) {
          case 'ready':
            setStatus('ready')
            setData(result)
            break
          case 'processing':
            setStatus('processing')
            setData(result)
            // Retry after 3 seconds
            if (retryCountRef.current < 10) {
              retryCountRef.current += 1
              retryTimeout = setTimeout(verifyPurchase, 3000)
            }
            break
          case 'pending':
            setStatus('pending')
            setData(result)
            break
          case 'already_downloaded':
            setStatus('already_downloaded')
            setData(result)
            break
          case 'expired':
            setStatus('expired')
            setData(result)
            break
          case 'refunded':
            setStatus('refunded')
            setData(result)
            break
          default:
            setStatus('error')
            setData(result)
        }
      } catch {
        if (isMounted) {
          setStatus('error')
          setData({ status: 'error', error: 'Erreur de connexion' })
        }
      }
    }

    verifyPurchase()

    return () => {
      isMounted = false
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [hasSessionId, sessionId])

  // Handle missing sessionId case
  if (!hasSessionId) {
    return (
      <ErrorState
        title="Session invalide"
        message="Lien d'achat invalide. Veuillez réessayer ou nous contacter."
      />
    )
  }

  if (status === 'loading') {
    return <LoadingState />
  }

  if (status === 'processing') {
    return <ProcessingState />
  }

  if (status === 'pending') {
    return (
      <ErrorState
        title="Paiement en attente"
        message={data?.message || 'Votre paiement est en cours de traitement.'}
      />
    )
  }

  if (status === 'already_downloaded') {
    return (
      <ErrorState
        title="Déjà téléchargé"
        message={
          data?.message ||
          'Ce lien a déjà été utilisé. Vérifiez vos téléchargements ou contactez-nous.'
        }
      />
    )
  }

  if (status === 'expired') {
    return (
      <ErrorState
        title="Lien expiré"
        message={
          data?.message ||
          'Ce lien a expiré. Veuillez nous contacter pour obtenir un nouveau lien.'
        }
      />
    )
  }

  if (status === 'refunded') {
    return (
      <ErrorState
        title="Achat remboursé"
        message={data?.message || 'Cet achat a été remboursé.'}
      />
    )
  }

  if (status === 'error' || !data?.downloadToken) {
    return (
      <ErrorState
        title="Erreur"
        message={
          data?.error ||
          data?.message ||
          'Une erreur est survenue. Veuillez réessayer ou nous contacter.'
        }
      />
    )
  }

  return (
    <SuccessState
      downloadToken={data.downloadToken}
      expiresAt={data.expiresAt!}
      customerName={data.customerName || undefined}
    />
  )
}

export default function AchatReussiPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AchatReussiContent />
    </Suspense>
  )
}
