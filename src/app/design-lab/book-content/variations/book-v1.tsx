'use client'

import Image from 'next/image'

/**
 * V1 - Magazine Editorial Split
 * Large book image left, content chapters right
 * Clean typography, editorial feel
 */

const chapters = [
  { num: '01', title: 'Votre système digestif', desc: 'Comment il fonctionne réellement et pourquoi il vous fait souffrir.' },
  { num: '02', title: 'Les 30 aliments qui soignent', desc: 'vs ceux qui vous épuisent. Listes détaillées et explications.' },
  { num: '03', title: 'Le protocole de jeûne', desc: 'Adapté à chaque saison pour maximiser les bienfaits.' },
  { num: '04', title: "Questionnaires d'auto-évaluation", desc: '5 tests pour identifier vos carences et déséquilibres.' },
  { num: '05', title: 'Recettes et menus types', desc: 'Pour chaque situation : fatigue, digestion, stress...' },
  { num: '06', title: 'Conseils pratiques', desc: 'Pour maintenir votre vitalité toute l\'année.' },
]

export default function BookV1() {
  return (
    <section className="min-h-screen bg-cream relative overflow-hidden">
      {/* Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-terracotta px-4 py-1 rounded-sm z-10">
        <span className="text-[10px] tracking-[0.2em] uppercase text-cream font-medium">
          V1 — Magazine Editorial
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left - Book Image */}
        <div className="relative bg-sage/20 flex items-center justify-center p-12 lg:p-20">
          {/* Decorative circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 border-gold/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-sage/30" />

          <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
            <Image
              src="/images/book-mockup-hero.png"
              alt="La Santé dans l'assiette"
              width={400}
              height={500}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Badge */}
          <div className="absolute bottom-12 left-12 bg-gold text-forest-deep px-4 py-2 rounded-sm">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold">260+ pages</span>
          </div>
        </div>

        {/* Right - Content */}
        <div className="bg-forest-deep text-cream p-12 lg:p-20 flex flex-col justify-center">
          <div className="max-w-lg">
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4 block">
              Ce que vous allez apprendre
            </span>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-4">
              Dans ce livre,<br />
              <span className="text-gold italic">vous découvrirez</span>
            </h2>
            <div className="w-16 h-1 bg-terracotta mb-10" />

            <div className="space-y-6">
              {chapters.map((ch) => (
                <div key={ch.num} className="flex gap-4 group">
                  <span className="font-display text-3xl text-gold/30 group-hover:text-gold transition-colors">
                    {ch.num}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-cream group-hover:text-gold transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-sage-light text-sm">{ch.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
