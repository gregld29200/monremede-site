import { Button } from '@/components/ui'

const AMAZON_LINK = 'https://www.amazon.fr/dp/2959216601'

const features = [
  '190+ pages de conseils concrets',
  'Applicable toute l\'année (pas seulement le Ramadan)',
  'Questionnaires d\'auto-évaluation inclus',
  'Listes d\'aliments thérapeutiques',
  'Recettes et menus types',
]

export function PricingSection() {
  return (
    <section id="commander" className="pricing-section py-20 lg:py-32 px-6 lg:px-20 bg-forest-deep">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label text-gold mb-6">Disponible sur Amazon</p>
          <h2 className="display-large text-cream mb-4">
            Investissez dans votre santé
          </h2>
        </div>

        {/* Pricing Card */}
        <div className="bg-cream rounded-sm p-8 lg:p-12 max-w-2xl mx-auto">
          {/* Price with comparison */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl lg:text-5xl font-display text-forest">19,90€</span>
            </div>
            <p className="text-ink-soft italic">
              Le prix d&apos;un repas au restaurant — pour un guide que vous consulterez pendant des années.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-10">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-sage-light text-forest flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-ink-soft">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button variant="primary" size="lg" className="w-full justify-center" asChild>
            <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer">
              Commander sur Amazon
              <span className="ml-2">→</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
