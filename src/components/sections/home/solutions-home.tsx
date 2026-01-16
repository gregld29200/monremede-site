'use client'

/**
 * SolutionsHome - Magazine Editorial Spread Style
 * Double-page magazine avec colonnes équilibrées et typographie dramatique
 */

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const bookFeatures = [
  'Comment fonctionne votre digestion et pourquoi elle vous fait souffrir',
  'Les aliments qui soignent vs ceux qui épuisent votre organisme',
  'Un programme concret pour le Ramadan et au-delà',
]

const consultationFormulas = [
  { name: 'Santé Générale', price: 50, duration: '45 min' },
  { name: 'Troubles Digestifs', price: 50, duration: '45 min' },
  { name: 'Équilibre Hormonal', price: 50, duration: '45 min' },
  { name: 'Suivi Complet', price: 110, duration: '3 mois', popular: true },
]

export function SolutionsHome() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-0 overflow-hidden bg-cream">
      {/* Central divider line */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-forest/10" />

      <div className="relative max-w-7xl mx-auto">
        {/* Magazine-style header */}
        <div
          className={`relative py-16 lg:py-24 px-8 lg:px-16 text-center border-b border-forest/10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block font-display text-[8rem] lg:text-[12rem] text-forest/[0.04] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            02
          </span>
          <span className="relative text-[10px] tracking-[0.5em] uppercase text-sage">
            Chapitre II
          </span>
          <h2 className="relative font-display text-5xl lg:text-7xl text-forest mt-4 leading-[0.9]">
            Deux chemins,<br />
            <span className="italic text-sage">une destination</span>
          </h2>
        </div>

        {/* Two columns - magazine spread */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT PAGE - Le Livre */}
          <div
            className={`relative border-r-0 lg:border-r border-forest/10 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            {/* Page number */}
            <div className="absolute top-8 left-8 text-[10px] tracking-widest text-sage hidden lg:block">
              24
            </div>

            <div className="p-8 lg:p-16 lg:pr-20">
              {/* Section label */}
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full border-2 border-forest flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-sage block">
                    Option 01
                  </span>
                  <span className="font-display text-xl text-forest">Le Livre</span>
                </div>
              </div>

              {/* Book visual with decorative frame */}
              <div className="relative mb-12">
                <div className="relative max-w-sm mx-auto">
                  {/* Decorative frame layers */}
                  <div className="absolute -inset-6 border border-sage/10 rounded-sm hidden sm:block" />
                  <div className="absolute -inset-3 border border-gold/20 rounded-sm" />

                  {/* Image container */}
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-xl">
                    <Image
                      src="/images/book-mockup.png"
                      alt="La Santé dans l'assiette - 30 jours pour se soigner"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />

                    {/* Corner accents */}
                    <div className="absolute top-3 left-3 w-6 h-6">
                      <div className="absolute top-0 left-0 w-full h-px bg-gold/50" />
                      <div className="absolute top-0 left-0 h-full w-px bg-gold/50" />
                    </div>
                    <div className="absolute bottom-3 right-3 w-6 h-6">
                      <div className="absolute bottom-0 right-0 w-full h-px bg-gold/50" />
                      <div className="absolute bottom-0 right-0 h-full w-px bg-gold/50" />
                    </div>
                  </div>

                  {/* Caption label */}
                  <div className="absolute -bottom-3 left-6 bg-cream px-3 py-1 shadow-sm">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-sage">
                      30 jours
                    </span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-display text-3xl lg:text-4xl text-forest mb-4 leading-tight">
                La Santé<br />dans l&apos;assiette
              </h3>

              {/* Editorial text */}
              <p className="text-ink-soft leading-relaxed mb-8 border-l-2 border-gold pl-6">
                Comprendre comment votre corps fonctionne, lui donner ce dont il a vraiment besoin,
                et le laisser faire ce qu&apos;il sait faire — se régénérer.
              </p>

              {/* Features as editorial list */}
              <div className="space-y-4 mb-10">
                {bookFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="font-display text-gold text-lg">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-ink-soft text-sm leading-relaxed flex-1">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/livre"
                className="group inline-flex items-center gap-3 text-forest hover:text-gold transition-colors"
              >
                <span className="font-medium">Découvrir le livre</span>
                <span className="w-8 h-px bg-current group-hover:w-12 transition-all" />
              </Link>
            </div>
          </div>

          {/* RIGHT PAGE - Consultations */}
          <div
            className={`relative bg-forest-deep transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Page number */}
            <div className="absolute top-8 right-8 text-[10px] tracking-widest text-cream/40 hidden lg:block">
              25
            </div>

            <div className="p-8 lg:p-16 lg:pl-20">
              {/* Section label */}
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gold block">
                    Option 02
                  </span>
                  <span className="font-display text-xl text-cream">Consultations</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-display text-3xl lg:text-4xl text-cream mb-4 leading-tight">
                Accompagnement<br />personnalisé
              </h3>

              {/* Editorial text */}
              <p className="text-cream/70 leading-relaxed mb-10 border-l-2 border-gold pl-6">
                Parce que chaque corps est unique, parfois on a besoin d&apos;un regard extérieur
                pour y voir clair dans son parcours santé.
              </p>

              {/* Formulas as editorial table */}
              <div className="border-t border-cream/10 mb-10">
                {consultationFormulas.map((formula, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-4 border-b border-cream/10 ${
                      formula.popular ? 'bg-gold/10 -mx-4 px-4' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {formula.popular && (
                        <span className="w-2 h-2 rounded-full bg-gold" />
                      )}
                      <div>
                        <span className="font-medium text-cream">{formula.name}</span>
                        <span className="text-cream/50 text-sm block">{formula.duration}</span>
                      </div>
                    </div>
                    <span className="font-display text-2xl text-gold">{formula.price}€</span>
                  </div>
                ))}
              </div>

              <Link
                href="/consultations"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-forest-deep rounded-sm hover:bg-gold-light transition-colors"
              >
                <span className="font-medium">Voir les formules</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
