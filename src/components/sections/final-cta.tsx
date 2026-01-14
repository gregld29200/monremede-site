'use client'
import { Button } from '@/components/ui'

// TODO: Replace with actual Amazon link when available
const AMAZON_LINK = 'https://www.amazon.fr/dp/XXXXXXXXXX'

export function FinalCTASection() {
  return (
    <section className="final-cta py-24 lg:py-32 px-6 lg:px-20 bg-forest text-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full border border-sage" />
        <div className="absolute bottom-[20%] right-[15%] w-40 h-40 rounded-full border border-gold" />
      </div>

      <div className="final-cta-content max-w-2xl mx-auto relative z-10">
        <h2 className="display-large text-cream mb-8">
          Prête à transformer votre santé ?
        </h2>
        <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
          Ne laissez pas un Ramadan de plus vous épuiser. Offrez à votre corps les soins qu&apos;il mérite
          et découvrez comment faire de l&apos;alimentation votre meilleur allié santé.
        </p>
        <Button variant="primary" size="lg" asChild>
          <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer">
            Commander sur Amazon
            <span>→</span>
          </a>
        </Button>
      </div>
    </section>
  )
}
