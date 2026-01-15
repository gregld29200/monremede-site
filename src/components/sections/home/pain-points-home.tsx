'use client'

import { useEffect, useRef, useState } from 'react'

const painPoints = [
  {
    number: '01',
    title: 'La fatigue qui ne part pas',
    description:
      'Vous dormez, mais vous vous réveillez épuisé(e). Le café ne suffit plus. Votre énergie d\'avant vous manque.',
    accent: 'blush',
  },
  {
    number: '02',
    title: 'Une digestion devenue un combat',
    description:
      'Ballonnements, acidités, lourdeurs après chaque repas… Manger est devenu une source de stress plutôt que de plaisir.',
    accent: 'sage',
  },
  {
    number: '03',
    title: 'Des réponses médicales qui ne vous satisfont pas',
    description:
      'On vous dit que "tout va bien" ou on vous prescrit encore un médicament. Mais au fond, vous sentez que quelque chose ne va pas.',
    accent: 'gold',
  },
  {
    number: '04',
    title: 'L\'impression de tourner en rond',
    description:
      'Vous avez essayé des régimes, des compléments, des conseils trouvés ici et là. Rien ne tient sur la durée.',
    accent: 'forest',
  },
]

export function PainPointsHome() {
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
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-cream" />

      {/* Decorative large typography in background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none hidden xl:block">
        <span
          className="font-display text-[20rem] leading-none text-forest/[0.02] tracking-tighter"
          style={{ writingMode: 'vertical-rl' }}
        >
          SIGNAUX
        </span>
      </div>

      {/* Organic shape decoration */}
      <div
        className="absolute top-20 right-0 w-96 h-96 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--blush-deep) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        {/* Section header - asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 lg:mb-28">
          <div className="lg:col-span-5">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs tracking-[0.3em] uppercase text-sage font-medium">
                  Reconnaissez-vous ces signaux ?
                </span>
              </span>
              <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-forest leading-[0.95]">
                Vous vous
                <br />
                <span className="italic text-sage">reconnaissez ?</span>
              </h2>
            </div>
          </div>

          {/* Decorative element */}
          <div className="hidden lg:flex lg:col-span-2 items-end justify-center">
            <svg
              className={`w-24 h-32 text-sage/30 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              viewBox="0 0 60 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
            >
              <path d="M30 80 L30 40" />
              <path d="M30 40 Q30 20 15 10" />
              <path d="M30 40 Q30 20 45 10" />
              <ellipse cx="15" cy="8" rx="6" ry="4" fill="currentColor" opacity="0.2" />
              <ellipse cx="45" cy="8" rx="6" ry="4" fill="currentColor" opacity="0.2" />
              <ellipse cx="30" cy="55" rx="4" ry="3" fill="currentColor" opacity="0.15" />
              <ellipse cx="25" cy="65" rx="3" ry="2" fill="currentColor" opacity="0.1" />
            </svg>
          </div>
        </div>

        {/* Pain points - staggered grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-16 lg:gap-y-20">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${200 + index * 150}ms`,
                marginTop: index % 2 === 1 ? '4rem' : '0',
              }}
            >
              {/* Large number background */}
              <span className="absolute -top-8 -left-4 font-display text-8xl lg:text-9xl text-forest/[0.04] leading-none pointer-events-none select-none">
                {point.number}
              </span>

              {/* Content */}
              <div className="relative">
                {/* Accent bar */}
                <div
                  className={`absolute -left-6 top-0 w-1 h-full rounded-full transition-all duration-500 group-hover:h-full ${
                    point.accent === 'blush'
                      ? 'bg-blush-deep'
                      : point.accent === 'sage'
                        ? 'bg-sage'
                        : point.accent === 'gold'
                          ? 'bg-gold'
                          : 'bg-forest'
                  }`}
                  style={{ height: '60%' }}
                />

                <span className="inline-block text-xs tracking-[0.2em] uppercase text-sage/60 mb-4">
                  {point.number}
                </span>

                <h3 className="font-display text-2xl lg:text-3xl text-forest mb-4 leading-tight">
                  {point.title}
                </h3>

                <p className="text-ink-soft leading-relaxed text-lg">{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Transition phrase - dramatic treatment */}
        <div
          className={`mt-28 lg:mt-36 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Decorative lines */}
            <div className="absolute left-0 top-1/2 w-24 h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent hidden lg:block" />
            <div className="absolute right-0 top-1/2 w-24 h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent hidden lg:block" />

            <blockquote className="relative">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-display text-6xl text-gold/20">
                &quot;
              </span>
              <p className="font-accent text-2xl lg:text-3xl xl:text-4xl text-forest leading-relaxed italic">
                Ce n&apos;est pas dans votre tête.
                <br />
                <span className="text-sage">Votre corps vous envoie des signaux</span> —
              </p>
              <p className="font-display text-xl lg:text-2xl text-forest mt-4 not-italic">
                et il existe un autre chemin.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
