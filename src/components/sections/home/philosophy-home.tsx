'use client'

import { useEffect, useRef, useState } from 'react'

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <circle cx="24" cy="20" r="8" />
        <path d="M24 28 L24 44" />
        <path d="M16 36 L32 36" />
        <path d="M8 20 Q16 12 24 12 Q32 12 40 20" strokeDasharray="2 2" />
      </svg>
    ),
    title: "L'alimentation",
    description: 'Votre premier médicament. Apprendre à nourrir plutôt qu\'à remplir.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <circle cx="24" cy="24" r="16" />
        <path d="M24 8 L24 12" />
        <path d="M24 36 L24 40" />
        <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.3" />
        <path d="M24 24 L24 14" strokeLinecap="round" />
        <path d="M24 24 L30 24" strokeLinecap="round" />
      </svg>
    ),
    title: 'Le jeûne',
    description: 'Un outil de nettoyage et de guérison pratiqué depuis des millénaires.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M12 24 Q12 12 24 12 Q36 12 36 24 Q36 36 24 44 Q12 36 12 24" />
        <path d="M20 20 L28 20" strokeLinecap="round" />
        <path d="M20 28 L28 28" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    title: "L'accompagnement",
    description: 'Un regard extérieur pour comprendre vos signaux et adapter votre parcours.',
  },
]

export function PhilosophyHome() {
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
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--sage) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Large decorative typography */}
      <div className="absolute bottom-20 right-0 pointer-events-none select-none hidden xl:block overflow-hidden">
        <span className="font-display text-[16rem] leading-none text-cream/[0.02] tracking-tighter">
          SANTÉ
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-20 lg:mb-28">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-medium">
                Une vision différente
              </span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
            </span>

            <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream leading-[0.95] mb-6">
              Une autre approche
              <br />
              <span className="italic text-sage-light">de la santé</span>
            </h2>
          </div>
        </div>

        {/* Philosophy text - editorial layout */}
        <div
          className={`max-w-4xl mx-auto mb-24 lg:mb-32 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Large opening quote */}
            <div className="lg:col-span-1 hidden lg:flex justify-center">
              <span className="font-display text-8xl text-gold/30 leading-none">&ldquo;</span>
            </div>

            <div className="lg:col-span-11 space-y-6 text-cream/75 text-lg lg:text-xl leading-relaxed">
              <p>
                Nos grands-parents le savaient : la santé se construit d&apos;abord dans l&apos;assiette.
                Avant les médicaments, il y avait les plantes, les bouillons, le repos, le jeûne.
              </p>
              <p>
                Aujourd&apos;hui, on a oublié ces savoirs simples. On mange trop, trop vite, trop
                transformé. Et notre corps s&apos;épuise à compenser.
              </p>
              <p className="text-cream text-xl lg:text-2xl font-accent italic border-l-2 border-gold pl-6 py-2">
                <span className="text-gold font-semibold not-italic">Mon Remède</span>, c&apos;est un
                retour à l&apos;essentiel : comprendre comment votre corps fonctionne, lui donner ce
                dont il a vraiment besoin, et le laisser faire ce qu&apos;il sait faire —{' '}
                <span className="text-sage-light">se régénérer</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              {/* Card */}
              <div className="relative p-8 lg:p-10 border border-sage/20 rounded-sm bg-forest/40 backdrop-blur-sm hover:border-gold/30 hover:bg-forest/60 transition-all duration-500">
                {/* Number indicator */}
                <span className="absolute top-4 right-4 text-xs tracking-widest text-sage/40 font-mono">
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 mb-8 text-sage-light group-hover:text-gold transition-colors duration-500">
                  {pillar.icon}
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl lg:text-3xl text-cream mb-4">{pillar.title}</h3>
                <p className="text-cream/60 leading-relaxed">{pillar.description}</p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  )
}
