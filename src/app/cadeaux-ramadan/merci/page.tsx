import { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Merci - Vos guides sont prêts | Mon Remède',
  description: 'Téléchargez vos guides gratuits pour préparer le Ramadan.',
  robots: {
    index: false,
    follow: false,
  },
}

const downloads = [
  {
    number: '01',
    title: 'Préparer son corps au Ramadan',
    description: 'Conseils naturopathiques pour optimiser votre énergie pendant le mois béni.',
    filename: 'guide-preparation-ramadan.pdf',
  },
  {
    number: '02',
    title: 'Recettes saines pour le Ramadan',
    description: 'Idées de repas équilibrés pour le ftour et le shour.',
    filename: 'guide-recettes-ramadan.pdf',
  },
]

export default function MerciPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] bg-forest-deep flex items-center py-32 px-6">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="text-xs tracking-[0.3em] uppercase text-gold font-medium">
                Inscription confirmée
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
            </div>

            <h1 className="display-large text-cream mb-6">
              Merci !
            </h1>

            <p className="body-large text-cream/70 max-w-2xl mx-auto">
              Vos guides sont prêts à être téléchargés.
              Un email de confirmation vous a également été envoyé.
            </p>
          </div>
        </section>

        {/* Downloads Section */}
        <section className="py-20 lg:py-28 px-6 bg-cream">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="label text-sage mb-4">Vos guides gratuits</p>
              <h2 className="display-medium text-forest">
                Téléchargez vos ressources
              </h2>
            </div>

            <div className="space-y-6">
              {downloads.map((download) => (
                <div
                  key={download.number}
                  className="bg-cream-warm rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="flex-shrink-0">
                    <span className="block font-display text-5xl text-sage/30">
                      {download.number}
                    </span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="heading text-forest mb-1">
                      {download.title}
                    </h3>
                    <p className="text-ink-soft text-sm">
                      {download.description}
                    </p>
                  </div>

                  <Button variant="primary" size="md" asChild>
                    <a
                      href={`/downloads/${download.filename}`}
                      download
                      className="flex-shrink-0"
                    >
                      Télécharger
                      <span className="ml-2">↓</span>
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="py-20 lg:py-28 px-6 bg-cream-warm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="label text-sage mb-4">Et maintenant ?</p>
              <h2 className="display-medium text-forest">
                Continuez votre parcours santé
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Book CTA */}
              <div className="bg-cream rounded-lg p-8 text-center">
                <div className="w-3 h-3 rounded-full bg-gold mx-auto mb-6" />
                <h3 className="display-medium text-forest text-xl mb-3">
                  Allez plus loin
                </h3>
                <p className="text-ink-soft text-sm mb-6">
                  Découvrez mon livre « La Santé dans l&apos;assiette »,
                  un guide complet de naturopathie pour toute la famille.
                </p>
                <Button variant="outline" size="md" asChild>
                  <Link href="/livre">
                    Découvrir le livre
                  </Link>
                </Button>
              </div>

              {/* Consultation CTA */}
              <div className="bg-cream rounded-lg p-8 text-center">
                <div className="w-3 h-3 rounded-full bg-sage mx-auto mb-6" />
                <h3 className="display-medium text-forest text-xl mb-3">
                  Besoin d&apos;un accompagnement ?
                </h3>
                <p className="text-ink-soft text-sm mb-6">
                  Réservez une consultation personnalisée pour un suivi adapté
                  à vos besoins spécifiques.
                </p>
                <Button variant="outline" size="md" asChild>
                  <Link href="/consultations">
                    Voir les consultations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-28 px-6 bg-forest-deep">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="display-medium text-cream mb-6">
              Que ce Ramadan soit une source<br />
              <span className="text-sage-light italic">de bien-être et de sérénité</span>
            </h2>
            <p className="text-cream/70 mb-8">
              N&apos;hésitez pas à me contacter si vous avez des questions.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/">
                Retour à l&apos;accueil
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
