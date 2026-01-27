import Image from 'next/image'
import { Header, Footer } from '@/components/layout'
import { LeadMagnetForm } from '@/components/sections/lead-magnet-form'
import { GuideTestimonials } from '@/components/sections/guide-testimonials'

export const revalidate = 60 // Revalidate every minute

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

const guideDetails = [
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
    variant: 'dark' as const,
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
    variant: 'light' as const,
  },
]

export default function CadeauxRamadanPage() {
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
              <LeadMagnetForm variant="light" />

              <p className="mt-4 text-ink-soft/60 text-sm text-center">
                Rejoignez +500 personnes accompagnées
              </p>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative bg-forest-deep order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
            {/* Image des guides */}
            <Image
              src="/images/lead-magnet/leadmagnet.webp"
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
              {guideDetails.map((guide) => (
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

        {/* Testimonials */}
        <GuideTestimonials />

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
              Entrez vos informations pour recevoir vos guides dans les 24h.
            </p>

            <LeadMagnetForm variant="dark" className="max-w-md mx-auto" />

            <p className="mt-6 text-cream/50 text-sm">
              Gratuit · Pas de spam · Désinscription en un clic
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
