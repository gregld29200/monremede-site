'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const bookFeatures = [
  'Comment fonctionne votre digestion et pourquoi elle vous fait souffrir',
  'Les aliments qui soignent vs ceux qui épuisent votre organisme',
  'Un programme concret pour profiter pleinement du Ramadan (et au-delà)',
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
    <section ref={sectionRef} className="relative py-32 lg:py-44 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cream-warm" />

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Large background text */}
      <div className="absolute top-1/3 left-0 pointer-events-none select-none hidden xl:block">
        <span className="font-display text-[14rem] leading-none text-forest/[0.015] tracking-tighter">
          VITALITÉ
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div
          className={`text-center mb-20 lg:mb-28 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-sage" />
            <span className="text-xs tracking-[0.3em] uppercase text-sage font-medium">
              Vos options
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-sage" />
          </span>

          <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-forest leading-[0.95] mb-6">
            Deux chemins pour retrouver
            <br />
            <span className="italic text-sage">votre vitalité</span>
          </h2>

          <p className="text-ink-soft text-lg max-w-xl mx-auto">
            Que vous préfériez avancer en autonomie ou être accompagné(e), il y a une porte
            d&apos;entrée pour vous.
          </p>
        </div>

        {/* Two paths - asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          {/* LE LIVRE */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="lg:pr-8 xl:pr-12">
              {/* Image placeholder */}
              <div className="relative mb-10 lg:mb-12">
                <div className="aspect-[4/3] bg-gradient-to-br from-forest/10 via-sage/10 to-cream rounded-sm overflow-hidden">
                  {/* Placeholder content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative mx-auto w-32 h-44 mb-4">
                        {/* Book mockup */}
                        <div className="absolute inset-0 bg-forest rounded-r-sm shadow-2xl transform rotate-3">
                          <div className="absolute inset-2 border border-gold/20 rounded-r-sm" />
                          <div className="absolute top-4 left-4 right-4">
                            <div className="h-1 bg-gold/30 rounded mb-2" />
                            <div className="h-1 bg-gold/20 rounded w-2/3" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-forest-deep rounded-r-sm shadow-xl transform -rotate-3 -translate-x-2">
                          <div className="absolute inset-2 border border-gold/30 rounded-r-sm" />
                        </div>
                      </div>
                      <p className="text-forest/60 text-sm font-accent">
                        Mockup livre sur fond lin
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 lg:right-4 bg-cream p-4 rounded-sm shadow-xl border border-sage/10">
                  <svg className="w-8 h-8 text-forest mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider text-sage">Livre</span>
                </div>
              </div>

              {/* Content */}
              <div className="max-w-md">
                <h3 className="font-display text-3xl lg:text-4xl text-forest mb-3">
                  La Santé dans l&apos;assiette
                </h3>
                <p className="font-accent text-xl text-sage italic mb-8">
                  30 jours pour comprendre votre corps et transformer votre alimentation en alliée.
                </p>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {bookFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-ink-soft leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/livre"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-forest text-cream rounded-sm hover:bg-forest-deep transition-colors duration-300"
                >
                  <span className="font-medium">Découvrir le livre</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* LES CONSULTATIONS */}
          <div
            className={`relative transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Vertical divider */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-sage/20 to-transparent" />

            <div className="lg:pl-8 xl:pl-12 lg:mt-24">
              {/* Image placeholder */}
              <div className="relative mb-10 lg:mb-12">
                <div className="aspect-[4/3] bg-gradient-to-br from-blush/20 via-sage/10 to-cream rounded-sm overflow-hidden">
                  {/* Placeholder content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative mx-auto w-40 h-32 mb-4">
                        {/* Abstract hands illustration */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-28 bg-blush/30 rounded-full transform -rotate-12" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-28 bg-sage/30 rounded-full transform rotate-12" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-12 h-12 text-sage" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C7.03 2 3 6.03 3 11c0 2.1.72 4.03 1.93 5.57L12 22l7.07-5.43C20.28 15.03 21 13.1 21 11c0-4.97-4.03-9-9-9zm0 12.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" opacity="0.6"/>
                          </svg>
                        </div>
                      </div>
                      <p className="text-forest/60 text-sm font-accent">
                        Mains accompagnement avec eucalyptus
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 lg:left-4 bg-cream p-4 rounded-sm shadow-xl border border-sage/10">
                  <svg className="w-8 h-8 text-gold mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider text-sage">Consultations</span>
                </div>
              </div>

              {/* Content */}
              <div className="max-w-md">
                <h3 className="font-display text-3xl lg:text-4xl text-forest mb-3">
                  Un accompagnement sur-mesure
                </h3>
                <p className="font-accent text-xl text-sage italic mb-8">
                  Parce que chaque corps est unique, parfois on a besoin d&apos;un regard extérieur
                  pour y voir clair.
                </p>

                {/* Formulas table */}
                <div className="space-y-3 mb-10">
                  {consultationFormulas.map((formula, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center justify-between p-4 rounded-sm transition-all duration-300 ${
                        formula.popular
                          ? 'bg-gold/10 border border-gold/30'
                          : 'bg-cream border border-sage/10 hover:border-sage/30'
                      }`}
                    >
                      {formula.popular && (
                        <span className="absolute -top-2 right-4 px-2 py-0.5 bg-gold text-forest-deep text-[10px] uppercase tracking-wider font-semibold rounded-sm">
                          Populaire
                        </span>
                      )}
                      <div>
                        <span className="font-medium text-forest">{formula.name}</span>
                        <span className="text-ink-soft text-sm ml-2">/ {formula.duration}</span>
                      </div>
                      <span className="font-display text-xl text-forest">{formula.price}€</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/consultations"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-forest-deep rounded-sm hover:bg-gold-light transition-colors duration-300"
                >
                  <span className="font-medium">Voir les formules en détail</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
