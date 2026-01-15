'use client'
import { cn } from '@/lib/utils'

const painPoints = [
  {
    number: '01',
    title: 'Fatigue persistante',
    description: 'Vous réveiller fatiguée malgré une nuit complète, traînant votre corps toute la journée sans comprendre pourquoi.',
  },
  {
    number: '02',
    title: 'Médicaments sans résultats',
    description: 'Enchaîner les traitements sans résultats durables, sentant que quelque chose de plus profond doit changer.',
  },
  {
    number: '03',
    title: 'Corps incompréhensible',
    description: 'Ne pas comprendre pourquoi votre corps vous fait souffrir. La connexion corps-esprit semble rompue.',
  },
  {
    number: '04',
    title: 'Ramadan épuisant',
    description: 'Finir chaque Ramadan plus épuisée qu\'avant, au lieu de vous sentir purifiée et régénérée.',
  },
]

export function PainPointsSection() {
  return (
    <section className="pain-section py-20 lg:py-40 px-6 sm:px-12 lg:px-20 bg-cream relative">
      {/* Header */}
      <div className="pain-header grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-16 lg:mb-20">
        <div>
          <p className="label text-sage mb-5">Vous reconnaissez-vous ?</p>
          <h2 className="display-large text-forest">
            Vous en avez assez de…
          </h2>
        </div>
        <div className="lg:pb-2">
          <p className="body-large text-ink-soft max-w-md lg:ml-auto">
            Chaque jour qui passe, ces maux silencieux vous épuisent.
            Ce livre a été écrit <em className="italic text-forest">pour vous</em>.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="pain-grid grid grid-cols-1 md:grid-cols-2 gap-5">
        {painPoints.map((point, index) => (
          <div
            key={point.number}
            className={cn(
              'pain-card bg-cream-warm p-8 lg:p-10 relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-transparent hover:bg-blush hover:border-blush-deep hover:scale-[1.02]',
              index === 1 && 'lg:translate-y-8',
              index === 3 && 'lg:translate-y-8'
            )}
          >
            <div className="font-display text-6xl text-sage/30 leading-none mb-5">
              {point.number}
            </div>
            <h3 className="font-serif text-xl font-medium text-forest mb-4">
              {point.title}
            </h3>
            <p className="text-ink-soft text-[0.95rem] leading-relaxed">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
