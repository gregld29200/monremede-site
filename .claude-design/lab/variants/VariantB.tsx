'use client'

/**
 * VARIANT B: "Split Screen" - Hero divisé avec visuel fort
 *
 * Approche: Écran divisé avec le contenu à gauche et un visuel
 * atmosphérique à droite. Design asymétrique et moderne, inspiré
 * des sites de marques lifestyle premium.
 */

import { useState } from 'react'
import { guides, benefits, author } from '../data/fixtures'

export function VariantB() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Split Screen */}
      <section className="min-h-screen grid lg:grid-cols-2">
        {/* Côté gauche - Contenu */}
        <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-20 order-2 lg:order-1">
          <div className="max-w-lg">
            {/* Breadcrumb décoratif */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <span className="label text-gold">Gratuit</span>
            </div>

            <h1 className="display-large text-forest mb-6 leading-tight">
              Votre guide<br />
              <span className="text-sage italic">naturopathique</span><br />
              pour le Ramadan
            </h1>

            <p className="body-large text-ink-soft mb-10">
              Recevez 2 guides complets pour préparer votre corps et vos repas
              pendant le mois béni. Conseils d&apos;une naturopathe expérimentée.
            </p>

            {/* Liste des guides */}
            <div className="space-y-4 mb-10">
              {guides.map((guide) => (
                <div key={guide.number} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest-deep flex items-center justify-center text-gold text-sm font-medium">
                    {guide.number}
                  </div>
                  <span className="text-forest">{guide.title}</span>
                </div>
              ))}
            </div>

            {/* Formulaire */}
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                className="w-full px-5 py-4 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button className="w-full px-8 py-4 bg-forest-deep text-cream font-medium rounded-lg hover:bg-forest transition-colors flex items-center justify-center gap-2">
                Recevoir mes guides gratuits
                <span>→</span>
              </button>
            </div>

            <p className="mt-4 text-ink-soft/60 text-sm text-center">
              Rejoignez +500 personnes accompagnées
            </p>
          </div>
        </div>

        {/* Côté droit - Visuel */}
        <div className="relative bg-forest-deep order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
          {/* Dégradé décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-forest to-forest-deep" />

          {/* Motifs décoratifs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 border border-gold/20 rounded-full" />
            <div className="absolute bottom-32 left-16 w-40 h-40 border border-sage/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cream/5 rounded-full" />
          </div>

          {/* Texte décoratif */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center">
              <span className="font-display text-[120px] lg:text-[180px] text-cream/5 leading-none">
                رمضان
              </span>
              <p className="font-accent text-xl text-cream/40 mt-4 italic">
                Ramadan Kareem
              </p>
            </div>
          </div>

          {/* Badge flottant */}
          <div className="absolute bottom-8 left-8 bg-cream/10 backdrop-blur-sm rounded-lg p-4 border border-cream/20">
            <p className="text-cream text-sm">
              <span className="text-gold font-medium">2 PDF</span> à télécharger
            </p>
          </div>
        </div>
      </section>

      {/* Détail des guides */}
      <section className="py-24 px-6 bg-cream-warm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label text-sage mb-4">Contenu des guides</p>
            <h2 className="display-medium text-forest">
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <div
                key={guide.number}
                className={`rounded-2xl overflow-hidden ${
                  index === 0 ? 'bg-forest-deep text-cream' : 'bg-cream border border-sage/20'
                }`}
              >
                <div className="p-8 lg:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`font-display text-5xl ${index === 0 ? 'text-gold/30' : 'text-sage/30'}`}>
                      {guide.number}
                    </span>
                    <div className={`h-px flex-1 ${index === 0 ? 'bg-cream/20' : 'bg-sage/20'}`} />
                  </div>

                  <h3 className={`heading mb-4 ${index === 0 ? 'text-cream' : 'text-forest'}`}>
                    {guide.title}
                  </h3>

                  <p className={`mb-8 ${index === 0 ? 'text-cream/70' : 'text-ink-soft'}`}>
                    {guide.description}
                  </p>

                  <ul className="space-y-3">
                    {guide.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                          index === 0 ? 'bg-gold/20 text-gold' : 'bg-sage-light/50 text-forest'
                        }`}>
                          ✓
                        </span>
                        <span className={index === 0 ? 'text-cream/80' : 'text-ink-soft'}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bénéfices en ligne */}
      <section className="py-16 px-6 bg-cream border-y border-sage/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-forest font-medium">{benefit.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auteure */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Photo placeholder */}
            <div className="md:col-span-2">
              <div className="aspect-[3/4] bg-forest-deep/10 rounded-2xl flex items-center justify-center">
                <span className="text-sage/50 text-sm">Photo</span>
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-3">
              <p className="label text-sage mb-4">À propos</p>
              <h2 className="display-medium text-forest mb-2">{author.name}</h2>
              <p className="text-gold mb-6">{author.title}</p>
              <p className="body-large text-ink-soft mb-8">{author.bio}</p>
              <blockquote className="pl-6 border-l-2 border-gold">
                <p className="font-accent text-lg text-forest italic">
                  « {author.quote} »
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 bg-forest-deep">
        <div className="max-w-xl mx-auto text-center">
          <p className="label text-gold mb-6">Ne manquez pas cette opportunité</p>
          <h2 className="display-medium text-cream mb-8">
            Commencez votre préparation<br />
            <span className="text-sage-light italic">dès maintenant</span>
          </h2>

          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-5 py-4 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold"
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
