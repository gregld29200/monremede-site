'use client'

import Link from 'next/link'

// ============================================
// VARIATION 3 : Carte flottante
// Grande carte avec ombre sur fond texturé
// ============================================
export default function Variation3() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-cream-warm to-cream">
      {/* Label de variation */}
      <div className="max-w-5xl mx-auto px-8 mb-8">
        <span className="text-xs tracking-wider uppercase text-sage/60">
          Variation 3 — Carte flottante
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-8">
        {/* Carte principale */}
        <div className="relative bg-white/80 backdrop-blur-sm border border-sage/10 p-12 lg:p-16 shadow-2xl shadow-forest/5">
          {/* Coins décoratifs */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold -translate-x-2 -translate-y-2" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold translate-x-2 translate-y-2" />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu */}
            <div>
              <span className="inline-block px-4 py-1 bg-sage/10 text-sage text-xs tracking-wider uppercase mb-6">
                Gratuit
              </span>

              <h2 className="font-display text-4xl lg:text-5xl text-forest mb-6">
                Évaluez votre<br />état de santé
              </h2>

              <p className="text-ink-soft mb-8">
                En quelques questions, découvrez votre profil santé personnalisé
                et recevez des conseils adaptés à vos besoins.
              </p>

              <Link
                href="/consultations/demande"
                className="inline-flex items-center gap-3 px-8 py-4 bg-forest text-cream font-medium hover:bg-forest-deep transition-colors"
              >
                Commencer le test
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Stats / Bénéfices */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '3', label: 'minutes', desc: 'pour compléter' },
                { number: '12', label: 'questions', desc: 'personnalisées' },
                { number: '100%', label: 'confidentiel', desc: 'vos données protégées' },
                { number: '∞', label: 'conseils', desc: 'adaptés à vous' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 border border-sage/10">
                  <span className="block font-display text-3xl text-gold">{stat.number}</span>
                  <span className="block text-forest font-medium text-sm">{stat.label}</span>
                  <span className="block text-ink-soft/60 text-xs mt-1">{stat.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
