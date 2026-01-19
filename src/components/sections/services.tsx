import { Button } from '@/components/ui'
import Link from 'next/link'

const services = [
  {
    id: 'sante-generale',
    title: 'Santé Générale',
    description: 'Bilan complet de votre hygiène de vie avec recommandations personnalisées.',
    price: 50,
    color: 'sage',
  },
  {
    id: 'troubles-digestifs',
    title: 'Troubles Digestifs',
    description: 'Programme adapté aux problèmes de reflux, ballonnements et microbiote.',
    price: 60,
    color: 'forest',
  },
  {
    id: 'equilibre-hormonal',
    title: 'Équilibre Hormonal',
    description: 'Rééquilibrage naturel pour troubles du cycle, thyroïde, fatigue.',
    price: 70,
    color: 'blush',
  },
  {
    id: 'suivi-complet',
    title: 'Suivi Complet',
    description: 'Accompagnement sur 3 semaines pour une transformation profonde.',
    price: 110,
    color: 'gold',
    popular: true,
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 px-6 bg-cream-warm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="label text-sage mb-4">Accompagnement personnalisé</p>
          <h2 className="display-large text-forest mb-4">
            Consultations<br />
            <span className="text-sage italic">en naturopathie</span>
          </h2>
          <p className="text-ink-soft max-w-xl mx-auto">
            Un suivi sur-mesure pour retrouver votre équilibre naturel.
            Chaque consultation est adaptée à vos besoins spécifiques.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/consultations/demande?type=${service.id}`}
              className={`group relative bg-cream p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                service.popular ? 'ring-2 ring-gold' : ''
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 right-4 bg-gold text-forest-deep px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider rounded-full">
                  Populaire
                </span>
              )}

              <span className={`inline-block w-2.5 h-2.5 rounded-full mb-4 ${
                service.color === 'sage' ? 'bg-sage' :
                service.color === 'forest' ? 'bg-forest' :
                service.color === 'blush' ? 'bg-blush-deep' :
                'bg-gold'
              }`} />

              <h3 className="heading text-forest text-lg mb-2 group-hover:text-gold transition-colors">
                {service.title}
              </h3>

              <p className="text-ink-soft text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              <span className="font-display text-2xl text-forest">
                {service.price}€
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="md" asChild>
            <Link href="/consultations">
              Voir toutes les formules
              <span>→</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
