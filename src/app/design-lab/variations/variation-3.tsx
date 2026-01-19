'use client'

import { useState, useEffect } from 'react'

/**
 * Variation 3: Animation Automatique Brouillard → Soleil
 * Transition douce et continue entre les deux états
 * Pain points en dessous avec effet visuel synchronisé
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

export default function Variation3() {
  const [isRevealed, setIsRevealed] = useState(false)

  // Animation automatique avec cycle de 6 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRevealed((prev) => !prev)
    }, 6000) // Alterne toutes les 6 secondes

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2ebe1 0%, #efe9dc 100%)' }}
    >
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gold/90 px-4 py-1 rounded-sm z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep">
          V3 — Animation Automatique
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

        {/* Interactive image - centered */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative">
            {/* Decorative frames */}
            <div className="absolute -inset-6 border border-sage/10 rounded-sm hidden lg:block" />
            <div className="absolute -inset-3 border border-gold/20 rounded-sm" />

            {/* Animated image */}
            <div className="relative aspect-[16/9] rounded-sm overflow-hidden shadow-xl">
              {/* Base layer - Fog (always visible, fades out on reveal) */}
              <div
                className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
                  isRevealed ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  background: `
                    linear-gradient(180deg,
                      rgba(175, 180, 172, 0.95) 0%,
                      rgba(160, 165, 155, 0.9) 30%,
                      rgba(145, 150, 140, 0.85) 60%,
                      rgba(130, 140, 130, 0.9) 100%
                    )
                  `
                }}
              >
                {/* Fog overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-white/40 to-white/20" />

                {/* Landscape hint */}
                <svg className="absolute bottom-0 w-full h-2/5 text-forest/15" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <path d="M0 200 L0 120 Q150 80 300 100 Q450 60 500 90 Q650 70 800 100 L800 200 Z" fill="currentColor" />
                </svg>

                {/* Tree */}
                <svg className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-20 h-32 text-forest/20" viewBox="0 0 80 130" fill="currentColor">
                  <ellipse cx="40" cy="45" rx="35" ry="45" opacity="0.6" />
                  <rect x="35" y="85" width="10" height="45" opacity="0.7" />
                </svg>
              </div>

              {/* Revealed layer - Sun rays (fades in on reveal) */}
              <div
                className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
                  isRevealed ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `
                    linear-gradient(180deg,
                      rgba(250, 245, 230, 0.95) 0%,
                      rgba(220, 210, 180, 0.85) 30%,
                      rgba(180, 195, 165, 0.9) 60%,
                      rgba(139, 158, 126, 0.95) 100%
                    )
                  `
                }}
              >
                {/* Sun glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse at 50% 10%,
                        rgba(255, 250, 220, 0.8) 0%,
                        rgba(220, 199, 142, 0.4) 30%,
                        transparent 60%
                      )
                    `
                  }}
                />

                {/* Ray beams */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="rayGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#dcc78e" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#dcc78e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M400 0 L350 450" stroke="url(#rayGrad3)" strokeWidth="50" />
                  <path d="M400 0 L450 450" stroke="url(#rayGrad3)" strokeWidth="45" />
                  <path d="M400 0 L250 450" stroke="url(#rayGrad3)" strokeWidth="30" />
                  <path d="M400 0 L550 450" stroke="url(#rayGrad3)" strokeWidth="35" />
                  <path d="M400 0 L150 450" stroke="url(#rayGrad3)" strokeWidth="20" />
                  <path d="M400 0 L650 450" stroke="url(#rayGrad3)" strokeWidth="25" />
                </svg>

                {/* Landscape - clearer */}
                <svg className="absolute bottom-0 w-full h-2/5 text-forest/40" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <path d="M0 200 L0 120 Q150 80 300 100 Q450 60 500 90 Q650 70 800 100 L800 200 Z" fill="currentColor" />
                </svg>

                {/* Tree - illuminated */}
                <svg className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-20 h-32 text-forest/50" viewBox="0 0 80 130" fill="currentColor">
                  <ellipse cx="40" cy="45" rx="35" ry="45" opacity="0.7" />
                  <rect x="35" y="85" width="10" height="45" opacity="0.8" />
                </svg>
              </div>

              {/* Grain texture */}
              <div
                className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(26,46,35,0.15)]" />

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8">
                <div className={`absolute top-0 left-0 w-full h-px transition-colors duration-[2000ms] ease-in-out ${isRevealed ? 'bg-gold/60' : 'bg-white/30'}`} />
                <div className={`absolute top-0 left-0 h-full w-px transition-colors duration-[2000ms] ease-in-out ${isRevealed ? 'bg-gold/60' : 'bg-white/30'}`} />
              </div>
              <div className="absolute bottom-4 right-4 w-8 h-8">
                <div className={`absolute bottom-0 right-0 w-full h-px transition-colors duration-[2000ms] ease-in-out ${isRevealed ? 'bg-gold/60' : 'bg-white/30'}`} />
                <div className={`absolute bottom-0 right-0 h-full w-px transition-colors duration-[2000ms] ease-in-out ${isRevealed ? 'bg-gold/60' : 'bg-white/30'}`} />
              </div>

              {/* State indicator */}
              <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-sm transition-all duration-[2000ms] ease-in-out ${
                isRevealed ? 'bg-gold/90 text-forest-deep' : 'bg-cream/80 text-forest'
              }`}>
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
                  {isRevealed ? 'Vers la clarté' : 'Dans le brouillard'}
                </span>
              </div>
            </div>

            {/* Caption with animated dots */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`w-2 h-2 rounded-full transition-all duration-[2000ms] ${!isRevealed ? 'bg-sage scale-100' : 'bg-sage/30 scale-75'}`} />
              <span className="font-accent text-sm text-ink-soft italic">
                Du brouillard à la lumière
              </span>
              <span className={`w-2 h-2 rounded-full transition-all duration-[2000ms] ${isRevealed ? 'bg-gold scale-100' : 'bg-gold/30 scale-75'}`} />
            </div>
          </div>
        </div>

        {/* Pain points grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-20">
          {painPoints.map((point, index) => (
            <article
              key={index}
              className={`relative p-8 rounded-sm transition-all duration-[2000ms] ease-in-out ${
                isRevealed
                  ? 'bg-gradient-to-br from-gold/5 to-transparent border border-gold/20'
                  : 'bg-gradient-to-br from-sage/5 to-transparent border border-sage/15'
              }`}
            >
              <span className={`absolute -top-4 -left-2 font-display text-6xl leading-none transition-colors duration-[2000ms] ease-in-out ${
                isRevealed ? 'text-gold/20' : 'text-forest/10'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl text-forest mb-3 leading-tight mt-4">
                {point.title}
              </h3>
              <p className="text-ink-soft leading-relaxed">{point.description}</p>
              <span className={`block mt-4 font-display text-xl italic transition-colors duration-[2000ms] ease-in-out ${
                isRevealed ? 'text-gold/30' : 'text-terracotta/20'
              }`}>
                {point.pullQuote}
              </span>
            </article>
          ))}
        </div>

        {/* Quote */}
        <div className="text-center">
          <blockquote className="relative inline-block">
            <p className="font-accent text-3xl lg:text-4xl text-forest italic leading-snug mb-4">
              Ce n&apos;est pas dans votre tête.
            </p>
            <p className={`font-display text-xl tracking-wide transition-colors duration-[2000ms] ease-in-out ${
              isRevealed ? 'text-gold' : 'text-sage'
            }`}>
              Il existe un autre chemin.
            </p>
          </blockquote>

          {/* Animated progress indicator */}
          <div className="flex justify-center gap-2 mt-8">
            <span className={`h-1 rounded-full transition-all duration-[2000ms] ease-in-out ${!isRevealed ? 'w-8 bg-sage' : 'w-2 bg-sage/30'}`} />
            <span className={`h-1 rounded-full transition-all duration-[2000ms] ease-in-out ${isRevealed ? 'w-8 bg-gold' : 'w-2 bg-gold/30'}`} />
          </div>
        </div>
      </div>
    </section>
  )
}
