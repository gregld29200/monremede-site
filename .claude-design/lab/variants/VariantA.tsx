'use client'

/**
 * VARIANT A: "Book Cover" - Focus sur les guides comme produits premium
 *
 * Approche: Les deux guides sont présentés comme des couvertures de livres
 * au centre de l'écran, avec le formulaire en dessous. Design très épuré,
 * inspiré des pages produit Apple.
 */

import { useState } from 'react'
import { guides, benefits, author } from '../data/fixtures'

export function VariantA() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero - Centré sur les guides */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Background subtil */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Label */}
          <p className="label text-gold mb-6">2 Guides Gratuits</p>

          {/* Titre principal */}
          <h1 className="display-large text-forest mb-4">
            Préparez votre Ramadan
          </h1>
          <p className="font-accent text-2xl text-sage italic mb-12">
            Corps, esprit et assiette
          </p>

          {/* Les deux guides côte à côte - style couverture de livre */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            {guides.map((guide, index) => (
              <div
                key={guide.number}
                className="group relative"
                style={{ transform: index === 0 ? 'rotate(-3deg)' : 'rotate(3deg)' }}
              >
                {/* Ombre portée */}
                <div className="absolute inset-0 bg-forest-deep/20 rounded-lg blur-xl translate-y-4 group-hover:translate-y-6 transition-transform" />

                {/* Couverture du guide */}
                <div className="relative w-64 h-80 bg-gradient-to-br from-forest-deep to-forest rounded-lg shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  {/* Motif décoratif */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gold" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-gold text-sm tracking-widest mb-4">GUIDE {guide.number}</span>
                    <h3 className="font-display text-xl text-cream leading-tight mb-4">
                      {guide.title}
                    </h3>
                    <div className="w-12 h-px bg-gold/50 mb-4" />
                    <p className="text-cream/60 text-sm">Mon Remède</p>
                  </div>
                  {/* Reflet */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire */}
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="flex-1 px-5 py-4 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              <button className="px-8 py-4 bg-gold text-forest-deep font-medium rounded-lg hover:bg-gold-light transition-colors">
                Recevoir
              </button>
            </div>
            <p className="mt-4 text-ink-soft/60 text-sm">
              Gratuit · Pas de spam · Désinscription en un clic
            </p>
          </div>
        </div>
      </section>

      {/* Section contenu des guides */}
      <section className="py-20 px-6 bg-cream-warm">
        <div className="max-w-5xl mx-auto">
          <p className="label text-sage text-center mb-4">Ce que vous recevrez</p>
          <h2 className="display-medium text-forest text-center mb-16">
            Deux guides complémentaires
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {guides.map((guide) => (
              <div key={guide.number} className="bg-cream rounded-2xl p-8">
                <span className="font-display text-6xl text-sage/20">{guide.number}</span>
                <h3 className="heading text-forest mt-2 mb-4">{guide.title}</h3>
                <p className="text-ink-soft mb-6">{guide.description}</p>
                <ul className="space-y-3">
                  {guide.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-forest-deep/5 flex items-center justify-center mx-auto mb-4">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
                <h3 className="heading text-forest mb-2">{benefit.title}</h3>
                <p className="text-ink-soft text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auteure */}
      <section className="py-20 px-6 bg-forest-deep">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label text-gold mb-6">Votre guide</p>
          <h2 className="display-medium text-cream mb-4">{author.name}</h2>
          <p className="text-sage-light mb-8">{author.title}</p>
          <p className="body-large text-cream/70 mb-8">{author.bio}</p>
          <blockquote className="font-accent text-xl text-sage-light italic">
            « {author.quote} »
          </blockquote>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-sage/20">
        <div className="max-w-md mx-auto text-center">
          <h2 className="display-medium text-forest mb-8">
            Prêt(e) à commencer ?
          </h2>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-5 py-4 rounded-lg border border-sage/30 bg-cream text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button className="px-8 py-4 bg-gold text-forest-deep font-medium rounded-lg hover:bg-gold-light transition-colors">
              Recevoir
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
