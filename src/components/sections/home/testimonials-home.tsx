'use client'

import { useEffect, useRef, useState } from 'react'

const testimonials = [
  {
    name: 'J.L',
    content:
      'Je vous recommande vivement Zayneb. J\'ai eu recours à ses services pour traiter mes migraines et mon asthme — le résultat est stupéfiant. Son expérience en médecine et en naturopathie lui confère une vraie connaissance du corps.',
    highlight: 'le résultat est stupéfiant',
  },
  {
    name: 'Diaspora Services Family',
    content:
      'J\'avais une lombo-sciatique invalidante. Je ne pouvais plus porter mon bébé de 9 mois, j\'ai arrêté de travailler pendant 6 mois. Après la première séance avec Zayneb, ma santé s\'est beaucoup améliorée. Aujourd\'hui, je porte des sacs de 25 kg au travail.',
    highlight: 'ma santé s\'est beaucoup améliorée',
  },
  {
    name: 'Oum Imran',
    content: 'Après plus de 5 ans sans succès, je vais enfin accoucher. Merci ma sœur.',
    highlight: 'je vais enfin accoucher',
  },
]

export function TestimonialsHome() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-44 overflow-hidden bg-forest-deep">
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative botanical corners */}
      <svg
        className="absolute top-12 left-12 w-32 h-32 text-sage/10 hidden lg:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M0 50 Q20 40 30 20" />
        <path d="M0 50 Q20 60 30 80" />
        <ellipse cx="32" cy="18" rx="6" ry="4" fill="currentColor" opacity="0.3" />
        <ellipse cx="32" cy="82" rx="6" ry="4" fill="currentColor" opacity="0.3" />
        <circle cx="10" cy="50" r="3" fill="currentColor" opacity="0.2" />
      </svg>

      <svg
        className="absolute top-12 right-12 w-32 h-32 text-sage/10 hidden lg:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        style={{ transform: 'scaleX(-1)' }}
      >
        <path d="M0 50 Q20 40 30 20" />
        <path d="M0 50 Q20 60 30 80" />
        <ellipse cx="32" cy="18" rx="6" ry="4" fill="currentColor" opacity="0.3" />
        <ellipse cx="32" cy="82" rx="6" ry="4" fill="currentColor" opacity="0.3" />
        <circle cx="10" cy="50" r="3" fill="currentColor" opacity="0.2" />
      </svg>

      {/* Border accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div
          className={`text-center mb-20 lg:mb-24 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-xs tracking-[0.3em] uppercase text-gold font-medium">
              Témoignages
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </span>

          <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream leading-[0.95]">
            Elles ont retrouvé
            <br />
            <span className="italic text-sage-light">leur vitalité</span>
          </h2>
        </div>

        {/* Testimonials - staggered layout */}
        <div className="space-y-8 lg:space-y-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${200 + index * 200}ms` }}
            >
              <div
                className={`relative p-8 lg:p-12 border border-sage/15 rounded-sm bg-forest/30 backdrop-blur-sm ${
                  index % 2 === 1 ? 'lg:ml-24' : 'lg:mr-24'
                }`}
              >
                {/* Large quote mark */}
                <span className="absolute -top-6 left-8 font-display text-8xl text-gold/20 leading-none select-none">
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-cream/80 text-lg lg:text-xl leading-relaxed mb-8">
                  &laquo; {testimonial.content} &raquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
                    <span className="font-display text-lg text-cream">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-cream">{testimonial.name}</span>
                    <span className="text-sm text-sage-light/60">Consultation</span>
                  </div>
                </div>

                {/* Number indicator */}
                <span className="absolute bottom-4 right-8 font-display text-6xl text-cream/[0.03] leading-none">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
