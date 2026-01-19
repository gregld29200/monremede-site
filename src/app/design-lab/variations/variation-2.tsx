'use client'

/**
 * Variation 2: Image brouillard latérale fixe à gauche pendant scroll des pain points
 * Pain points à droite, puis image soleil à la fin
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

export default function Variation2() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2ebe1 0%, #efe9dc 100%)' }}
    >
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gold/90 px-4 py-1 rounded-sm z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep">
          V2 — Image Latérale + Texte
        </span>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8 lg:px-16 py-32">
        {/* Header */}
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] tracking-[0.4em] uppercase text-terracotta font-medium">
              Chapitre Premier
            </span>
            <span className="h-px flex-1 bg-terracotta/20 max-w-[100px]" />
          </div>
          <h2 className="font-display text-5xl lg:text-7xl xl:text-8xl text-forest leading-[0.85]">
            Reconnaissez<span className="italic text-sage">-vous</span><br />
            ces signaux<span className="text-terracotta">?</span>
          </h2>
        </header>

        {/* Main grid: Image left, Pain points right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Fog image */}
          <div className="lg:sticky lg:top-32">
            <div className="relative">
              <div className="absolute -inset-5 border border-sage/10 rounded-sm hidden lg:block" />
              <div className="absolute -inset-2 border border-gold/20 rounded-sm" />

              <div className="relative aspect-[3/4] rounded-sm overflow-hidden shadow-xl">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg,
                      rgba(180, 185, 175, 0.95) 0%,
                      rgba(165, 170, 160, 0.9) 40%,
                      rgba(150, 160, 150, 0.95) 100%
                    )`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-white/30 to-white/20" />

                {/* Hills */}
                <svg className="absolute bottom-0 w-full h-2/5 text-forest/15" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path d="M0 200 L0 140 Q80 100 150 120 Q250 70 300 100 Q380 80 400 110 L400 200 Z" fill="currentColor" />
                  <path d="M0 200 L0 160 Q100 130 200 150 Q300 125 400 145 L400 200 Z" fill="currentColor" opacity="0.5" />
                </svg>

                {/* Tree */}
                <svg className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-14 h-24 text-forest/20" viewBox="0 0 60 100" fill="currentColor">
                  <ellipse cx="30" cy="35" rx="25" ry="35" opacity="0.5" />
                  <rect x="26" y="65" width="8" height="35" opacity="0.6" />
                </svg>

                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(26,46,35,0.15)]" />

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-px bg-white/25" />
                  <div className="absolute top-0 left-0 h-full w-px bg-white/25" />
                </div>
                <div className="absolute bottom-4 right-4 w-8 h-8">
                  <div className="absolute bottom-0 right-0 w-full h-px bg-white/25" />
                  <div className="absolute bottom-0 right-0 h-full w-px bg-white/25" />
                </div>
              </div>

              <div className="absolute -bottom-3 left-6 bg-cream px-3 py-1 shadow-sm">
                <span className="text-[9px] tracking-[0.2em] uppercase text-sage">
                  Dans le brouillard
                </span>
              </div>
            </div>
          </div>

          {/* Right: Pain points */}
          <div className="space-y-16">
            {painPoints.map((point, index) => (
              <article key={index} className="relative pl-16">
                <span className="absolute left-0 top-0 font-display text-5xl text-forest/10 leading-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl lg:text-3xl text-forest mb-3 leading-tight">
                  {point.title}
                </h3>
                <p className="text-ink-soft leading-relaxed text-lg mb-2">{point.description}</p>
                <span className="font-display text-2xl text-terracotta/15 italic">
                  {point.pullQuote}
                </span>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom section: Sun image + Quote */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Quote */}
          <div className="order-2 lg:order-1">
            <div className="relative pl-8 border-l-2 border-gold">
              <p className="font-accent text-3xl lg:text-4xl text-forest italic leading-snug mb-4">
                Ce n&apos;est pas dans votre tête.
              </p>
              <p className="font-display text-xl text-sage tracking-wide">
                Il existe un autre chemin.
              </p>
            </div>
            <div className="flex gap-2 mt-8">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span className="w-2 h-2 rounded-full bg-terracotta/50" />
              <span className="w-2 h-2 rounded-full bg-terracotta/25" />
            </div>
          </div>

          {/* Sun image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-5 border border-sage/10 rounded-sm hidden lg:block" />
              <div className="absolute -inset-2 border border-gold/30 rounded-sm" />

              <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-xl">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg,
                      rgba(250, 245, 230, 0.95) 0%,
                      rgba(225, 220, 200, 0.9) 40%,
                      rgba(170, 185, 160, 0.95) 100%
                    )`
                  }}
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at 50% 15%,
                      rgba(255, 250, 230, 0.8) 0%,
                      rgba(220, 199, 142, 0.4) 30%,
                      transparent 55%
                    )`
                  }}
                />

                {/* Rays */}
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300">
                  <defs>
                    <linearGradient id="rayV2" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#dcc78e" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#dcc78e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M200 0 L180 300" stroke="url(#rayV2)" strokeWidth="30" />
                  <path d="M200 0 L220 300" stroke="url(#rayV2)" strokeWidth="25" />
                  <path d="M200 0 L130 300" stroke="url(#rayV2)" strokeWidth="18" />
                  <path d="M200 0 L270 300" stroke="url(#rayV2)" strokeWidth="20" />
                </svg>

                {/* Hills */}
                <svg className="absolute bottom-0 w-full h-2/5 text-forest/35" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path d="M0 200 L0 140 Q80 100 150 120 Q250 70 300 100 Q380 80 400 110 L400 200 Z" fill="currentColor" />
                </svg>

                {/* Tree */}
                <svg className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-14 h-20 text-forest/45" viewBox="0 0 60 100" fill="currentColor">
                  <ellipse cx="30" cy="35" rx="25" ry="35" opacity="0.65" />
                  <rect x="26" y="65" width="8" height="35" opacity="0.7" />
                </svg>

                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(26,46,35,0.08)]" />

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-px bg-gold/50" />
                  <div className="absolute top-0 left-0 h-full w-px bg-gold/50" />
                </div>
                <div className="absolute bottom-4 right-4 w-8 h-8">
                  <div className="absolute bottom-0 right-0 w-full h-px bg-gold/50" />
                  <div className="absolute bottom-0 right-0 h-full w-px bg-gold/50" />
                </div>
              </div>

              <div className="absolute -bottom-3 right-6 bg-gold/90 px-3 py-1 shadow-sm">
                <span className="text-[9px] tracking-[0.2em] uppercase text-forest-deep">
                  Vers la clarté
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
