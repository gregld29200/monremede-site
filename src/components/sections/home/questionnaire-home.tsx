'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function QuestionnaireHome() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-b from-cream-warm to-cream"
    >
      <div className="max-w-5xl mx-auto px-8">
        {/* Carte principale */}
        <div
          className={`relative bg-white/80 backdrop-blur-sm border border-sage/10 p-10 lg:p-16 shadow-2xl shadow-forest/5 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Coins décoratifs */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold -translate-x-2 -translate-y-2" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold translate-x-2 translate-y-2" />

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Contenu */}
            <div>
              <span
                className={`inline-block px-4 py-1 bg-sage/10 text-sage text-xs tracking-wider uppercase mb-6 transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Gratuit
              </span>

              <h2
                className={`font-display text-4xl lg:text-5xl text-forest mb-6 transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Évaluez votre<br />état de santé
              </h2>

              <p
                className={`text-ink-soft mb-8 transition-all duration-700 delay-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                En quelques questions, découvrez votre profil santé personnalisé
                et recevez des conseils adaptés à vos besoins.
              </p>

              <Link
                href="/consultations/demande"
                className={`inline-flex items-center gap-3 px-8 py-4 bg-forest text-cream font-medium hover:bg-forest-deep transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Commencer le test
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Stats / Bénéfices */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {[
                { number: '3', label: 'minutes', desc: 'pour compléter' },
                { number: '12', label: 'questions', desc: 'personnalisées' },
                { number: '100%', label: 'confidentiel', desc: 'vos données protégées' },
                { number: '∞', label: 'conseils', desc: 'adaptés à vous' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`text-center p-4 border border-sage/10 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${600 + i * 100}ms` }}
                >
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
