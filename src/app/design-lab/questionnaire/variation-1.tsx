'use client'

import Link from 'next/link'

// ============================================
// VARIATION 1 : Minimaliste élégant
// Fond cream, texte centré, CTA gold discret
// ============================================
export default function Variation1() {
  return (
    <section className="py-24 lg:py-32 bg-cream">
      <div className="max-w-3xl mx-auto px-8 text-center">
        {/* Label de variation */}
        <div className="mb-8 pb-4 border-b border-sage/20">
          <span className="text-xs tracking-wider uppercase text-sage/60">
            Variation 1 — Minimaliste élégant
          </span>
        </div>

        {/* Eyebrow */}
        <span className="inline-block text-xs tracking-[0.3em] uppercase text-sage mb-6">
          Test gratuit • 3 minutes
        </span>

        {/* Ligne décorative */}
        <div className="flex justify-center mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Titre */}
        <h2 className="font-display text-4xl lg:text-5xl text-forest mb-6">
          Et vous, où en êtes-vous ?
        </h2>

        {/* Sous-titre */}
        <p className="font-accent text-xl text-sage italic mb-10 max-w-xl mx-auto">
          Découvrez ce que votre corps essaie de vous dire
        </p>

        {/* CTA */}
        <Link
          href="/consultations/demande"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-forest-deep font-medium hover:bg-gold-light transition-colors duration-300"
        >
          Commencer le test
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* Reassurance */}
        <p className="text-ink-soft/50 text-sm mt-6">
          Confidentiel • Résultats immédiats
        </p>
      </div>
    </section>
  )
}
