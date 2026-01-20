import Link from 'next/link'
import Variation1 from './variation-1'
import Variation2 from './variation-2'
import Variation3 from './variation-3'
import Variation4 from './variation-4'
import Variation5 from './variation-5'

export default function QuestionnaireDesignLabPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="py-12 px-8 text-center border-b border-forest/10 bg-forest-deep">
        <span className="text-xs tracking-[0.3em] uppercase text-gold mb-4 block">
          Design Lab — Section Questionnaire
        </span>
        <h1 className="font-display text-4xl lg:text-5xl text-cream mb-4">
          5 Variations
        </h1>
        <p className="font-accent text-lg text-cream/60 italic max-w-xl mx-auto">
          Choisissez le design qui met le mieux en avant le questionnaire santé
        </p>
      </header>

      {/* Navigation rapide */}
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sage/10 py-4 px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          {[
            { num: 1, name: 'Minimaliste' },
            { num: 2, name: 'Split' },
            { num: 3, name: 'Carte' },
            { num: 4, name: 'Magazine' },
            { num: 5, name: 'Interactive' },
          ].map((v) => (
            <a
              key={v.num}
              href={`#variation-${v.num}`}
              className="px-4 py-2 text-sm text-forest hover:text-gold hover:bg-sage/10 transition-colors"
            >
              {v.num}. {v.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Variations */}
      <div className="divide-y divide-forest/10">
        <div id="variation-1">
          <Variation1 />
        </div>
        <div id="variation-2">
          <Variation2 />
        </div>
        <div id="variation-3">
          <Variation3 />
        </div>
        <div id="variation-4">
          <Variation4 />
        </div>
        <div id="variation-5">
          <Variation5 />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-8 text-center border-t border-forest/10 bg-cream-warm">
        <p className="text-ink-soft mb-4">
          Quelle variation préférez-vous ?
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className="px-6 py-2 border border-sage/30 text-forest text-sm hover:border-gold hover:text-gold transition-colors cursor-pointer"
            >
              Variation {num}
            </span>
          ))}
        </div>
        <Link href="/" className="text-sage hover:text-gold transition-colors text-sm">
          ← Retour à l&apos;accueil
        </Link>
      </footer>
    </div>
  )
}
