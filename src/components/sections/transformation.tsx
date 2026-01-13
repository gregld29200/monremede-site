'use client'

const transformations = [
  { before: 'Stress chronique', after: 'Calme retrouvé' },
  { before: 'Digestion douloureuse', after: 'Ventre apaisé' },
  { before: 'Fatigue mentale', after: 'Énergie stable' },
  { before: 'Chaos intérieur', after: 'Paix intérieure' },
]

export function TransformationSection() {
  return (
    <section id="decouvrir" className="transform-section grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-screen">
      {/* Image Column */}
      <div className="transform-image-col relative bg-forest min-h-[50vh] lg:min-h-full">
        {/* Main Image */}
        <div className="absolute top-0 left-0 w-full h-[70%] bg-gradient-to-br from-sage to-forest overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="label text-cream/60 text-center px-8">
              Image : Femme en paix, pratiquant une activité de bien-être
            </span>
          </div>
        </div>

        {/* Overlay Image */}
        <div className="absolute bottom-[10%] right-[-20%] lg:right-[-20%] w-[60%] h-[45%] border-8 border-cream bg-gradient-to-br from-sage-light to-sage z-10 overflow-hidden hidden lg:flex items-center justify-center">
          <span className="label text-forest-deep/60 text-center px-4 text-[0.6rem]">
            Détail ingrédients
          </span>
        </div>

        {/* Quote */}
        <div className="absolute bottom-[8%] left-[8%] max-w-xs z-20">
          <blockquote className="font-serif text-lg italic text-cream leading-relaxed pl-5 border-l-2 border-gold">
            « Quand tu prends soin de ton intérieur – ton stress, tes émotions, tes habitudes –
            tout le reste s&apos;aligne. »
          </blockquote>
        </div>
      </div>

      {/* Content Column */}
      <div className="transform-content-col px-8 lg:px-16 xl:px-24 py-16 lg:py-24 flex flex-col justify-center bg-cream-warm">
        <p className="label text-sage mb-6">La transformation</p>
        <h2 className="display-medium text-forest mb-12">
          De l&apos;épuisement à l&apos;épanouissement en 30 jours
        </h2>

        <div className="transform-list flex flex-col gap-6 lg:gap-8">
          {transformations.map((item, index) => (
            <div
              key={index}
              className="transform-item grid grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center py-5 lg:py-6 border-b border-forest/10"
            >
              {/* Before */}
              <div className="transform-before flex items-center gap-3 lg:gap-4">
                <div className="w-9 h-9 rounded-full bg-blush text-blush-deep flex items-center justify-center text-sm flex-shrink-0">
                  ✗
                </div>
                <span className="text-ink-soft text-sm lg:text-base">{item.before}</span>
              </div>

              {/* Arrow */}
              <span className="text-gold text-xl lg:text-2xl">→</span>

              {/* After */}
              <div className="transform-after flex items-center gap-3 lg:gap-4">
                <div className="w-9 h-9 rounded-full bg-sage-light text-forest flex items-center justify-center text-sm flex-shrink-0">
                  ✓
                </div>
                <span className="text-ink-soft text-sm lg:text-base">{item.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
