'use client'

/**
 * VARIANT C: "Editorial" - Style magazine/éditorial
 *
 * Approche: Design inspiré des magazines de luxe avec une typographie
 * expressive, des numéros surdimensionnés et un rythme visuel fort.
 * Beaucoup d'espace blanc et de hiérarchie claire.
 */

import { useState } from 'react'
import { guides, benefits, author } from '../data/fixtures'

export function VariantC() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Editorial */}
      <section className="relative px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Numéro décoratif géant */}
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none hidden lg:block">
            <span className="font-display text-[400px] text-forest leading-none">
              02
            </span>
          </div>

          <div className="relative grid lg:grid-cols-12 gap-12 items-end">
            {/* Colonne principale */}
            <div className="lg:col-span-7">
              <p className="label text-gold mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gold" />
                Édition Ramadan 2025
              </p>

              <h1 className="font-display text-[clamp(3rem,8vw,6rem)] text-forest leading-[0.9] mb-8">
                Préparez<br />
                votre corps<br />
                <em className="text-sage">naturellement</em>
              </h1>

              <p className="body-large text-ink-soft max-w-lg mb-10">
                Deux guides essentiels pour aborder le mois sacré avec énergie,
                sérénité et des repas qui nourrissent vraiment.
              </p>

              {/* Formulaire inline */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 px-6 py-5 border-b-2 border-forest bg-transparent text-forest placeholder:text-ink-soft/50 focus:outline-none focus:border-gold transition-colors"
                />
                <button className="px-10 py-5 bg-forest-deep text-cream font-medium hover:bg-forest transition-colors">
                  Recevoir →
                </button>
              </div>
            </div>

            {/* Colonne latérale - Preview des guides */}
            <div className="lg:col-span-5">
              <div className="bg-cream-warm p-8 rounded-sm">
                <p className="label text-sage mb-6">Inclus dans votre pack</p>
                {guides.map((guide, index) => (
                  <div key={guide.number} className={index > 0 ? 'mt-6 pt-6 border-t border-sage/20' : ''}>
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-4xl text-gold/40">{guide.number}</span>
                      <h3 className="heading text-forest">{guide.title}</h3>
                    </div>
                  </div>
                ))}
                <p className="mt-8 text-sm text-ink-soft">
                  Format PDF · Téléchargement immédiat · Gratuit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Séparateur visuel */}
      <div className="h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent" />

      {/* Section Guides - Style magazine */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {guides.map((guide, index) => (
            <div
              key={guide.number}
              className={`grid lg:grid-cols-12 gap-12 items-center ${
                index > 0 ? 'mt-24 pt-24 border-t border-sage/10' : ''
              }`}
            >
              {/* Numéro géant */}
              <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <span className="font-display text-[180px] lg:text-[240px] text-sage/10 leading-none block">
                  {guide.number}
                </span>
              </div>

              {/* Contenu */}
              <div className={`lg:col-span-9 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <p className="label text-gold mb-4">Guide {guide.number}</p>
                <h2 className="display-medium text-forest mb-6">{guide.title}</h2>
                <p className="body-large text-ink-soft mb-8 max-w-2xl">
                  {guide.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {guide.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-forest-deep/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      </div>
                      <span className="text-ink-soft text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bénéfices - Style éditorial */}
      <section className="py-24 px-6 bg-forest-deep">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label text-gold mb-4">Les bénéfices</p>
            <h2 className="display-medium text-cream">
              Ce que vous allez gagner
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-forest-deep p-8">
                <span className="font-display text-5xl text-gold/20 block mb-4">
                  0{index + 1}
                </span>
                <h3 className="heading text-cream mb-3">{benefit.title}</h3>
                <p className="text-cream/60 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation auteure */}
      <section className="py-32 px-6 bg-cream-warm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-px bg-gold mx-auto mb-12" />

          <blockquote className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-forest leading-snug mb-12">
            « {author.quote} »
          </blockquote>

          <div>
            <p className="font-accent text-xl text-forest">{author.name}</p>
            <p className="text-sage text-sm mt-1">{author.title}</p>
          </div>
        </div>
      </section>

      {/* CTA Final - Minimaliste */}
      <section className="py-24 px-6 bg-cream border-t border-sage/10">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="label text-sage mb-4">Dernière étape</p>
            <h2 className="display-medium text-forest">
              Recevez vos guides
            </h2>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Entrez votre adresse email"
              className="w-full px-6 py-5 border-2 border-forest bg-transparent text-forest placeholder:text-ink-soft/50 focus:outline-none focus:border-gold rounded-sm transition-colors"
            />
            <button className="w-full px-8 py-5 bg-gold text-forest-deep font-medium hover:bg-gold-light transition-colors rounded-sm">
              Télécharger gratuitement
            </button>
          </div>

          <p className="mt-6 text-center text-ink-soft/60 text-sm">
            +500 personnes ont déjà téléchargé ces guides
          </p>
        </div>
      </section>
    </div>
  )
}
