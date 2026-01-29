'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

const AMAZON_LINK = 'https://www.amazon.fr/dp/2959216601'

const physicalFeatures = [
  '190+ pages de conseils concrets',
  'Format broché de qualité',
  'Livraison rapide via Amazon',
  'Idéal pour annoter et surligner',
]

const ebookFeatures = [
  '190+ pages de conseils concrets',
  'Téléchargement immédiat',
  'Lisible sur tous vos appareils',
  'Écologique et économique',
]

export function PricingSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEbookPurchase = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/ebook', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return (
    <section id="commander" className="pricing-section py-20 lg:py-32 px-6 lg:px-20 bg-forest-deep">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label text-gold mb-6">Choisissez votre format</p>
          <h2 className="display-large text-cream mb-4">
            Investissez dans votre santé
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* E-book Card */}
          <div className="bg-cream rounded-sm p-8 lg:p-10 relative">
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gold text-forest-deep text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">
                Le plus populaire
              </span>
            </div>

            <div className="text-center mb-6">
              <p className="label text-sage mb-2">Version numérique</p>
              <h3 className="text-2xl font-display text-forest mb-1">E-book</h3>
              <p className="text-sm text-ink-soft">Téléchargement immédiat</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl lg:text-5xl font-display text-forest">19€</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {ebookFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-sage-light text-forest flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-ink-soft text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
                {error}
              </div>
            )}

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={handleEbookPurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-forest-deep/30 border-t-forest-deep rounded-full animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  Acheter l&apos;e-book
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>

            <p className="text-xs text-ink-soft text-center mt-4">
              Paiement sécurisé par Stripe
            </p>
          </div>

          {/* Physical Book Card */}
          <div className="bg-cream rounded-sm p-8 lg:p-10">
            <div className="text-center mb-6">
              <p className="label text-sage mb-2">Version papier</p>
              <h3 className="text-2xl font-display text-forest mb-1">Livre broché</h3>
              <p className="text-sm text-ink-soft">Via Amazon</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl lg:text-5xl font-display text-forest">19,90€</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {physicalFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-sage-light text-forest flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-ink-soft text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button variant="outline" size="lg" className="w-full justify-center" asChild>
              <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer">
                Commander sur Amazon
                <span className="ml-2">→</span>
              </a>
            </Button>

            <p className="text-xs text-ink-soft text-center mt-4">
              Livraison par Amazon
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-cream/60 text-sm mt-10 max-w-2xl mx-auto">
          Le prix d&apos;un repas au restaurant — pour un guide que vous consulterez pendant des années.
        </p>
      </div>
    </section>
  )
}
