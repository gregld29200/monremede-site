'use client'

import Link from 'next/link'

// ============================================
// VARIATION 2 : Split dramatique
// Moitié forest-deep / moitié cream avec visuel
// ============================================
export default function Variation2() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Label de variation */}
      <div className="absolute top-4 left-8 z-10">
        <span className="text-xs tracking-wider uppercase text-cream/60 bg-forest-deep/80 px-3 py-1">
          Variation 2 — Split dramatique
        </span>
      </div>

      {/* Background split */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-forest-deep" />
        <div className="w-1/2 bg-cream-warm" />
      </div>

      <div className="relative max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
          {/* Côté gauche - Contenu */}
          <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-16">
            <span className="text-xs tracking-[0.3em] uppercase text-sage-light mb-4">
              Bilan santé
            </span>

            <h2 className="font-display text-4xl lg:text-5xl text-cream mb-6">
              Faites le point<br />
              <span className="text-gold">en 3 minutes</span>
            </h2>

            <p className="text-cream/70 mb-8 max-w-md">
              Un questionnaire personnalisé pour comprendre vos besoins
              et identifier les déséquilibres de votre organisme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/consultations/demande"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-forest-deep font-medium hover:bg-gold-light transition-colors"
              >
                Démarrer maintenant
              </Link>
            </div>
          </div>

          {/* Côté droit - Visuel */}
          <div className="hidden lg:flex items-center justify-center py-16">
            <div className="relative">
              {/* Cercle décoratif */}
              <div className="w-80 h-80 rounded-full border border-sage/20 flex items-center justify-center">
                <div className="w-60 h-60 rounded-full border border-sage/30 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block font-display text-6xl text-forest mb-2">?</span>
                    <span className="text-sage text-sm">Votre profil</span>
                  </div>
                </div>
              </div>
              {/* Accent */}
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gold" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
