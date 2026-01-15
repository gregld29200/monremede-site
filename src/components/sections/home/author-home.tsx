'use client'

import { useEffect, useRef, useState } from 'react'

const specialties = [
  'Naturopathie',
  'Micronutrition',
  'Réflexologie',
  'Hijama',
  'Accompagnement du jeûne',
]

export function AuthorHome() {
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
    <section ref={sectionRef} className="relative py-32 lg:py-44 overflow-hidden bg-cream">
      {/* Organic background shapes */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--sage) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--blush) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Decorative botanical line art */}
      <svg
        className="absolute bottom-20 left-20 w-48 h-48 text-sage/10 hidden xl:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M50 100 L50 50" />
        <path d="M50 50 Q20 40 10 20" />
        <path d="M50 50 Q80 40 90 20" />
        <ellipse cx="10" cy="18" rx="8" ry="5" fill="currentColor" opacity="0.2" />
        <ellipse cx="90" cy="18" rx="8" ry="5" fill="currentColor" opacity="0.2" />
        <path d="M50 70 Q30 60 20 50" />
        <path d="M50 70 Q70 60 80 50" />
        <ellipse cx="18" cy="48" rx="6" ry="4" fill="currentColor" opacity="0.15" />
        <ellipse cx="82" cy="48" rx="6" ry="4" fill="currentColor" opacity="0.15" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image area - editorial treatment */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative">
              {/* Decorative frame layers */}
              <div className="absolute -inset-6 border border-sage/10 rounded-sm hidden lg:block" />
              <div className="absolute -inset-3 border border-gold/20 rounded-sm" />

              {/* Main image container */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-forest/10 via-sage/15 to-blush/10 rounded-sm overflow-hidden">
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-32 h-40 mx-auto mb-6 bg-forest/5 rounded-full flex items-center justify-center relative">
                      {/* Silhouette hint */}
                      <div className="w-20 h-28 bg-forest/10 rounded-full" />
                      <div className="absolute top-2 w-10 h-10 bg-forest/10 rounded-full" />
                    </div>
                    <p className="text-forest/60 text-sm font-accent leading-relaxed max-w-xs">
                      Femme voilée de dos regardant par une fenêtre lumineuse, intérieur chaleureux avec plantes
                    </p>
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-px bg-gold/40" />
                  <div className="absolute top-0 left-0 h-full w-px bg-gold/40" />
                </div>
                <div className="absolute bottom-4 right-4 w-8 h-8">
                  <div className="absolute bottom-0 right-0 w-full h-px bg-gold/40" />
                  <div className="absolute bottom-0 right-0 h-full w-px bg-gold/40" />
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-6 -right-6 lg:right-6 bg-forest-deep text-cream p-6 rounded-sm shadow-2xl">
                <span className="block font-display text-4xl text-gold mb-1">15+</span>
                <span className="text-xs uppercase tracking-wider text-cream/70">années</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs tracking-[0.3em] uppercase text-sage font-medium">
                Votre naturopathe
              </span>
            </span>

            <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-forest leading-[0.95] mb-10">
              Qui suis-je ?
            </h2>

            <div className="space-y-6 text-ink-soft text-lg leading-relaxed mb-12">
              <p>
                Je m&apos;appelle Zayneb, <strong className="text-forest font-medium">Oum Soumayya</strong>.
                Pendant des années, j&apos;ai souffert de douleurs que personne ne comprenait —
                sinusites chroniques, troubles digestifs, fatigue constante. Les médecins me
                disaient que &quot;tout allait bien&quot;.
              </p>
              <p>
                C&apos;est en me tournant vers la naturopathie que j&apos;ai enfin trouvé des réponses.
                Et surtout, une guérison.
              </p>
              <p>
                Depuis <strong className="text-forest font-medium">2009</strong>, j&apos;accompagne des familles qui,
                comme moi, cherchaient une autre voie. Naturopathie, micronutrition, jeûne
                thérapeutique — j&apos;ai compilé tout ce que j&apos;ai appris dans mon livre et dans mes
                consultations.
              </p>
            </div>

            {/* Quote highlight */}
            <blockquote className="relative pl-8 py-4 mb-12 border-l-2 border-gold">
              <p className="font-accent text-xl lg:text-2xl text-forest italic">
                Mon objectif : que vous deveniez autonome et maître de votre santé.
              </p>
            </blockquote>

            {/* Specialties */}
            <div>
              <span className="text-xs tracking-wider uppercase text-sage/60 mb-4 block">
                Spécialités
              </span>
              <div className="flex flex-wrap gap-3">
                {specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cream-warm border border-sage/15 rounded-sm text-forest text-sm hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
