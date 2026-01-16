'use client'

/**
 * PainPointsHome - Editorial Magazine Style
 * Style magazine haut de gamme avec typographie dramatique,
 * grille brisée et numéros géants
 */

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const painPoints = [
  {
    title: 'La fatigue qui ne part pas',
    description:
      "Vous dormez, mais vous vous réveillez épuisé(e). Le café ne suffit plus. Votre énergie d'avant vous manque.",
    pullQuote: 'épuisé(e)',
  },
  {
    title: 'Une digestion devenue un combat',
    description:
      'Ballonnements, acidités, lourdeurs après chaque repas… Manger est devenu une source de stress plutôt que de plaisir.',
    pullQuote: 'un combat',
  },
  {
    title: 'Des réponses qui ne satisfont pas',
    description:
      'On vous dit que "tout va bien" ou on vous prescrit encore un médicament. Mais au fond, vous sentez que quelque chose ne va pas.',
    pullQuote: 'quelque chose',
  },
  {
    title: "L'impression de tourner en rond",
    description:
      'Vous avez essayé des régimes, des compléments, des conseils trouvés ici et là. Rien ne tient sur la durée.',
    pullQuote: 'en rond',
  },
]

export function PainPointsHome() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2ebe1 0%, #efe9dc 100%)' }}
    >
      {/* Editorial grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[8%] top-0 bottom-0 w-px bg-forest/5" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-forest/5" />
        <div className="absolute right-[8%] top-0 bottom-0 w-px bg-forest/5" />
      </div>

      {/* Giant decorative number */}
      <div
        className={`absolute top-20 -right-20 font-display text-[40rem] leading-none text-forest/[0.02] select-none pointer-events-none transition-all duration-[2s] hidden xl:block ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'
        }`}
      >
        04
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8 lg:px-16 py-32 lg:py-40">
        {/* Editorial header - dramatic asymmetric layout */}
        <header className="grid grid-cols-12 gap-4 mb-32">
          <div className="col-span-12 lg:col-span-7 lg:col-start-1">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              {/* Section label - editorial style */}
              <div className="flex items-center gap-4 mb-8">
                <span
                  className="text-[10px] tracking-[0.4em] uppercase text-terracotta font-medium"
                  style={{ fontFamily: 'var(--font-accent)' }}
                >
                  Chapitre Premier
                </span>
                <span className="flex-1 h-px bg-terracotta/30 max-w-[100px]" />
              </div>

              {/* Main headline - broken across lines */}
              <h2 className="font-display text-6xl lg:text-8xl xl:text-9xl text-forest leading-[0.85] tracking-tight">
                <span className="block">Reconnaissez</span>
                <span className="block lg:ml-[15%] italic text-sage">-vous ces</span>
                <span className="block">
                  signaux<span className="text-terracotta">?</span>
                </span>
              </h2>
            </div>
          </div>

          {/* Pull quote floating element */}
          <div
            className={`col-span-12 lg:col-span-4 lg:col-start-9 lg:mt-32 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative pl-6 border-l-2 border-terracotta/40">
              <p className="font-accent text-xl lg:text-2xl text-ink-soft italic leading-relaxed">
                &ldquo;Votre corps vous parle depuis longtemps. Il est temps de l&apos;écouter.&rdquo;
              </p>
            </div>
          </div>
        </header>

        {/* Pain points - editorial staggered layout */}
        <div className="space-y-24 lg:space-y-32">
          {painPoints.map((point, index) => (
            <article
              key={index}
              className={`grid grid-cols-12 gap-4 items-start transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              {/* Large numeral */}
              <div className={`col-span-2 lg:col-span-1 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <span className="font-display text-7xl lg:text-8xl text-forest/10 leading-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div
                className={`col-span-10 lg:col-span-5 ${
                  index % 2 === 0 ? 'lg:col-start-3' : 'lg:col-start-4'
                }`}
              >
                <h3 className="font-display text-2xl lg:text-3xl text-forest mb-4 leading-tight">
                  {point.title}
                </h3>
                <p className="text-ink-soft leading-[1.9] text-lg">{point.description}</p>
              </div>

              {/* Pull quote - floating */}
              <div
                className={`hidden lg:block lg:col-span-3 ${
                  index % 2 === 0 ? 'lg:col-start-9' : 'lg:col-start-10'
                } lg:mt-8`}
              >
                <span className="font-display text-4xl xl:text-5xl text-terracotta/20 italic leading-none">
                  {point.pullQuote}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Closing statement - Editorial Frame with Nature Image */}
        <footer
          className={`mt-32 lg:mt-40 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          {/* Botanical line art - right side */}
          <svg
            className="absolute bottom-40 right-8 lg:right-16 w-24 h-24 text-sage/15 hidden lg:block"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path d="M50 95 C50 95 50 50 50 30 C50 15 35 5 50 5 C65 5 50 15 50 30" />
            <path d="M50 60 C50 60 30 50 20 55 C10 60 15 45 25 40 C35 35 50 45 50 60" />
            <path d="M50 60 C50 60 70 50 80 55 C90 60 85 45 75 40 C65 35 50 45 50 60" />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image with decorative frame */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* Decorative frame layers */}
                <div className="absolute -inset-6 border border-sage/10 rounded-sm hidden lg:block" />
                <div className="absolute -inset-3 border border-gold/20 rounded-sm" />

                {/* Image container */}
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-xl">
                  {/* Nature path photo */}
                  <Image
                    src="/images/path-nature.png"
                    alt="Chemin sinueux à travers une prairie vallonnée sous un ciel aux tons doux"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />

                  {/* Grain texture */}
                  <div
                    className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Warm overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-forest/10 mix-blend-overlay" />

                  {/* Vignette */}
                  <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(26,46,35,0.2)]" />

                  {/* Corner accents - matching site style */}
                  <div className="absolute top-4 left-4 w-8 h-8">
                    <div className="absolute top-0 left-0 w-full h-px bg-gold/50" />
                    <div className="absolute top-0 left-0 h-full w-px bg-gold/50" />
                  </div>
                  <div className="absolute bottom-4 right-4 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-full h-px bg-gold/50" />
                    <div className="absolute bottom-0 right-0 h-full w-px bg-gold/50" />
                  </div>
                </div>

                {/* Caption label */}
                <div className="absolute -bottom-3 left-8 bg-cream px-4 py-1 shadow-sm">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-sage">
                    Votre chemin
                  </span>
                </div>
              </div>
            </div>

            {/* Quote content - editorial style */}
            <div className="lg:col-span-6 lg:pl-8">
              {/* Decorative line */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-terracotta to-terracotta/0" />
                <span className="text-xs tracking-[0.3em] uppercase text-terracotta/70">
                  Un message pour vous
                </span>
              </div>

              {/* Quote with border accent */}
              <blockquote className="relative pl-8 border-l-2 border-gold">
                <p className="font-accent text-3xl lg:text-4xl xl:text-5xl text-forest italic leading-snug mb-6">
                  Ce n&apos;est pas dans votre tête.
                </p>
                <p className="font-display text-xl lg:text-2xl text-sage tracking-wide">
                  Il existe un autre chemin.
                </p>
              </blockquote>

              {/* Decorative dots */}
              <div className="flex gap-2 mt-10">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                <span className="w-2 h-2 rounded-full bg-terracotta/50" />
                <span className="w-2 h-2 rounded-full bg-terracotta/25" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
