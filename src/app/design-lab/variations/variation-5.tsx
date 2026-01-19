'use client'

/**
 * Variation 5: Bandeau Cinématique avec Pain Points intégrés
 * Une seule image panoramique qui passe du brouillard aux rayons
 * de gauche à droite, style film/cinéma, avec pain points en overlay
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

export default function Variation5() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2ebe1 0%, #efe9dc 100%)' }}
    >
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gold/90 px-4 py-1 rounded-sm z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep">
          V5 — Bandeau Cinématique
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

        {/* Cinematic panoramic image */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="relative">
            {/* Film strip holes decoration - top */}
            <div className="absolute -top-4 left-8 right-8 flex justify-between">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full border border-sage/20" />
              ))}
            </div>

            {/* Film strip holes decoration - bottom */}
            <div className="absolute -bottom-4 left-8 right-8 flex justify-between">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full border border-sage/20" />
              ))}
            </div>

            {/* Outer frame */}
            <div className="absolute -inset-6 border border-forest/10 rounded-sm hidden lg:block" />

            {/* Main panoramic image */}
            <div className="relative aspect-[21/9] rounded-sm overflow-hidden shadow-2xl">
              {/* Base gradient - fog to sun left to right */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(90deg,
                      rgba(170, 175, 165, 0.95) 0%,
                      rgba(180, 185, 175, 0.9) 20%,
                      rgba(200, 200, 190, 0.85) 35%,
                      rgba(220, 215, 200, 0.85) 50%,
                      rgba(235, 230, 210, 0.9) 65%,
                      rgba(245, 240, 225, 0.95) 80%,
                      rgba(250, 248, 235, 0.98) 100%
                    )
                  `
                }}
              />

              {/* Vertical gradient for sky to ground */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(180deg,
                      transparent 0%,
                      transparent 40%,
                      rgba(139, 158, 126, 0.4) 70%,
                      rgba(139, 158, 126, 0.6) 100%
                    )
                  `
                }}
              />

              {/* Fog on left side */}
              <div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{
                  background: `
                    linear-gradient(90deg,
                      rgba(255, 255, 255, 0.4) 0%,
                      rgba(255, 255, 255, 0.3) 40%,
                      transparent 100%
                    )
                  `
                }}
              />

              {/* Sun rays on right side */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="rayGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dcc78e" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#dcc78e" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="rightHalf">
                    <rect x="500" y="0" width="500" height="400" />
                  </clipPath>
                </defs>
                <g clipPath="url(#rightHalf)">
                  <path d="M750 0 L700 400" stroke="url(#rayGrad5)" strokeWidth="50" />
                  <path d="M750 0 L800 400" stroke="url(#rayGrad5)" strokeWidth="45" />
                  <path d="M750 0 L600 400" stroke="url(#rayGrad5)" strokeWidth="35" />
                  <path d="M750 0 L900 400" stroke="url(#rayGrad5)" strokeWidth="40" />
                  <path d="M750 0 L500 400" stroke="url(#rayGrad5)" strokeWidth="25" />
                  <path d="M750 0 L1000 400" stroke="url(#rayGrad5)" strokeWidth="30" />
                </g>
              </svg>

              {/* Sun glow on right */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse at 85% 20%,
                      rgba(255, 252, 235, 0.7) 0%,
                      rgba(220, 199, 142, 0.3) 20%,
                      transparent 45%
                    )
                  `
                }}
              />

              {/* Rolling hills - continuous */}
              <svg className="absolute bottom-0 w-full h-2/5 text-forest" viewBox="0 0 1000 180" preserveAspectRatio="none">
                {/* Back hills - lighter on left, darker on right */}
                <defs>
                  <linearGradient id="hillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M0 180 L0 120 Q100 80 200 100 Q350 60 450 90 Q550 50 650 80 Q800 55 900 85 Q950 70 1000 90 L1000 180 Z" fill="url(#hillGrad)" />
                <path d="M0 180 L0 140 Q150 110 300 130 Q450 100 550 125 Q700 105 850 130 Q950 115 1000 135 L1000 180 Z" fill="url(#hillGrad)" opacity="0.7" />
              </svg>

              {/* Trees scattered - fading visibility left to right */}
              <div className="absolute bottom-1/4 left-[15%] w-8 h-14 opacity-20">
                <div className="w-full h-3/4 bg-forest/60 rounded-t-full" />
                <div className="w-1/4 h-1/4 bg-forest/70 mx-auto" />
              </div>
              <div className="absolute bottom-[30%] left-[25%] w-6 h-10 opacity-25">
                <div className="w-full h-3/4 bg-forest/50 rounded-t-full" />
                <div className="w-1/4 h-1/4 bg-forest/60 mx-auto" />
              </div>
              <div className="absolute bottom-1/4 left-[50%] w-10 h-16 opacity-40">
                <div className="w-full h-3/4 bg-forest/60 rounded-t-full" />
                <div className="w-1/4 h-1/4 bg-forest/70 mx-auto" />
              </div>
              <div className="absolute bottom-[28%] right-[30%] w-8 h-14 opacity-50">
                <div className="w-full h-3/4 bg-forest/70 rounded-t-full" />
                <div className="w-1/4 h-1/4 bg-forest/80 mx-auto" />
              </div>
              <div className="absolute bottom-1/4 right-[15%] w-12 h-20 opacity-55">
                <div className="w-full h-3/4 bg-forest/75 rounded-t-full" />
                <div className="w-1/4 h-1/4 bg-forest/85 mx-auto" />
              </div>

              {/* Grain texture */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(26,46,35,0.12)]" />

              {/* Labels on each side */}
              <div className="absolute bottom-6 left-6 bg-cream/80 backdrop-blur-sm px-4 py-2 rounded-sm">
                <span className="text-[10px] tracking-[0.2em] uppercase text-forest/60 block">Hier</span>
                <span className="font-accent text-sm text-forest/80 italic">Le brouillard</span>
              </div>
              <div className="absolute bottom-6 right-6 bg-gold/90 backdrop-blur-sm px-4 py-2 rounded-sm">
                <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep block">Demain</span>
                <span className="font-accent text-sm text-forest-deep italic">La lumière</span>
              </div>

              {/* Center transition marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8">
                <div className="absolute top-0 left-0 w-full h-px bg-white/20" />
                <div className="absolute top-0 left-0 h-full w-px bg-white/20" />
              </div>
              <div className="absolute top-4 right-4 w-8 h-8">
                <div className="absolute top-0 right-0 w-full h-px bg-gold/40" />
                <div className="absolute top-0 right-0 h-full w-px bg-gold/40" />
              </div>
              <div className="absolute bottom-4 left-4 w-8 h-8">
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/20" />
                <div className="absolute bottom-0 left-0 h-full w-px bg-white/20" />
              </div>
              <div className="absolute bottom-4 right-4 w-8 h-8">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gold/40" />
                <div className="absolute bottom-0 right-0 h-full w-px bg-gold/40" />
              </div>
            </div>

            {/* Caption below */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <span className="font-accent text-sm text-ink-soft/60 italic">Confusion</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-px bg-sage/30" />
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="w-8 h-px bg-gold/30" />
              </div>
              <span className="font-accent text-sm text-forest italic">Clarté</span>
            </div>
          </div>
        </div>

        {/* Pain points - alternating left/right */}
        <div className="max-w-4xl mx-auto space-y-12 mb-20">
          {painPoints.map((point, index) => (
            <article
              key={index}
              className={`flex items-start gap-8 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`flex-shrink-0 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <span className="font-display text-6xl text-forest/10 leading-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className={`flex-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <h3 className="font-display text-2xl lg:text-3xl text-forest mb-3 leading-tight">
                  {point.title}
                </h3>
                <p className="text-ink-soft leading-relaxed text-lg">{point.description}</p>
                <span className={`block mt-3 font-display text-xl text-terracotta/20 italic`}>
                  {point.pullQuote}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Quote */}
        <div className="text-center">
          <blockquote className="relative inline-block">
            <div className="absolute -left-8 top-0 text-6xl text-gold/20 font-display leading-none">&ldquo;</div>
            <p className="font-accent text-3xl lg:text-4xl text-forest italic leading-snug mb-4 px-8">
              Ce n&apos;est pas dans votre tête.
            </p>
            <p className="font-display text-xl text-sage tracking-wide">
              Il existe un autre chemin.
            </p>
            <div className="absolute -right-4 bottom-8 text-6xl text-gold/20 font-display leading-none">&rdquo;</div>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
