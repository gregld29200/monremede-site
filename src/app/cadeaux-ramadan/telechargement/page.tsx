'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui'
import { ReviewForm } from '@/components/sections/review-form'
import { SocialProof } from '@/components/sections/social-proof'

interface SubscriberData {
  id: string
  firstName: string
  source: string
}

const downloads = [
  {
    number: '01',
    title: '7 étapes pour un jeûne qui soigne',
    description: 'Conseils naturopathiques pour optimiser votre énergie pendant le mois béni.',
    filename: 'MonRemede.com - 7 etapes pour un jeune qui soigne .pdf',
    locked: false,
  },
  {
    number: '02',
    title: 'Recettes Anti-Inflammatoires',
    description: 'Idées de repas équilibrés pour le ftour et le shour.',
    filename: 'Monremede.com-Recettes Anti-Inflammatoires.pdf',
    locked: true,
  },
]

function LoadingState() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-soft">Chargement...</p>
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream flex items-center justify-center py-20 px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="display-medium text-forest mb-4">
            Lien invalide
          </h1>
          <p className="text-ink-soft mb-8">
            {message}
          </p>
          <Button variant="primary" asChild>
            <Link href="/cadeaux-ramadan">
              Retourner à la page d&apos;inscription
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}

function DownloadCard({
  download,
  isUnlocked,
  onUnlockClick,
}: {
  download: typeof downloads[0]
  isUnlocked: boolean
  onUnlockClick?: () => void
}) {
  const canDownload = !download.locked || isUnlocked

  return (
    <div
      className={`bg-cream-warm rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 ${
        !canDownload ? 'opacity-80' : ''
      }`}
    >
      <div className="flex-shrink-0">
        <span className="block font-display text-5xl text-sage/30">
          {download.number}
        </span>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="heading text-forest mb-1">
          {download.title}
        </h3>
        <p className="text-ink-soft text-sm">
          {download.description}
        </p>
      </div>

      {canDownload ? (
        <Button variant="primary" size="md" asChild>
          <a
            href={`/downloads/${download.filename}`}
            download
            className="flex-shrink-0"
          >
            Télécharger
            <span className="ml-2">↓</span>
          </a>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="md"
          onClick={onUnlockClick}
          className="flex-shrink-0"
        >
          <span className="mr-2">🔒</span>
          Débloquer
        </Button>
      )}
    </div>
  )
}

function TelechargementContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriber, setSubscriber] = useState<SubscriberData | null>(null)
  const [hasReview, setHasReview] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setError('Aucun token fourni. Veuillez utiliser le lien reçu par email.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/guide-review/${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Token invalide')
        }

        setSubscriber(data.subscriber)
        setHasReview(data.hasReview)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de vérification')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  function handleReviewSuccess() {
    setHasReview(true)
    setReviewSubmitted(true)
    setShowReviewForm(false)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error || !subscriber) {
    return <ErrorState message={error || 'Impossible de vérifier votre accès'} />
  }

  const isGuide2Unlocked = hasReview

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] bg-forest-deep flex items-center py-24 px-6">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-medium">
                Espace personnel
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
            </div>

            <h1 className="display-large text-cream mb-4">
              Bienvenue, {subscriber.firstName} !
            </h1>

            <p className="body-large text-cream/70 max-w-2xl mx-auto">
              Vos guides Ramadan sont prêts à être téléchargés.
            </p>
          </div>
        </section>

        {/* Downloads Section */}
        <section className="py-16 lg:py-20 px-6 bg-cream">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {downloads.map((download) => (
                <DownloadCard
                  key={download.number}
                  download={download}
                  isUnlocked={isGuide2Unlocked}
                  onUnlockClick={() => setShowReviewForm(true)}
                />
              ))}
            </div>

            {/* Unlock info */}
            {!isGuide2Unlocked && !showReviewForm && (
              <div className="mt-8 p-6 bg-gold/10 border border-gold/30 rounded-lg text-center">
                <p className="text-forest font-medium mb-2">
                  Comment débloquer le Guide 2 ?
                </p>
                <p className="text-ink-soft text-sm mb-4">
                  Partagez votre avis sur le premier guide pour accéder au second.
                  Cela ne prend que 30 secondes !
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowReviewForm(true)}
                >
                  Donner mon avis
                  <span className="ml-2">→</span>
                </Button>
              </div>
            )}

            {/* Success message after review */}
            {reviewSubmitted && (
              <div className="mt-8 p-6 bg-sage/10 border border-sage/30 rounded-lg text-center">
                <p className="text-forest font-medium mb-2">
                  Merci pour votre avis !
                </p>
                <p className="text-ink-soft text-sm">
                  Le Guide 2 est maintenant débloqué. Bonne lecture !
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Review Form Section */}
        {showReviewForm && !hasReview && (
          <section className="py-16 lg:py-20 px-6 bg-cream-warm">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <p className="label text-sage mb-4">Votre avis compte</p>
                <h2 className="display-medium text-forest">
                  Débloquez votre second guide
                </h2>
              </div>

              <div className="bg-cream rounded-lg p-6 sm:p-8">
                <ReviewForm
                  token={token!}
                  firstName={subscriber.firstName}
                  onSuccess={handleReviewSuccess}
                />
              </div>
            </div>
          </section>
        )}

        {/* Social Proof Section */}
        <section className="py-16 lg:py-20 px-6 bg-cream">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="label text-sage mb-4">Ce qu&apos;ils en pensent</p>
              <h2 className="display-medium text-forest">
                Les avis de nos lecteurs
              </h2>
            </div>

            <SocialProof />
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="py-16 lg:py-20 px-6 bg-cream-warm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="label text-sage mb-4">Et maintenant ?</p>
              <h2 className="display-medium text-forest">
                Continuez votre parcours santé
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Book CTA */}
              <div className="bg-cream rounded-lg p-8 text-center">
                <div className="w-3 h-3 rounded-full bg-gold mx-auto mb-6" />
                <h3 className="display-medium text-forest text-xl mb-3">
                  Allez plus loin
                </h3>
                <p className="text-ink-soft text-sm mb-6">
                  Découvrez mon livre « La Santé dans l&apos;assiette »,
                  un guide complet de naturopathie pour toute la famille.
                </p>
                <Button variant="outline" size="md" asChild>
                  <Link href="/livre">
                    Découvrir le livre
                  </Link>
                </Button>
              </div>

              {/* Consultation CTA */}
              <div className="bg-cream rounded-lg p-8 text-center">
                <div className="w-3 h-3 rounded-full bg-sage mx-auto mb-6" />
                <h3 className="display-medium text-forest text-xl mb-3">
                  Besoin d&apos;un accompagnement ?
                </h3>
                <p className="text-ink-soft text-sm mb-6">
                  Réservez une consultation personnalisée pour un suivi adapté
                  à vos besoins spécifiques.
                </p>
                <Button variant="outline" size="md" asChild>
                  <Link href="/consultations">
                    Voir les consultations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-20 px-6 bg-forest-deep">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="display-medium text-cream mb-6">
              Que ce Ramadan soit une source<br />
              <span className="text-sage-light italic">de bien-être et de sérénité</span>
            </h2>
            <p className="text-cream/70 mb-8">
              N&apos;hésitez pas à me contacter si vous avez des questions.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/">
                Retour à l&apos;accueil
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function TelechargementPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TelechargementContent />
    </Suspense>
  )
}
