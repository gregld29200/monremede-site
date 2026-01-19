'use client'

import Image from 'next/image'

/**
 * V5 - Luxury Magazine Grid
 * Gold lines, refined spacing
 * Premium editorial aesthetic
 */

const chapters = [
  { num: '01', title: 'Votre système digestif', pages: 'Pages 12-35' },
  { num: '02', title: 'Les 30 aliments qui soignent', pages: 'Pages 45-78' },
  { num: '03', title: 'Le protocole de jeûne', pages: 'Pages 89-102' },
  { num: '04', title: "Questionnaires d'auto-évaluation", pages: 'Pages 110-125' },
  { num: '05', title: 'Recettes et menus types', pages: 'Pages 130-180' },
  { num: '06', title: 'Conseils pratiques', pages: 'Bonus' },
]

export default function BookV5() {
  return (
    <section className="min-h-screen bg-forest-deep relative overflow-hidden">
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gold px-4 py-1 rounded-sm z-20">
        <span className="text-[10px] tracking-[0.2em] uppercase text-forest-deep font-medium">
          V5 — Luxury Magazine
        </span>
      </div>

      {/* Gold grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-px h-full bg-gold/10" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-gold/10" />
        <div className="absolute top-0 right-[10%] w-px h-full bg-gold/10" />
        <div className="absolute top-[20%] left-0 w-full h-px bg-gold/10" />
        <div className="absolute bottom-[20%] left-0 w-full h-px bg-gold/10" />
      </div>

      <div className="relative z-10 py-24 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered with gold accents */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-6 mb-8">
              <div className="w-20 h-px bg-gold" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold">
                Sommaire
              </span>
              <div className="w-20 h-px bg-gold" />
            </div>
            <h2 className="font-display text-6xl lg:text-8xl text-cream leading-[0.85]">
              Dans ce livre
            </h2>
            <h2 className="font-display text-4xl lg:text-5xl text-gold italic mt-4">
              vous découvrirez
            </h2>
          </div>

          {/* Main Layout - Asymmetric grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left - Stacked Book Images */}
            <div className="col-span-12 lg:col-span-5 relative">
              <div className="sticky top-24">
                {/* Background frame */}
                <div className="absolute -inset-4 border border-gold/30" />
                <div className="absolute -inset-8 border border-gold/10" />

                {/* Book images stacked */}
                <div className="relative">
                  <Image
                    src="/images/book-mockup.png"
                    alt="La Santé dans l'assiette - Vue dessus"
                    width={400}
                    height={300}
                    className="w-full rounded-sm shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -right-6 w-48">
                    <Image
                      src="/images/book-mockup-hero.png"
                      alt="La Santé dans l'assiette - Vue 3D"
                      width={200}
                      height={250}
                      className="rounded-sm shadow-xl border-4 border-forest-deep"
                    />
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-12 pt-6 border-t border-gold/30">
                  <p className="font-accent text-lg text-sage-light italic">
                    &ldquo;260+ pages de transformation&rdquo;
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mt-2">
                    Par Oum Soumayya • Naturopathe depuis 2009
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Chapters Grid */}
            <div className="col-span-12 lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gold/20">
                {chapters.map((ch) => (
                  <div
                    key={ch.num}
                    className="bg-forest-deep p-8 group hover:bg-forest transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="font-display text-5xl text-gold/20 group-hover:text-gold/40 transition-colors">
                        {ch.num}
                      </span>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gold/50 bg-gold/10 px-2 py-1">
                        {ch.pages}
                      </span>
                    </div>
                    <h3 className="font-display text-xl text-cream group-hover:text-gold transition-colors leading-tight">
                      {ch.title}
                    </h3>
                    <div className="w-8 h-px bg-terracotta mt-4 group-hover:w-16 transition-all" />
                  </div>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="grid grid-cols-3 gap-px bg-gold/20 mt-px">
                <div className="bg-terracotta p-6 text-center">
                  <span className="font-display text-3xl text-cream">260+</span>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-cream/70 mt-1">Pages</p>
                </div>
                <div className="bg-gold p-6 text-center">
                  <span className="font-display text-3xl text-forest-deep">30</span>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-forest-deep/70 mt-1">Aliments</p>
                </div>
                <div className="bg-sage p-6 text-center">
                  <span className="font-display text-3xl text-forest-deep">5</span>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-forest-deep/70 mt-1">Tests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
