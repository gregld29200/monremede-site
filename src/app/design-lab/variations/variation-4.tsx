'use client'

/**
 * Variation 4: Cartes Galerie + Pain Points Centrés
 * Deux cartes d'images côte à côte avec pain points en dessous
 * Style exposition / galerie photo
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

export default function Variation4() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2ebe1 0%, #efe9dc 100%)' }}
    >
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gold/90 px-4 py-1 rounded-sm z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep">
          V4 — Galerie Dyptique
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

        {/* Diptych images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-20">
          {/* Card 1 - Fog */}
          <div className="relative">
            {/* Decorative frames */}
            <div className="absolute -inset-5 border border-sage/10 rounded-sm hidden lg:block" />
            <div className="absolute -inset-2 border border-gold/20 rounded-sm" />

            {/* Image */}
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-xl">
              {/* Foggy gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(180deg,
                      rgba(180, 185, 175, 0.95) 0%,
                      rgba(165, 170, 160, 0.9) 30%,
                      rgba(150, 155, 145, 0.85) 60%,
                      rgba(135, 145, 135, 0.9) 100%
                    )
                  `
                }}
              />

              {/* Fog overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-white/35 to-white/25" />

              {/* Hills silhouette */}
              <svg className="absolute bottom-0 w-full h-1/2 text-forest/15" viewBox="0 0 400 250" preserveAspectRatio="none">
                <path d="M0 250 L0 180 Q50 140 100 160 Q180 100 200 130 Q280 90 320 120 Q380 100 400 140 L400 250 Z" fill="currentColor" />
                <path d="M0 250 L0 200 Q80 170 150 190 Q220 160 280 180 Q350 165 400 190 L400 250 Z" fill="currentColor" opacity="0.5" />
              </svg>

              {/* Lone tree */}
              <svg className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-12 h-20 text-forest/20" viewBox="0 0 50 90" fill="currentColor">
                <ellipse cx="25" cy="30" rx="22" ry="30" opacity="0.5" />
                <rect x="22" y="55" width="6" height="35" opacity="0.6" />
              </svg>

              {/* Grain */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(26,46,35,0.12)]" />

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-6 h-6">
                <div className="absolute top-0 left-0 w-full h-px bg-white/25" />
                <div className="absolute top-0 left-0 h-full w-px bg-white/25" />
              </div>
              <div className="absolute bottom-4 right-4 w-6 h-6">
                <div className="absolute bottom-0 right-0 w-full h-px bg-white/25" />
                <div className="absolute bottom-0 right-0 h-full w-px bg-white/25" />
              </div>
            </div>

            {/* Caption label */}
            <div className="absolute -bottom-3 left-6 bg-cream px-3 py-1 shadow-sm">
              <span className="text-[9px] tracking-[0.2em] uppercase text-sage">
                Avant
              </span>
            </div>

            {/* Title below */}
            <div className="mt-8 text-center">
              <span className="font-display text-2xl text-forest/60">Dans le brouillard</span>
              <p className="font-accent text-sm text-ink-soft italic mt-2">
                Quand le corps envoie des signaux<br />que personne n&apos;entend
              </p>
            </div>
          </div>

          {/* Card 2 - Sun */}
          <div className="relative">
            {/* Decorative frames */}
            <div className="absolute -inset-5 border border-sage/10 rounded-sm hidden lg:block" />
            <div className="absolute -inset-2 border border-gold/30 rounded-sm" />

            {/* Image */}
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-xl">
              {/* Sunny gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(180deg,
                      rgba(250, 245, 230, 0.95) 0%,
                      rgba(230, 225, 200, 0.9) 20%,
                      rgba(190, 200, 175, 0.85) 50%,
                      rgba(139, 158, 126, 0.95) 100%
                    )
                  `
                }}
              />

              {/* Sun glow */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse at 50% 15%,
                      rgba(255, 252, 235, 0.8) 0%,
                      rgba(220, 199, 142, 0.4) 30%,
                      transparent 55%
                    )
                  `
                }}
              />

              {/* Sun rays */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="rayGrad4" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#dcc78e" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#dcc78e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M200 0 L170 500" stroke="url(#rayGrad4)" strokeWidth="40" />
                <path d="M200 0 L230 500" stroke="url(#rayGrad4)" strokeWidth="35" />
                <path d="M200 0 L100 500" stroke="url(#rayGrad4)" strokeWidth="25" />
                <path d="M200 0 L300 500" stroke="url(#rayGrad4)" strokeWidth="28" />
                <path d="M200 0 L50 500" stroke="url(#rayGrad4)" strokeWidth="15" />
                <path d="M200 0 L350 500" stroke="url(#rayGrad4)" strokeWidth="18" />
              </svg>

              {/* Hills silhouette - clearer */}
              <svg className="absolute bottom-0 w-full h-1/2 text-forest/35" viewBox="0 0 400 250" preserveAspectRatio="none">
                <path d="M0 250 L0 180 Q50 140 100 160 Q180 100 200 130 Q280 90 320 120 Q380 100 400 140 L400 250 Z" fill="currentColor" />
                <path d="M0 250 L0 200 Q80 170 150 190 Q220 160 280 180 Q350 165 400 190 L400 250 Z" fill="currentColor" opacity="0.6" />
              </svg>

              {/* Lone tree - illuminated */}
              <svg className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-12 h-20 text-forest/45" viewBox="0 0 50 90" fill="currentColor">
                <ellipse cx="25" cy="30" rx="22" ry="30" opacity="0.7" />
                <rect x="22" y="55" width="6" height="35" opacity="0.8" />
              </svg>

              {/* Grain */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Vignette - lighter */}
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(26,46,35,0.08)]" />

              {/* Corner accents - gold */}
              <div className="absolute top-4 left-4 w-6 h-6">
                <div className="absolute top-0 left-0 w-full h-px bg-gold/50" />
                <div className="absolute top-0 left-0 h-full w-px bg-gold/50" />
              </div>
              <div className="absolute bottom-4 right-4 w-6 h-6">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gold/50" />
                <div className="absolute bottom-0 right-0 h-full w-px bg-gold/50" />
              </div>
            </div>

            {/* Caption label */}
            <div className="absolute -bottom-3 right-6 bg-gold/90 px-3 py-1 shadow-sm">
              <span className="text-[9px] tracking-[0.2em] uppercase text-forest-deep">
                Après
              </span>
            </div>

            {/* Title below */}
            <div className="mt-8 text-center">
              <span className="font-display text-2xl text-forest">La clarté retrouvée</span>
              <p className="font-accent text-sm text-ink-soft italic mt-2">
                Quand on comprend enfin<br />et qu&apos;on reprend le contrôle
              </p>
            </div>
          </div>
        </div>

        {/* Connecting element */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-sage/30 to-transparent" />
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-sage/30 to-transparent" />
        </div>

        {/* Pain points - horizontal list */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((point, index) => (
              <article key={index} className="relative text-center">
                <span className="font-display text-4xl text-forest/10 leading-none block mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-xl text-forest mb-3 leading-tight">
                  {point.title}
                </h3>
                <p className="text-ink-soft text-sm leading-relaxed">{point.description}</p>
                <span className="block mt-4 font-display text-lg text-terracotta/20 italic">
                  {point.pullQuote}
                </span>
              </article>
            ))}
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
          <div className="flex justify-center gap-2 mt-8">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="w-2 h-2 rounded-full bg-terracotta/50" />
            <span className="w-2 h-2 rounded-full bg-terracotta/25" />
          </div>
        </div>
      </div>
    </section>
  )
}
