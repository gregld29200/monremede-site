'use client'

/**
 * VARIANT E: "Immersive Story" - Narration immersive
 *
 * Approche: Design narratif qui raconte une histoire au fur et à mesure
 * du scroll. Grandes sections plein écran avec transitions fluides.
 * Inspiré des longforms journalistiques et des sites de marques de luxe.
 */

import { useState } from 'react'
import { guides, benefits, author } from '../data/fixtures'

export function VariantE() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-forest-deep">
      {/* Section 1 - Accroche plein écran */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        {/* Cercles décoratifs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cream/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/10 rounded-full" />
        </div>

        <div className="relative text-center max-w-3xl">
          <p className="label text-gold mb-8">Ramadan 2025</p>

          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] text-cream leading-[1.1] mb-8">
            Et si cette année,<br />
            <em className="text-sage-light">tout était différent ?</em>
          </h1>

          <p className="font-accent text-xl text-cream/60 mb-12 max-w-xl mx-auto">
            Fini la fatigue dès le premier jour, les repas improvisés
            et le sentiment de ne pas être préparé(e).
          </p>

          <div className="flex flex-col items-center gap-4">
            <a href="#discover" className="px-8 py-4 bg-gold text-forest-deep font-medium rounded-full hover:bg-gold-light transition-colors">
              Découvrir comment →
            </a>
            <span className="text-cream/40 text-sm">Gratuit · 2 guides PDF</span>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-cream/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Section 2 - Le problème */}
      <section className="py-32 px-6 bg-cream" id="discover">
        <div className="max-w-4xl mx-auto">
          <p className="label text-sage mb-6">Le constat</p>

          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-forest leading-tight mb-12">
            Chaque année, c&apos;est la même histoire.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              'La fatigue qui s\'installe dès les premiers jours',
              'Les repas déséquilibrés qui alourdissent au lieu de nourrir',
              'Le sentiment de ne pas profiter pleinement du mois béni',
            ].map((problem, index) => (
              <div key={index} className="relative pl-8">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-blush-deep" />
                <p className="text-ink-soft leading-relaxed">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 - La solution */}
      <section className="py-32 px-6 bg-cream-warm">
        <div className="max-w-4xl mx-auto text-center">
          <p className="label text-gold mb-6">La solution</p>

          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-forest leading-tight mb-8">
            2 guides pour tout changer
          </h2>

          <p className="body-large text-ink-soft max-w-2xl mx-auto mb-16">
            Après 15 ans d&apos;accompagnement en naturopathie, j&apos;ai créé deux guides
            qui rassemblent tout ce dont vous avez besoin pour un Ramadan en pleine forme.
          </p>

          {/* Les deux guides - Affichage alterné */}
          <div className="space-y-24">
            {guides.map((guide, index) => (
              <div
                key={guide.number}
                className={`grid md:grid-cols-2 gap-12 items-center text-left ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Visuel */}
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="aspect-[4/5] bg-forest-deep rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
                    <div className="relative text-center p-8">
                      <span className="font-display text-8xl text-cream/20">{guide.number}</span>
                      <p className="font-accent text-xl text-cream/80 mt-4">{guide.title}</p>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-sm font-medium rounded-full mb-6">
                    Guide {guide.number}
                  </span>

                  <h3 className="display-medium text-forest mb-4">{guide.title}</h3>

                  <p className="text-ink-soft mb-8">{guide.description}</p>

                  <ul className="space-y-4">
                    {guide.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-forest-deep text-xs font-bold">✓</span>
                        </div>
                        <span className="text-ink-soft">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - Bénéfices */}
      <section className="py-32 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="label text-sage mb-4">Ce qui vous attend</p>
            <h2 className="display-medium text-forest">
              Un Ramadan transformé
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-cream-warm rounded-2xl p-8 border border-sage/10"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-forest-deep flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-display text-xl">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="heading text-forest mb-2">{benefit.title}</h3>
                    <p className="text-ink-soft">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Auteure */}
      <section className="py-32 px-6 bg-forest-deep">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-cream/10 flex items-center justify-center mx-auto mb-8">
            <span className="font-display text-3xl text-cream/50">OS</span>
          </div>

          <blockquote className="font-display text-2xl md:text-3xl text-cream leading-relaxed mb-8">
            « {author.quote} »
          </blockquote>

          <p className="text-gold font-accent text-xl">{author.name}</p>
          <p className="text-cream/50 text-sm mt-1">{author.title}</p>
        </div>
      </section>

      {/* Section 6 - CTA Final immersif */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-cream relative">
        {/* Décoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-forest-deep to-transparent" />

        <div className="max-w-xl text-center">
          <p className="label text-gold mb-6">Votre tour</p>

          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] text-forest leading-tight mb-6">
            Commencez<br />
            <em className="text-sage">maintenant</em>
          </h2>

          <p className="text-ink-soft mb-10">
            Entrez votre email pour recevoir immédiatement<br />
            vos deux guides gratuits.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-6 py-5 text-center text-lg border-2 border-forest rounded-full bg-transparent text-forest placeholder:text-ink-soft/50 focus:outline-none focus:border-gold transition-colors"
            />
            <button className="w-full px-8 py-5 bg-forest-deep text-cream font-medium rounded-full hover:bg-forest transition-colors text-lg">
              Recevoir mes guides gratuits
            </button>
          </div>

          <p className="mt-8 text-ink-soft/60 text-sm">
            Gratuit · Sans engagement · Désinscription en un clic
          </p>
        </div>
      </section>
    </div>
  )
}
