'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui'

export default function CadeauxRamadanPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Veuillez entrer votre email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer un email valide')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cadeaux-ramadan' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      router.push('/cadeaux-ramadan/merci')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  const guides = [
    {
      number: '01',
      title: 'Préparer son corps au Ramadan',
      description: 'Un guide complet de conseils naturopathiques pour optimiser votre énergie et votre bien-être pendant le mois béni.',
    },
    {
      number: '02',
      title: 'Recettes saines pour le Ramadan',
      description: 'Des idées de repas équilibrés et nourrissants pour le ftour et le shour, faciles à préparer.',
    },
  ]

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Split Screen */}
        <section className="min-h-screen grid lg:grid-cols-2 pt-20">
          {/* Left - Content */}
          <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-16 bg-cream order-2 lg:order-1">
            <div className="max-w-lg">
              {/* Label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-gold" />
                <span className="label text-gold">Édition Ramadan 2026</span>
              </div>

              {/* Heading */}
              <h1 className="display-large text-forest mb-6 leading-tight">
                Préparez<br />
                votre corps<br />
                <span className="text-sage italic">naturellement</span>
              </h1>

              {/* Description */}
              <p className="body-large text-ink-soft mb-10">
                Deux guides essentiels pour aborder le mois sacré avec énergie,
                sérénité et des repas qui nourrissent vraiment.
              </p>

              {/* Guides list */}
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre adresse email"
                  className="w-full px-5 py-4 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Envoi...' : 'Recevoir mes guides gratuits'}
                  {!isLoading && <span>→</span>}
                </Button>
                {error && (
                  <p className="text-blush-deep text-sm">{error}</p>
                )}
              </form>

              <p className="mt-4 text-ink-soft/60 text-sm text-center">
                Rejoignez +500 personnes accompagnées
              </p>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative bg-forest-deep order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
            {/* Image des guides */}
            <Image
              src="/images/lead-magnet/guides-ramadan.png"
              alt="Guides Ramadan - Préparation et Recettes"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/30 via-transparent to-forest-deep/20 lg:bg-gradient-to-r lg:from-forest-deep/20 lg:via-transparent lg:to-transparent" />
          </div>
        </section>

        {/* Content Section - Guides Details */}
        <section className="py-24 px-6 bg-cream-warm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label text-sage mb-4">Contenu des guides</p>
              <h2 className="display-medium text-forest">Tout ce dont vous avez besoin</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  number: '01',
                  title: 'Préparer son corps au Ramadan',
                  description: 'Un guide complet de conseils naturopathiques pour optimiser votre énergie et votre bien-être pendant le mois béni.',
                  includes: [
                    'Comment préparer votre corps 2 semaines avant',
                    'Gérer l\'énergie et éviter les coups de fatigue',
                    'Les compléments naturels recommandés',
                    'Rituels de bien-être pour le corps et l\'esprit',
                  ],
                  variant: 'dark',
                },
                {
                  number: '02',
                  title: 'Recettes saines pour le Ramadan',
                  description: 'Des idées de repas équilibrés et nourrissants pour le ftour et le shour, faciles à préparer.',
                  includes: [
                    'Idées de ftour équilibré et énergisant',
                    'Shour optimal pour tenir la journée',
                    'Recettes rapides pour les journées chargées',
                    'Alternatives saines aux plats traditionnels',
                  ],
                  variant: 'light',
                },
              ].map((guide) => (
                <div
                  key={guide.number}
                  className={`rounded-2xl overflow-hidden ${
                    guide.variant === 'dark'
                      ? 'bg-forest-deep text-cream'
                      : 'bg-cream border border-sage/20'
                  }`}
                >
                  <div className="p-8 lg:p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <span
                        className={`font-display text-5xl ${
                          guide.variant === 'dark' ? 'text-gold/30' : 'text-sage/30'
                        }`}
                      >
                        {guide.number}
                      </span>
                      <div
                        className={`h-px flex-1 ${
                          guide.variant === 'dark' ? 'bg-cream/20' : 'bg-sage/20'
                        }`}
                      />
                    </div>

                    <h3
                      className={`heading mb-4 ${
                        guide.variant === 'dark' ? 'text-cream' : 'text-forest'
                      }`}
                    >
                      {guide.title}
                    </h3>

                    <p
                      className={`mb-8 ${
                        guide.variant === 'dark' ? 'text-cream/70' : 'text-ink-soft'
                      }`}
                    >
                      {guide.description}
                    </p>

                    <ul className="space-y-3">
                      {guide.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                              guide.variant === 'dark'
                                ? 'bg-gold/20 text-gold'
                                : 'bg-sage-light/50 text-forest'
                            }`}
                          >
                            ✓
                          </span>
                          <span
                            className={
                              guide.variant === 'dark' ? 'text-cream/80' : 'text-ink-soft'
                            }
                          >
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

        {/* Final CTA */}
        <section className="py-20 lg:py-28 px-6 bg-forest-deep">
          <div className="max-w-2xl mx-auto text-center">
            {/* Quote intégrée */}
            <blockquote className="font-accent text-xl text-sage-light italic mb-8 max-w-xl mx-auto">
              « Le Ramadan est une période de purification spirituelle et physique.
              Avec les bons outils, vous pouvez en faire une expérience de bien-être total. »
            </blockquote>
            <p className="text-gold text-sm mb-12">— Zayneb OLD, Naturopathe depuis 2009</p>

            <h2 className="display-medium text-cream mb-6">
              Prêt(e) à recevoir vos guides ?
            </h2>
            <p className="text-cream/70 mb-8">
              Entrez votre email et accédez immédiatement aux téléchargements.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 px-5 py-4 rounded-lg border border-cream/20 bg-cream/5 text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="whitespace-nowrap"
                >
                  {isLoading ? 'Envoi...' : 'Recevoir'}
                  {!isLoading && <span className="ml-2">→</span>}
                </Button>
              </div>
              {error && (
                <p className="mt-3 text-blush-deep text-sm">{error}</p>
              )}
              <p className="mt-6 text-cream/50 text-sm">
                Gratuit · Pas de spam · Désinscription en un clic
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
