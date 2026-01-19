'use client'

import Image from 'next/image'

/**
 * V3 - Horizontal Scroll Timeline
 * Book images with horizontal scrolling chapters
 * Bold terracotta and gold accents
 */

const chapters = [
  { num: '01', title: 'Votre système digestif', pages: '12-35', icon: '🫀' },
  { num: '02', title: 'Les 30 aliments', pages: '45-78', icon: '🥗' },
  { num: '03', title: 'Protocole de jeûne', pages: '89-102', icon: '🌙' },
  { num: '04', title: 'Auto-évaluation', pages: '110-125', icon: '📋' },
  { num: '05', title: 'Recettes & menus', pages: '130-180', icon: '👨‍🍳' },
  { num: '06', title: 'Conseils pratiques', pages: 'Bonus', icon: '✨' },
]

export default function BookV3() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-forest-deep via-forest to-forest-deep relative overflow-hidden">
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-terracotta px-4 py-1 rounded-sm z-20">
        <span className="text-[10px] tracking-[0.2em] uppercase text-cream font-medium">
          V3 — Timeline Horizontale
        </span>
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="relative z-10 py-20 px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-terracotta" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-terracotta">
              Sommaire
            </span>
            <span className="w-12 h-px bg-terracotta" />
          </div>
          <h2 className="font-display text-5xl lg:text-7xl text-cream leading-[0.9]">
            Dans ce livre,
          </h2>
          <h2 className="font-display text-5xl lg:text-7xl text-gold italic leading-[0.9] mt-2">
            vous découvrirez
          </h2>
        </div>

        {/* Book Images Row */}
        <div className="flex justify-center items-center gap-8 mb-16">
          <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/images/book-mockup.png"
              alt="La Santé dans l'assiette - Vue à plat"
              width={280}
              height={350}
              className="rounded-lg shadow-2xl"
            />
          </div>
          <div className="relative transform rotate-6 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/images/book-mockup-hero.png"
              alt="La Santé dans l'assiette - Vue 3D"
              width={320}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-sage via-gold to-terracotta" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {chapters.map((ch) => (
              <div key={ch.num} className="relative pt-16 text-center group">
                {/* Timeline dot */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-forest-deep group-hover:scale-150 transition-transform" />

                {/* Card */}
                <div className="bg-cream/10 backdrop-blur-sm border border-cream/20 rounded-xl p-4 hover:bg-cream/20 transition-colors">
                  <span className="text-3xl mb-2 block">{ch.icon}</span>
                  <span className="font-display text-2xl text-gold/50">{ch.num}</span>
                  <h3 className="font-display text-sm text-cream mt-2 leading-tight">{ch.title}</h3>
                  <span className="text-[10px] text-sage-light mt-2 block">Pages {ch.pages}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <span className="inline-block bg-terracotta text-cream px-8 py-3 rounded-full font-display text-lg hover:bg-gold hover:text-forest-deep transition-colors cursor-pointer">
            260+ pages de transformation
          </span>
        </div>
      </div>
    </section>
  )
}
