import { Button } from '@/components/ui'

// TODO: Replace with actual Amazon link when available
const AMAZON_LINK = 'https://www.amazon.fr/dp/XXXXXXXXXX'

const features = [
  'Livre complet (135+ pages)',
  '30 jours de conseils nutritionnels',
  'Questionnaires d\'auto-évaluation',
  'Listes d\'aliments et leurs bienfaits',
  'Recettes et conseils pratiques',
  'Format broché ou Kindle',
]

export function PricingSection() {
  return (
    <section id="commander" className="pricing-section py-20 lg:py-32 px-6 lg:px-20 bg-forest-deep">
      <div className="pricing-container grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto overflow-hidden rounded-lg">
        {/* Visual */}
        <div className="pricing-visual relative min-h-[300px] lg:min-h-full bg-gradient-to-br from-sage to-forest overflow-hidden">
          {/* Image Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="label text-cream/60 text-center px-8">
              Image : Nature morte avec le livre, une tasse de thé, des dattes, quelques feuilles de menthe
            </span>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute bottom-8 left-8 right-8 lg:bottom-12 lg:left-12">
            <h3 className="font-display text-2xl lg:text-3xl text-cream mb-2">
              La Santé dans l&apos;assiette
            </h3>
            <p className="font-serif italic text-sage-light">
              Votre guide vers la guérison
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="pricing-content bg-cream p-8 lg:p-12">
          <p className="label text-sage mb-6">Disponible sur Amazon</p>

          {/* Price */}
          <div className="price-display flex items-start mb-8">
            <span className="text-2xl text-forest font-serif mt-2">€</span>
            <span className="text-7xl lg:text-8xl font-display text-forest leading-none">25</span>
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
          <Button variant="primary" size="lg" className="w-full justify-center mb-6" asChild>
            <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer">
              Commander sur Amazon →
            </a>
          </Button>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-ink-soft">
            <span>📦</span>
            <span>Livraison rapide via Amazon</span>
          </div>
        </div>
      </div>
    </section>
  )
}
