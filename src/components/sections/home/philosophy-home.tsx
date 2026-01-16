'use client'

import { useEffect, useRef, useState } from 'react'

const pillars = [
  {
    title: "L'alimentation",
    description: "Votre premier médicament. Apprendre à nourrir plutôt qu'à remplir.",
  },
  {
    title: 'Le jeûne',
    description: 'Un outil de nettoyage et de guérison pratiqué depuis des millénaires.',
  },
  {
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

        {/* Three pillars - Editorial Bold Style */}
        <div className="relative">
          {/* Editorial grid lines */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-cream/5" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-cream/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className={`group relative border-t md:border-t-0 md:border-l border-cream/10 first:border-t-0 md:first:border-l-0 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                {/* Giant number background */}
                <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none">
                  <span
                    className="font-display text-[10rem] lg:text-[14rem] leading-none text-cream/[0.03] group-hover:text-gold/[0.06] transition-colors duration-700"
                    style={{ marginLeft: '-0.1em' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="relative p-8 lg:p-12 min-h-[320px] flex flex-col">
                  {/* Top label */}
                  <div className="flex items-center gap-3 mb-auto">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gold">
                      Pilier
                    </span>
                    <span className="h-px flex-1 bg-gold/30" />
                    <span className="font-display text-lg text-gold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title - dramatic typography */}
                  <div className="my-8">
                    <h3 className="font-display text-3xl lg:text-4xl text-cream leading-tight">
                      {pillar.title.split(' ').map((word, i) => (
                        <span key={i} className="block">
                          {i === 0 ? (
                            <span className="italic text-sage-light">{word}</span>
                          ) : (
                            word
                          )}
                        </span>
                      ))}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-cream/50 leading-relaxed text-sm lg:text-base mt-auto">
                    {pillar.description}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-8 flex items-center gap-2">
                    <div className="w-8 h-px bg-gold group-hover:w-16 transition-all duration-500" />
                    <div className="w-1 h-1 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  )
}
