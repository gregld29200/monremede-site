'use client'

import Link from 'next/link'

// ============================================
// VARIATION 4 : Bande horizontale magazine
// Style éditorial avec accent line et asymétrie
// ============================================
export default function Variation4() {
  return (
    <section className="py-20 lg:py-28 bg-cream border-y border-sage/10">
      {/* Label de variation */}
      <div className="max-w-7xl mx-auto px-8 mb-8">
        <span className="text-xs tracking-wider uppercase text-sage/60">
          Variation 4 — Bande magazine
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
          {/* Numéro éditorial */}
          <div className="flex-shrink-0">
            <span className="font-display text-8xl lg:text-9xl text-sage/20">03</span>
          </div>

          {/* Ligne verticale */}
          <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-gold via-gold/50 to-transparent" />

          {/* Contenu */}
          <div className="flex-grow">
            <h2 className="font-display text-3xl lg:text-4xl text-forest mb-4">
              Testez-vous maintenant
            </h2>
            <p className="text-ink-soft max-w-xl mb-6">
              Un questionnaire rapide pour identifier vos déséquilibres
              et recevoir des recommandations personnalisées.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              {['Gratuit', '3 minutes', 'Confidentiel'].map((tag) => (
                <span key={tag} className="px-3 py-1 border border-sage/20 text-sage text-xs tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/consultations/demande"
              className="group inline-flex items-center gap-4"
            >
              <span className="text-forest font-medium group-hover:text-gold transition-colors">
                Faire le test
              </span>
              <span className="w-12 h-12 rounded-full bg-gold flex items-center justify-center group-hover:bg-gold-light transition-colors">
                <svg className="w-5 h-5 text-forest-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
