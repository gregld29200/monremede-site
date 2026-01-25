'use client'

/**
 * VARIANT D: "Card Stack" - Focus sur les cartes produit
 *
 * Approche: Les guides sont présentés comme des cartes empilées avec
 * des détails riches. Design inspiré des apps de productivité premium
 * avec beaucoup d'interactions visuelles suggérées.
 */

import { useState } from 'react'
import { guides, benefits, author } from '../data/fixtures'

export function VariantD() {
  const [email, setEmail] = useState('')
  const [activeGuide, setActiveGuide] = useState(0)

  return (
    <div className="min-h-screen bg-cream-warm">
      {/* Hero avec cartes interactives */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Côté gauche - Contenu */}
        <div className="flex-1 flex items-center px-8 lg:px-16 py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-sm text-gold font-medium">Gratuit - Téléchargement immédiat</span>
            </div>

            <h1 className="display-large text-forest mb-6">
              Votre kit<br />
              <span className="text-sage">Ramadan</span><br />
              complet
            </h1>

            <p className="body-large text-ink-soft mb-10">
              2 guides PDF exclusifs pour préparer votre corps et cuisiner sainement
              pendant le mois sacré. Par Oum Soumayya, naturopathe.
            </p>

            {/* Formulaire */}
            <div className="bg-cream rounded-2xl p-6 shadow-lg">
              <p className="text-sm text-ink-soft mb-4">
                Entrez votre email pour recevoir le kit :
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 px-4 py-3 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button className="px-6 py-3 bg-forest-deep text-cream font-medium rounded-lg hover:bg-forest transition-colors whitespace-nowrap">
                  Recevoir
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              <div>
                <span className="font-display text-3xl text-forest">500+</span>
                <p className="text-sm text-ink-soft">téléchargements</p>
              </div>
              <div>
                <span className="font-display text-3xl text-forest">2</span>
                <p className="text-sm text-ink-soft">guides PDF</p>
              </div>
              <div>
                <span className="font-display text-3xl text-forest">15+</span>
                <p className="text-sm text-ink-soft">recettes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Côté droit - Cartes des guides */}
        <div className="flex-1 relative bg-forest-deep flex items-center justify-center p-8 lg:p-16 min-h-[60vh]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, var(--sage) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Cartes empilées */}
          <div className="relative w-full max-w-sm">
            {guides.map((guide, index) => (
              <div
                key={guide.number}
                className={`absolute inset-0 bg-cream rounded-2xl shadow-2xl cursor-pointer transition-all duration-500 ${
                  activeGuide === index
                    ? 'z-20 scale-100 rotate-0'
                    : 'z-10 scale-95 rotate-3 translate-x-4 translate-y-4'
                }`}
                onClick={() => setActiveGuide(index)}
              >
                <div className="p-8">
                  {/* Header de la carte */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-medium rounded-full">
                      Guide {guide.number}
                    </span>
                    <span className="text-sage text-sm">PDF</span>
                  </div>

                  {/* Titre */}
                  <h3 className="heading text-forest mb-4">{guide.title}</h3>

                  {/* Description */}
                  <p className="text-ink-soft text-sm mb-6">{guide.description}</p>

                  {/* Contenu */}
                  <div className="space-y-2">
                    {guide.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded bg-sage-light/50 flex items-center justify-center">
                          <span className="text-forest text-[10px]">✓</span>
                        </div>
                        <span className="text-ink-soft">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la carte */}
                <div className="absolute bottom-0 left-0 right-0 px-8 py-4 bg-cream-warm rounded-b-2xl border-t border-sage/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-soft">Mon Remède</span>
                    <span className="text-xs text-gold">Gratuit</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Indicateur de carte */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
              {guides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveGuide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeGuide === index ? 'bg-gold' : 'bg-cream/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bénéfices en grille */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label text-sage mb-4">Pourquoi ce kit ?</p>
            <h2 className="display-medium text-forest">
              Tout pour un Ramadan serein
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-cream-warm rounded-xl p-6 hover:bg-forest-deep transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <span className="text-gold font-display text-lg">0{index + 1}</span>
                </div>
                <h3 className="heading text-forest mb-2 group-hover:text-cream transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-ink-soft text-sm group-hover:text-cream/70 transition-colors">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auteure - Format carte */}
      <section className="py-24 px-6 bg-cream-warm">
        <div className="max-w-4xl mx-auto">
          <div className="bg-cream rounded-2xl p-8 lg:p-12 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-forest-deep/10 flex items-center justify-center">
                  <span className="font-display text-4xl text-forest/30">OS</span>
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <p className="label text-gold mb-2">Créé par</p>
                <h3 className="display-medium text-forest mb-1">{author.name}</h3>
                <p className="text-sage mb-4">{author.title}</p>
                <p className="text-ink-soft">{author.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Sticky feel */}
      <section className="py-16 px-6 bg-forest-deep">
        <div className="max-w-2xl mx-auto">
          <div className="bg-cream rounded-2xl p-8 text-center shadow-2xl">
            <h2 className="display-medium text-forest mb-4">
              Prêt(e) à commencer ?
            </h2>
            <p className="text-ink-soft mb-6">
              Recevez vos 2 guides gratuits maintenant
            </p>

            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button className="px-6 py-3 bg-gold text-forest-deep font-medium rounded-lg hover:bg-gold-light transition-colors">
                Recevoir
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
