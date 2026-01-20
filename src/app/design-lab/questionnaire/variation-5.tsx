'use client'

import Link from 'next/link'
import { useState } from 'react'

// ============================================
// VARIATION 5 : Interactive preview
// Aperçu du questionnaire avec premier champ
// ============================================
export default function Variation5() {
  const [name, setName] = useState('')

  return (
    <section className="py-24 lg:py-32 bg-forest-deep relative overflow-hidden">
      {/* Label de variation */}
      <div className="absolute top-4 left-8 z-10">
        <span className="text-xs tracking-wider uppercase text-cream/60">
          Variation 5 — Interactive preview
        </span>
      </div>

      {/* Texture grain */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      <div className="relative max-w-4xl mx-auto px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Commencez maintenant
          </span>
          <h2 className="font-display text-4xl lg:text-5xl text-cream mb-4">
            Votre bilan santé personnalisé
          </h2>
          <p className="text-cream/60 max-w-lg mx-auto">
            Répondez à quelques questions pour découvrir votre profil
          </p>
        </div>

        {/* Mini formulaire preview */}
        <div className="max-w-md mx-auto">
          <div className="bg-cream/5 backdrop-blur-sm border border-cream/10 p-8 rounded-sm">
            <label className="block mb-2 text-cream/80 text-sm">
              Pour commencer, quel est votre prénom ?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
            />

            <Link
              href="/consultations/demande"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gold text-forest-deep font-medium hover:bg-gold-light transition-colors"
            >
              Continuer
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Progress hint */}
          <div className="mt-6 flex items-center justify-center gap-2 text-cream/40 text-sm">
            <div className="w-8 h-1 bg-gold rounded-full" />
            <div className="w-8 h-1 bg-cream/20 rounded-full" />
            <div className="w-8 h-1 bg-cream/20 rounded-full" />
            <span className="ml-2">Étape 1/3</span>
          </div>
        </div>
      </div>
    </section>
  )
}
