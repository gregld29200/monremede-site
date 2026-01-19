'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Variation 1: Image brouillard en haut, pain points, image soleil en bas
 * Structure verticale narrative
 */

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

export default function Variation1() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2ebe1 0%, #efe9dc 100%)' }}
    >
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gold/90 px-4 py-1 rounded-sm z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep">
          V1 — Narrative Verticale
        </span>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8 lg:px-16 py-32">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12 bg-terracotta/30" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-terracotta font-medium">
              Chapitre Premier
            </span>
            <span className="h-px w-12 bg-terracotta/30" />
          </div>
          <h2 className="font-display text-5xl lg:text-7xl text-forest leading-[0.9]">
            Reconnaissez-vous<br />
            <span className="italic text-sage">ces signaux ?</span>
          </h2>
        </header>

        {/* Image brouillard - EN HAUT */}
        <div className="relative max-w-3xl mx-auto mb-20">
          <div className="absolute -inset-4 border border-sage/10 rounded-sm hidden lg:block" />
          <div className="absolute -inset-2 border border-gold/20 rounded-sm" />

          <div className="relative aspect-[21/9] rounded-sm overflow-hidden shadow-xl">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg,
                  rgba(175, 180, 170, 0.95) 0%,
                  rgba(160, 165, 155, 0.9) 50%,
                  rgba(145, 155, 145, 0.95) 100%
                )`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-white/35 to-white/20" />

            {/* Hills silhouette */}
            <svg className="absolute bottom-0 w-full h-1/2 text-forest/15" viewBox="0 0 800 150" preserveAspectRatio="none">
              <path d="M0 150 L0 100 Q150 60 300 80 Q450 40 550 70 Q700 50 800 80 L800 150 Z" fill="currentColor" />
            </svg>

            {/* Tree */}
            <svg className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-16 h-24 text-forest/20" viewBox="0 0 60 100" fill="currentColor">
              <ellipse cx="30" cy="35" rx="25" ry="35" opacity="0.5" />
              <rect x="26" y="65" width="8" height="35" opacity="0.6" />
            </svg>

            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(26,46,35,0.15)]" />

            {/* Label */}
            <div className="absolute bottom-4 left-4 bg-cream/90 px-3 py-1.5 rounded-sm">
              <span className="text-[10px] tracking-[0.2em] uppercase text-forest/70">
                Là où vous êtes
              </span>
            </div>
          </div>
        </div>

        {/* Pain points */}
        <div className="space-y-16 lg:space-y-20 max-w-3xl mx-auto mb-20">
          {painPoints.map((point, index) => (
            <article
              key={index}
              className="grid grid-cols-12 gap-4 items-start"
            >
              <div className="col-span-2 lg:col-span-1">
                <span className="font-display text-5xl lg:text-6xl text-forest/10 leading-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="col-span-10 lg:col-span-8">
                <h3 className="font-display text-2xl lg:text-3xl text-forest mb-3 leading-tight">
                  {point.title}
                </h3>
                <p className="text-ink-soft leading-relaxed text-lg">{point.description}</p>
              </div>
              <div className="hidden lg:block lg:col-span-3 lg:mt-4">
                <span className="font-display text-3xl text-terracotta/20 italic leading-none">
                  {point.pullQuote}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Image soleil - EN BAS */}
        <div className="relative max-w-3xl mx-auto mb-16">
          <div className="absolute -inset-4 border border-sage/10 rounded-sm hidden lg:block" />
          <div className="absolute -inset-2 border border-gold/30 rounded-sm" />

          <div className="relative aspect-[21/9] rounded-sm overflow-hidden shadow-xl">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg,
                  rgba(250, 245, 230, 0.95) 0%,
                  rgba(220, 215, 195, 0.9) 40%,
                  rgba(170, 185, 160, 0.95) 100%
                )`
              }}
            />

            {/* Sun glow */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 20%,
                  rgba(255, 250, 230, 0.7) 0%,
                  rgba(220, 199, 142, 0.3) 30%,
                  transparent 60%
                )`
              }}
            />

            {/* Rays */}
            <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="rayV1" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#dcc78e" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#dcc78e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M400 0 L370 200" stroke="url(#rayV1)" strokeWidth="30" />
              <path d="M400 0 L430 200" stroke="url(#rayV1)" strokeWidth="25" />
              <path d="M400 0 L300 200" stroke="url(#rayV1)" strokeWidth="20" />
              <path d="M400 0 L500 200" stroke="url(#rayV1)" strokeWidth="22" />
            </svg>

            {/* Hills */}
            <svg className="absolute bottom-0 w-full h-1/2 text-forest/35" viewBox="0 0 800 150" preserveAspectRatio="none">
              <path d="M0 150 L0 100 Q150 60 300 80 Q450 40 550 70 Q700 50 800 80 L800 150 Z" fill="currentColor" />
            </svg>

            {/* Tree - illuminated */}
            <svg className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-16 h-24 text-forest/45" viewBox="0 0 60 100" fill="currentColor">
              <ellipse cx="30" cy="35" rx="25" ry="35" opacity="0.6" />
              <rect x="26" y="65" width="8" height="35" opacity="0.7" />
            </svg>

            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(26,46,35,0.1)]" />

            {/* Label */}
            <div className="absolute bottom-4 right-4 bg-gold/90 px-3 py-1.5 rounded-sm">
              <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep">
                Là où vous allez
              </span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center">
          <blockquote className="relative inline-block">
            <p className="font-accent text-3xl lg:text-4xl text-forest italic leading-snug mb-4">
              Ce n&apos;est pas dans votre tête.
            </p>
            <p className="font-display text-xl text-sage tracking-wide">
              Il existe un autre chemin.
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
