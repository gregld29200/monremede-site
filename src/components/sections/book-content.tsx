'use client'

const contentCards = {
  left: [
    {
      number: '01',
      pages: 'Pages 12-35',
      title: 'Votre système digestif',
      description: 'Comment il fonctionne réellement et pourquoi il vous fait souffrir.',
    },
    {
      number: '02',
      pages: 'Pages 45-78',
      title: 'Les 30 aliments qui soignent',
      description: 'vs ceux qui vous épuisent. Listes détaillées et explications.',
    },
    {
      number: '03',
      pages: 'Pages 89-102',
      title: 'Le protocole de jeûne',
      description: 'Adapté à chaque saison pour maximiser les bienfaits.',
    },
  ],
  right: [
    {
      number: '04',
      pages: 'Pages 110-125',
      title: 'Questionnaires d\'auto-évaluation',
      description: '5 tests pour identifier vos carences et déséquilibres.',
    },
    {
      number: '05',
      pages: 'Pages 130-180',
      title: 'Recettes et menus types',
      description: 'Pour chaque situation : fatigue, digestion, stress...',
    },
    {
      number: '06',
      pages: '+ Bonus',
      title: 'Conseils pratiques au quotidien',
      description: 'Pour maintenir votre vitalité toute l\'année.',
    },
  ],
}

function ContentCard({ number, pages, title, description }: { number: string; pages: string; title: string; description: string }) {
  return (
    <div className="content-card group bg-cream/5 backdrop-blur-sm border border-cream/10 p-8 lg:p-9 relative transition-all duration-400 hover:bg-cream/10 hover:border-gold/30 hover:translate-x-2">
      {/* Gold bar on hover */}
      <div className="absolute top-0 left-0 w-[3px] h-0 bg-gold transition-all duration-400 group-hover:h-full" />

      <div className="flex items-center gap-3 mb-4">
        <div className="font-display text-4xl text-gold/40 leading-none">
          {number}
        </div>
        <span className="text-xs tracking-wider uppercase text-gold/70 bg-gold/10 px-2 py-1 rounded-sm">
          {pages}
        </span>
      </div>
      <h3 className="font-serif text-lg font-medium text-cream mb-3">
        {title}
      </h3>
      <p className="text-sm text-cream/60 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export function BookContentSection() {
  return (
    <section id="decouvrir" className="content-section py-20 lg:py-40 bg-forest-deep relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute -top-1/2 -right-1/5 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(139,158,126,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="content-header text-center px-6 lg:px-20 mb-16 lg:mb-20 relative z-10">
        <p className="label text-gold mb-6">Ce que vous allez apprendre</p>
        <h2 className="display-large text-cream mb-5">
          Dans ce livre, vous découvrirez :
        </h2>
        <p className="font-serif text-xl italic text-sage-light">
          260+ pages de conseils concrets et applicables
        </p>
      </div>

      {/* Content Spread */}
      <div className="content-spread grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 px-6 lg:px-20 relative z-10">
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:pt-24">
          {contentCards.left.map((card) => (
            <ContentCard key={card.number} {...card} />
          ))}
        </div>

        {/* Center - Book Preview */}
        <div className="relative py-10 flex items-center justify-center order-first lg:order-none">
          <div
            className="book-3d w-64 lg:w-72 h-[360px] lg:h-[400px] relative transition-transform duration-600"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'perspective(1500px) rotateY(-25deg) rotateX(5deg)',
            }}
          >
            <div className="book-cover w-full h-full bg-gradient-to-br from-forest to-forest-deep rounded-r-xl shadow-2xl flex flex-col justify-between p-10 lg:p-12 text-center relative overflow-hidden">
              {/* Spine shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/40 to-transparent" />

              <div>
                <div className="w-12 h-0.5 bg-gold mx-auto mb-5" />
                <h4 className="font-display text-2xl text-cream leading-tight mb-2">
                  La Santé dans l&apos;assiette
                </h4>
                <p className="font-serif text-sm italic text-sage-light">
                  260+ pages
                </p>
              </div>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold">
                Oum Soumayya
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:pt-16">
          {contentCards.right.map((card) => (
            <ContentCard key={card.number} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
