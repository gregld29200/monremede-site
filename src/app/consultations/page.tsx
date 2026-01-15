import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Consultations – Mon Remède',
  description: 'Consultations en naturopathie personnalisées avec Oum Soumayya. Troubles digestifs, équilibre hormonal, santé générale et suivi complet.',
}

const consultations = [
  {
    id: 'sante-generale',
    title: 'Santé Générale',
    description: 'Un bilan complet de votre hygiène de vie avec des recommandations personnalisées pour améliorer votre bien-être au quotidien.',
    includes: [
      'Analyse de votre mode de vie',
      'Bilan alimentaire',
      'Conseils personnalisés',
      'Plan d\'action sur 30 jours',
    ],
    price: 50,
    duration: '45 min',
    color: 'sage',
  },
  {
    id: 'troubles-digestifs',
    title: 'Troubles Digestifs',
    description: 'Retrouvez un confort digestif optimal. Programme adapté aux problèmes de reflux, ballonnements, transit et microbiote.',
    includes: [
      'Bilan digestif approfondi',
      'Protocole de restauration intestinale',
      'Programme alimentaire ciblé',
      'Suivi personnalisé',
    ],
    price: 50,
    duration: '45 min',
    color: 'forest',
  },
  {
    id: 'equilibre-hormonal',
    title: 'Équilibre Hormonal',
    description: 'Rééquilibrez naturellement votre système hormonal. Accompagnement pour les troubles du cycle, thyroïde, fatigue chronique.',
    includes: [
      'Analyse hormonale naturelle',
      'Programme de rééquilibrage',
      'Alimentation adaptée',
      'Conseils en phytothérapie',
    ],
    price: 50,
    duration: '45 min',
    color: 'blush',
  },
  {
    id: 'suivi-complet',
    title: 'Suivi Complet',
    description: 'Un accompagnement sur la durée pour une transformation profonde. Idéal pour les problématiques complexes ou chroniques.',
    includes: [
      'Consultation initiale approfondie',
      '3 suivis personnalisés',
      'Accès messagerie illimité',
      'Programme évolutif sur 3 mois',
    ],
    price: 110,
    duration: '3 mois',
    color: 'gold',
    popular: true,
  },
]

