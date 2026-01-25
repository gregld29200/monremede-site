'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuestionnaire } from './context'
import { AMAZON_BOOK_LINK } from './data'
import { Button } from '@/components/ui'

export function QuestionnaireResults() {
  const { state, reset } = useQuestionnaire()
  const [mounted] = useState(true)

  if (!state.profile || !state.categoryScores) return null

  return (
    <div className="min-h-screen bg-cream pt-28 pb-12 px-6">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Thank You Section */}
        <section
          className={`text-center mb-12 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-sage/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-sage"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-xs tracking-[0.3em] uppercase text-sage font-medium">
              Questionnaire complété
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-forest mb-6">
            Merci {state.personalInfo?.firstName} !
          </h1>

          <p className="text-ink-soft text-lg max-w-lg mx-auto leading-relaxed mb-2">
            Merci pour l&apos;intérêt que vous portez à votre santé naturelle.
          </p>

          <p className="text-ink-soft text-lg max-w-lg mx-auto leading-relaxed mb-4">
            Vous recevrez votre{' '}
            <span className="text-forest font-medium">bilan de santé personnalisé</span>{' '}
            analysé par <span className="text-forest font-medium">Oum Soumayya</span>, votre praticienne en naturopathie depuis 2009, sous <span className="text-forest font-medium">24 heures</span>.
          </p>

          {/* Email Info */}
          <div className="bg-cream-warm rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg
                className="w-5 h-5 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-forest font-medium">{state.personalInfo?.email}</span>
            </div>
            <p className="text-sm text-ink-soft">
              Pensez à vérifier vos <span className="text-sage font-medium">spams</span> si vous ne recevez pas l&apos;email d&apos;ici là.
            </p>
          </div>
        </section>

        {/* What's Next Section */}
        <section
          className={`mb-12 transition-all duration-1000 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="heading text-forest text-center mb-6">
            En attendant votre bilan...
          </h2>

          <div className="space-y-4">
            {/* Book CTA Card */}
            <div className="bg-forest-deep rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage/10 rounded-full blur-2xl" />

              <div className="relative">
                <p className="label text-gold mb-3">Le livre</p>
                <h3 className="font-display text-xl sm:text-2xl text-cream mb-4">
                  « La Santé dans l&apos;Assiette »
                </h3>
                <p className="text-cream/70 text-sm mb-6 max-w-md mx-auto">
                  30 jours pour guérir naturellement — Votre guide complet en naturopathie
                  et médecine prophétique par Oum Soumayya.
                </p>
                <Button variant="primary" size="lg" asChild>
                  <a href={AMAZON_BOOK_LINK} target="_blank" rel="noopener noreferrer">
                    Commander sur Amazon
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </Button>
                <p className="text-cream/50 text-xs mt-3">
                  Disponible en format broché et Kindle
                </p>
              </div>
            </div>

            {/* Consultations CTA Card */}
            <div className="bg-cream-warm rounded-2xl p-6 sm:p-8 text-center">
              <p className="label text-sage mb-3">Accompagnement personnalisé</p>
              <h3 className="font-display text-xl text-forest mb-4">
                Consultations en naturopathie
              </h3>
              <p className="text-ink-soft text-sm mb-6 max-w-md mx-auto">
                Bénéficiez d&apos;un suivi personnalisé avec Oum Soumayya pour un
                accompagnement adapté à vos besoins spécifiques.
              </p>
              <Button variant="outline" asChild>
                <Link href="/consultations">
                  Découvrir les consultations
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div
          className={`text-center transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button variant="ghost" onClick={reset}>
            Refaire le questionnaire
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-ink-soft mt-12 max-w-md mx-auto">
          Ce questionnaire est à titre informatif et ne remplace pas un avis médical.
          Consultez un professionnel de santé pour tout problème de santé.
        </p>
      </div>
    </div>
  )
}
