'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuestionnaire } from './context'
import {
  getProfileInfo,
  getAlertCategories,
  getCategoryName,
  getCategoryScorePercentage,
} from './utils'
import { categories, AMAZON_BOOK_LINK } from './data'
import { Button } from '@/components/ui'

export function QuestionnaireResults() {
  const { state, reset } = useQuestionnaire()
  // Use a ref-based approach to trigger animations without useEffect
  const [mounted] = useState(true)

  if (!state.profile || !state.categoryScores) return null

  const profileInfo = getProfileInfo(state.profile)
  const alertCategories = getAlertCategories(state.categoryScores)

  return (
    <div className="min-h-screen bg-cream pt-28 pb-12 px-6">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Score Section */}
        <section
          className={`text-center mb-16 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-xs tracking-[0.3em] uppercase text-sage font-medium">
              Vos Résultats
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>

          {/* Score display */}
          <div className="relative inline-block mb-8">
            <div className="w-40 h-40 rounded-full bg-cream-warm border-4 border-sage/20 flex items-center justify-center">
              <div className="text-center">
                <span className="font-display text-5xl text-forest">
                  {state.totalScore}
                </span>
                <span className="text-sage text-lg">/50</span>
              </div>
            </div>
            {/* Profile emoji badge */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-cream rounded-full border-2 border-gold flex items-center justify-center text-2xl shadow-lg">
              {profileInfo.emoji}
            </div>
          </div>

          {/* Profile title */}
          <h1 className="font-display text-3xl sm:text-4xl text-forest mb-4">
            {profileInfo.title}
          </h1>

          {/* Profile description */}
          <p className="text-ink-soft text-lg max-w-xl mx-auto leading-relaxed">
            {profileInfo.description}
          </p>
        </section>

        {/* Category Breakdown */}
        <section
          className={`mb-16 transition-all duration-1000 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="heading text-forest text-center mb-8">
            Analyse par catégorie
          </h2>

          <div className="bg-cream-warm rounded-2xl p-6 sm:p-8">
            <div className="space-y-4">
              {categories.map((category) => {
                const score = state.categoryScores![category.id]
                const percentage = getCategoryScorePercentage(category.id, score)
                const isAlert = alertCategories.includes(category.id)

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-ink-soft">{category.name}</span>
                      <span
                        className={`text-sm font-medium ${
                          isAlert ? 'text-blush-deep' : 'text-sage'
                        }`}
                      >
                        {score}/{category.maxScore}
                        {isAlert && ' ⚠️'}
                      </span>
                    </div>
                    <div className="h-2 bg-sage/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isAlert
                            ? 'bg-gradient-to-r from-blush-deep to-blush'
                            : 'bg-gradient-to-r from-sage to-sage-light'
                        }`}
                        style={{
                          width: mounted ? `${percentage}%` : '0%',
                          transitionDelay: '500ms',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Alert Categories */}
        {alertCategories.length > 0 && (
          <section
            className={`mb-16 transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="heading text-forest text-center mb-6">
              Points d&apos;attention
            </h2>

            <div className="bg-blush/20 border border-blush-deep/20 rounded-2xl p-6">
              <p className="text-ink-soft mb-4">
                Les catégories suivantes nécessitent une attention particulière :
              </p>
              <ul className="space-y-2">
                {alertCategories.map((catId) => (
                  <li key={catId} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blush-deep" />
                    <span className="text-ink">{getCategoryName(catId)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Recommendations */}
        <section
          className={`mb-16 transition-all duration-1000 delay-400 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="heading text-forest text-center mb-6">
            {state.profile === 'equilibre'
              ? 'Ce que vous pouvez améliorer'
              : 'Ce que votre corps essaie de vous dire'}
          </h2>

          <div className="grid gap-4">
            {profileInfo.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-cream-warm rounded-xl"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sage/20 text-forest flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-ink-soft">{rec}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Book CTA Section */}
        <section
          className={`transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-forest-deep rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sage/10 rounded-full blur-2xl" />

            <div className="relative">
              <p className="label text-gold mb-4">La solution</p>

              <h2 className="font-display text-2xl sm:text-3xl text-cream mb-6">
                Découvrez « La Santé dans l&apos;Assiette »
              </h2>

              <p className="text-cream/70 mb-8 max-w-lg mx-auto">
                Votre guide complet pour transformer le Ramadan en cure de régénération
                — par Oum Soumayya, praticienne en Médecine Prophétique et Naturopathie.
              </p>

              {/* Book benefits */}
              <div className="text-left bg-cream/10 rounded-xl p-6 mb-8">
                <p className="text-gold text-sm uppercase tracking-wider mb-4">
                  Dans ce livre, vous découvrirez :
                </p>
                <ul className="space-y-3">
                  {profileInfo.bookBenefits.slice(0, 5).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-cream/90">
                      <span className="text-gold mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                variant="primary"
                size="lg"
                asChild
                className="mb-4"
              >
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

              <p className="text-cream/50 text-sm">
                Disponible en format broché et Kindle
              </p>
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" onClick={reset}>
            Refaire le questionnaire
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/consultations">
              Découvrir les consultations
            </Link>
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