export default function ConsultationsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] bg-forest-deep flex items-center py-32 px-6">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <p className="label text-gold mb-6">Naturopathie Personnalisée</p>
            <h1 className="display-large text-cream mb-6">
              Consultations<br />
              <span className="text-sage-light italic">en ligne</span>
            </h1>
            <p className="body-large text-cream/70 max-w-2xl mx-auto">
              Un accompagnement sur-mesure pour retrouver votre équilibre naturel.
              Chaque consultation est adaptée à vos besoins spécifiques.
            </p>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 lg:py-28 px-6 bg-cream">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label text-sage mb-4">Comment ça marche</p>
              <h2 className="display-medium text-forest">
                Un processus simple et efficace
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Remplissez le questionnaire',
                  description: 'Décrivez vos symptômes, votre mode de vie et vos objectifs de santé.',
                },
                {
                  step: '02',
                  title: 'Recevez votre analyse',
                  description: 'Sous 48h, je vous envoie un bilan détaillé et personnalisé par email.',
                },
                {
                  step: '03',
                  title: 'Commencez votre transformation',
                  description: 'Suivez votre programme et observez les résultats au fil des semaines.',
                },
              ].map((item, index) => (
                <div key={index} className="relative p-8 bg-cream-warm rounded-lg">
                  <span className="block font-display text-6xl text-sage/20 mb-4">
                    {item.step}
                  </span>
                  <h3 className="heading text-forest mb-3">{item.title}</h3>
                  <p className="text-ink-soft">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Consultations Grid */}
        <section className="py-20 lg:py-28 px-6 bg-cream-warm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label text-sage mb-4">Nos formules</p>
              <h2 className="display-medium text-forest mb-4">
                Choisissez votre accompagnement
              </h2>
              <p className="text-ink-soft max-w-xl mx-auto">
                Chaque formule est conçue pour répondre à des besoins spécifiques.
                Pas de paiement en ligne : vous serez contactée après votre demande.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className={`relative bg-cream rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    consultation.popular ? 'ring-2 ring-gold' : ''
                  }`}
                >
                  {consultation.popular && (
                    <div className="absolute top-4 right-4 bg-gold text-forest-deep px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full">
                      Populaire
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <span className={`inline-block w-3 h-3 rounded-full mb-4 ${
                        consultation.color === 'sage' ? 'bg-sage' :
                        consultation.color === 'forest' ? 'bg-forest' :
                        consultation.color === 'blush' ? 'bg-blush-deep' :
                        'bg-gold'
                      }`} />
                      <h3 className="display-medium text-forest text-2xl mb-2">
                        {consultation.title}
                      </h3>
                      <p className="text-ink-soft text-sm">
                        {consultation.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="font-display text-4xl text-forest">
                        {consultation.price}€
                      </span>
                      <span className="text-ink-soft text-sm">
                        / {consultation.duration}
                      </span>
                    </div>

                    {/* Includes */}
                    <ul className="space-y-3 mb-8">
                      {consultation.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-sage-light/50 text-forest flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="text-ink-soft text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      variant={consultation.popular ? 'primary' : 'outline'}
                      size="md"
                      className="w-full justify-center"
                      asChild
                    >
                      <Link href={`/consultations/demande?type=${consultation.id}`}>
                        Demander cette consultation
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 lg:py-28 px-6 bg-forest-deep">
          <div className="max-w-4xl mx-auto text-center">
            <p className="label text-gold mb-6">Pourquoi me faire confiance</p>
            <h2 className="display-medium text-cream mb-8">
              Une approche holistique<br />
              <span className="text-sage-light italic">et bienveillante</span>
            </h2>
            <p className="body-large text-cream/70 mb-12 max-w-2xl mx-auto">
              Diplômée en naturopathie, je vous accompagne avec une écoute attentive
              et des conseils fondés sur les principes de la médecine traditionnelle
              et les dernières recherches en nutrition.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { number: '500+', label: 'Personnes accompagnées' },
                { number: '5 ans', label: 'D\'expérience' },
                { number: '98%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <div key={index} className="p-6">
                  <span className="block font-display text-4xl text-gold mb-2">
                    {stat.number}
                  </span>
                  <span className="text-cream/60 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-20 lg:py-28 px-6 bg-cream">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="label text-sage mb-4">Questions fréquentes</p>
              <h2 className="display-medium text-forest">
                Besoin d&apos;éclaircissements ?
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: 'Comment se déroule une consultation en ligne ?',
                  answer: 'Après avoir rempli le questionnaire détaillé, je vous envoie une analyse personnalisée par email sous 48h. Nous pouvons ensuite échanger par email pour affiner les recommandations.',
                },
                {
                  question: 'Comment se fait le paiement ?',
                  answer: 'Le paiement se fait après validation de votre demande. Je vous enverrai les modalités par email une fois le questionnaire reçu et analysé.',
                },
                {
                  question: 'Les consultations remplacent-elles un avis médical ?',
                  answer: 'Non, la naturopathie est complémentaire à la médecine conventionnelle. Je ne pose pas de diagnostic et ne prescris pas de traitement médical. Consultez toujours votre médecin pour tout problème de santé.',
                },
              ].map((faq, index) => (
                <div key={index} className="p-6 bg-cream-warm rounded-lg">
                  <h3 className="heading text-forest mb-3">{faq.question}</h3>
                  <p className="text-ink-soft">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-28 px-6 bg-sage/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="display-medium text-forest mb-6">
              Prête à transformer votre santé ?
            </h2>
            <p className="text-ink-soft mb-8">
              Commencez dès aujourd&apos;hui votre parcours vers un bien-être durable et naturel.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/consultations/demande">
                Remplir le questionnaire
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
