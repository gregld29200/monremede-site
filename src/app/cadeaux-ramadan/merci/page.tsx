import { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Merci - Inscription confirmée | Mon Remède',
  description: 'Votre inscription est confirmée. Vous recevrez vos guides Ramadan dans les 24 heures.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MerciPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] bg-forest-deep flex items-center py-32 px-6">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            {/* Success icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-4xl">🌙</span>
            </div>

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

            <p className="body-large text-cream/70 max-w-xl mx-auto mb-8">
              Votre inscription est bien enregistrée.
            </p>

            {/* Info box */}
            <div className="bg-cream/10 backdrop-blur-sm rounded-xl p-8 max-w-lg mx-auto mb-8">
              <p className="text-gold text-sm uppercase tracking-wider mb-3 font-medium">
                Prochaine étape
              </p>
              <p className="text-cream text-xl leading-relaxed">
                Nous vous contactons <strong className="text-gold">dans les 24 heures</strong> pour vous envoyer vos liens de téléchargement personnalisés, incha&apos;Allah.
              </p>
            </div>

            <div className="text-cream/50 text-sm">
              <p>En attendant, n&apos;hésitez pas à découvrir nos autres ressources ci-dessous.</p>
            </div>
          </div>
        </section>

        {/* What's coming Section */}
        <section className="py-20 lg:py-28 px-6 bg-cream">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="label text-sage mb-4">Ce que vous allez recevoir</p>
              <h2 className="display-medium text-forest">
                Vos 2 guides gratuits
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-cream-warm rounded-xl p-8">
                <span className="block font-display text-5xl text-sage/20 mb-4">01</span>
                <h3 className="heading text-forest mb-3">
                  Préparer son corps au Ramadan
                </h3>
                <p className="text-ink-soft text-sm">
                  Conseils naturopathiques pour optimiser votre énergie et votre bien-être pendant le mois béni.
                </p>
              </div>

              <div className="bg-cream-warm rounded-xl p-8">
                <span className="block font-display text-5xl text-sage/20 mb-4">02</span>
                <h3 className="heading text-forest mb-3">
                  Recettes saines pour le Ramadan
                </h3>
                <p className="text-ink-soft text-sm">
                  Des idées de repas équilibrés pour le ftour et le shour, simples et nourrissants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="py-20 lg:py-28 px-6 bg-cream-warm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="label text-sage mb-4">En attendant</p>
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

        {/* Final */}
        <section className="py-20 lg:py-28 px-6 bg-forest-deep">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="display-medium text-cream mb-6">
              Que ce Ramadan soit une source<br />
              <span className="text-sage-light italic">de bien-être et de sérénité</span>
            </h2>
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
