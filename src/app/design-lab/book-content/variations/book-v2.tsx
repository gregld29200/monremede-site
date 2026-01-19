'use client'

import Image from 'next/image'

/**
 * V2 - Colorful Chapter Cards
 * Vibrant colored cards in a grid
 * Book mockup centered with floating cards around
 */

const chapters = [
  { num: '01', title: 'Système digestif', color: 'bg-terracotta', textColor: 'text-cream' },
  { num: '02', title: '30 aliments qui soignent', color: 'bg-gold', textColor: 'text-forest-deep' },
  { num: '03', title: 'Protocole de jeûne', color: 'bg-sage', textColor: 'text-forest-deep' },
  { num: '04', title: 'Auto-évaluation', color: 'bg-forest', textColor: 'text-cream' },
  { num: '05', title: 'Recettes & menus', color: 'bg-blush-deep', textColor: 'text-forest-deep' },
  { num: '06', title: 'Conseils quotidiens', color: 'bg-forest-deep', textColor: 'text-gold' },
]

export default function BookV2() {
  return (
    <section className="min-h-screen bg-cream-warm relative overflow-hidden py-20">
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-terracotta px-4 py-1 rounded-sm z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase text-cream font-medium">
          V2 — Cartes Colorées
        </span>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-terracotta" />
        <div className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-sage" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-gold" />
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-forest-deep text-gold px-4 py-1 text-[10px] tracking-[0.3em] uppercase mb-6">
            260+ pages de sagesse
          </span>
          <h2 className="font-display text-5xl lg:text-6xl text-forest-deep leading-tight">
            Dans ce livre,<br />
            <span className="italic text-terracotta">vous découvrirez</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Left cards */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {chapters.slice(0, 3).map((ch, i) => (
              <div
                key={ch.num}
                className={`${ch.color} ${ch.textColor} p-6 rounded-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 shadow-lg`}
                style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
              >
                <span className="text-4xl font-display opacity-30">{ch.num}</span>
                <h3 className="font-display text-xl mt-2">{ch.title}</h3>
              </div>
            ))}
          </div>

          {/* Center - Book */}
          <div className="col-span-12 lg:col-span-6 flex justify-center py-10">
            <div className="relative">
              {/* Shadow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-forest-deep/20 blur-xl rounded-full" />

              <Image
                src="/images/book-mockup-hero.png"
                alt="La Santé dans l'assiette"
                width={450}
                height={560}
                className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold rounded-full flex items-center justify-center text-forest-deep font-display text-sm">
                Best<br/>seller
              </div>
            </div>
          </div>

          {/* Right cards */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {chapters.slice(3, 6).map((ch, i) => (
              <div
                key={ch.num}
                className={`${ch.color} ${ch.textColor} p-6 rounded-2xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300 shadow-lg`}
                style={{ transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)` }}
              >
                <span className="text-4xl font-display opacity-30">{ch.num}</span>
                <h3 className="font-display text-xl mt-2">{ch.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
