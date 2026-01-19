'use client'

import Image from 'next/image'

/**
 * V4 - Organic Flow
 * Curved shapes, warm terracotta tones
 * Botanical feeling with flowing layout
 */

const chapters = [
  { num: '01', title: 'Système digestif', desc: 'Comprendre votre corps' },
  { num: '02', title: '30 aliments', desc: 'Qui soignent vraiment' },
  { num: '03', title: 'Jeûne saisonnier', desc: 'Protocole adapté' },
  { num: '04', title: 'Tests & évaluation', desc: 'Identifier vos besoins' },
  { num: '05', title: 'Recettes', desc: 'Menus thérapeutiques' },
  { num: '06', title: 'Conseils', desc: 'Vitalité quotidienne' },
]

export default function BookV4() {
  return (
    <section className="min-h-screen bg-cream relative overflow-hidden">
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-terracotta px-4 py-1 rounded-sm z-20">
        <span className="text-[10px] tracking-[0.2em] uppercase text-cream font-medium">
          V4 — Organic Flow
        </span>
      </div>

      {/* Organic shapes background */}
      <div className="absolute inset-0">
        {/* Large terracotta blob */}
        <div
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-terracotta/20 rounded-full blur-3xl"
          style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
        />
        {/* Sage blob */}
        <div
          className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-sage/30 rounded-full blur-2xl"
          style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
        />
        {/* Gold accent */}
        <div
          className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-gold/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header - Left aligned */}
          <div className="max-w-xl mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-4 block">
              Un voyage vers la santé
            </span>
            <h2 className="font-display text-5xl lg:text-6xl text-forest-deep leading-[0.95]">
              Dans ce livre,<br />
              <em className="text-terracotta">vous découvrirez</em>
            </h2>
            <p className="font-accent text-xl text-forest/70 mt-6 italic">
              260+ pages de conseils naturels pour transformer votre quotidien
            </p>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left chapters */}
            <div className="space-y-6">
              {chapters.slice(0, 3).map((ch) => (
                <div
                  key={ch.num}
                  className="bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] border border-sage/20 hover:border-terracotta/40 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-display text-4xl text-terracotta/30 group-hover:text-terracotta transition-colors">
                      {ch.num}
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-forest-deep">{ch.title}</h3>
                      <p className="text-forest/60 text-sm mt-1">{ch.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Center - Book with organic frame */}
            <div className="relative flex justify-center">
              {/* Organic frame */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-terracotta/20 to-sage/20 -m-8"
                style={{ borderRadius: '60% 40% 50% 50% / 40% 50% 50% 60%' }}
              />

              <div className="relative z-10 p-8">
                <Image
                  src="/images/book-mockup-hero.png"
                  alt="La Santé dans l'assiette"
                  width={380}
                  height={475}
                  className="drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />

                {/* Floating badge */}
                <div className="absolute -bottom-2 -right-2 bg-gold text-forest-deep px-4 py-2 rounded-full font-display text-sm shadow-lg">
                  Best-seller ✨
                </div>
              </div>
            </div>

            {/* Right chapters */}
            <div className="space-y-6">
              {chapters.slice(3, 6).map((ch) => (
                <div
                  key={ch.num}
                  className="bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] border border-sage/20 hover:border-gold/40 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-display text-4xl text-gold/30 group-hover:text-gold transition-colors">
                      {ch.num}
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-forest-deep">{ch.title}</h3>
                      <p className="text-forest/60 text-sm mt-1">{ch.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="flex justify-center mt-16">
            <svg className="w-32 h-8 text-terracotta/30" viewBox="0 0 100 20">
              <path d="M0 10 Q25 0 50 10 Q75 20 100 10" stroke="currentColor" fill="none" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
