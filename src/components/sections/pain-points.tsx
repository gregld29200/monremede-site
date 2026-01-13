'use client'
import { cn } from '@/lib/utils'

const painPoints = [
  {
    number: '01',
    title: 'Fatigue chronique',
    description: 'Vous vous réveillez déjà épuisée, traînant votre corps toute la journée sans comprendre pourquoi l\'énergie ne revient jamais.',
  },
  {
    number: '02',
    title: 'Digestion perturbée',
    description: 'Ballonnements, reflux acide, intestin irritable... votre ventre ne vous laisse jamais tranquille et dicte votre quotidien.',
  },
  {
    number: '03',
    title: 'Stress permanent',
    description: 'La charge mentale déborde, les émotions submergent. Vous avez l\'impression de courir sans jamais pouvoir reprendre votre souffle.',
  },
  {
    number: '04',
    title: 'Dépendance aux médicaments',
    description: 'Vous enchaînez les traitements sans résultats durables, sentant que quelque chose de plus profond doit changer.',
  },
  {
    number: '05',
    title: 'Perte de contrôle alimentaire',
    description: 'Envies irrépressibles, grignotages compulsifs... vous avez perdu vos repères face à la nourriture.',
  },
  {
    number: '06',
    title: 'Déconnexion de soi',
    description: 'Vous avez oublié ce que signifie se sentir bien dans son corps. La connexion corps-esprit semble rompue.',
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
            Ces maux silencieux qui vous épuisent
          </h2>
        </div>
        <div className="lg:pb-2">
          <p className="body-large text-ink-soft max-w-md lg:ml-auto">
            Chaque jour qui passe, la douleur est présente. C&apos;est comme un circuit sans fin,
            une tourmente qui ne vous lâche jamais.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="pain-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {painPoints.map((point, index) => (
          <div
            key={point.number}
            className={cn(
              'pain-card bg-cream-warm p-8 lg:p-10 relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-transparent hover:bg-blush hover:border-blush-deep hover:scale-[1.02]',
              index === 1 && 'lg:translate-y-10',
              index === 2 && 'lg:translate-y-20',
              index === 4 && 'lg:translate-y-10',
              index === 5 && 'lg:translate-y-20'
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
