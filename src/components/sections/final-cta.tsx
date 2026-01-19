'use client'
import { Button } from '@/components/ui'

const AMAZON_LINK = 'https://www.amazon.fr/dp/2959216601'

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
          Ne laissez pas passer un Ramadan de plus sans comprendre votre corps.
        </h2>
        <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
          Ce livre est le premier pas vers une santé que vous méritez.
        </p>
        <Button variant="primary" size="lg" asChild>
          <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer">
            Commander maintenant sur Amazon
            <span className="ml-2">→</span>
          </a>
        </Button>
      </div>
    </section>
  )
}
