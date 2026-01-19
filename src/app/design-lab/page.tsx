import Variation1 from './variations/variation-1'
import Variation2 from './variations/variation-2'
import Variation3 from './variations/variation-3'
import Variation4 from './variations/variation-4'
import Variation5 from './variations/variation-5'

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="py-12 px-8 text-center border-b border-forest/10">
        <span className="text-xs tracking-[0.3em] uppercase text-sage mb-4 block">
          Design Lab
        </span>
        <h1 className="font-display text-4xl lg:text-5xl text-forest mb-4">
          Dyptique Paysage
        </h1>
        <p className="font-accent text-lg text-ink-soft italic max-w-xl mx-auto">
          Brouillard → Rayons de soleil — 5 variations de mise en page
          pour la section PainPoints
        </p>
      </header>

      {/* Variations */}
      <div className="divide-y divide-forest/10">
        <Variation1 />
        <Variation2 />
        <Variation3 />
        <Variation4 />
        <Variation5 />
      </div>

      {/* Footer */}
      <footer className="py-12 px-8 text-center border-t border-forest/10 bg-cream-warm">
        <p className="text-sm text-sage">
          Choisissez une variation pour l&apos;intégrer à la section PainPoints
        </p>
      </footer>
    </div>
  )
}
