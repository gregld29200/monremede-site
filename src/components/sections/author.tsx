'use client'

const credentials = [
  'Naturopathie',
  'Hijama',
  'Acupuncture',
  'Réflexologie',
  'Micronutrition',
  'Massothérapie',
]

export function AuthorSection() {
  return (
    <section className="author-section py-20 lg:py-40 px-6 lg:px-20 bg-cream relative">
      <div className="author-container grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
        {/* Image Wrapper */}
        <div className="author-image-wrapper relative">
          {/* Decorative circle */}
          <div className="absolute -top-[8%] -left-[8%] w-[50%] aspect-square rounded-full border border-sage/20 pointer-events-none hidden lg:block" />

          {/* Main Image */}
          <div className="author-image-main w-full aspect-[4/5] rounded-tr-[100px] rounded-bl-[100px] bg-gradient-to-br from-sage-light to-sage overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <span className="label text-forest-deep/60 text-center px-8">
                Portrait Auteure : Femme en hijab assise dans un cadre naturel et chaleureux, expression douce et bienveillante
              </span>
            </div>
          </div>

          {/* Accent Image */}
          <div className="author-image-accent absolute w-[45%] aspect-square -bottom-[10%] -right-[5%] lg:-right-[15%] rounded-full border-6 border-cream bg-gradient-to-br from-blush to-blush-deep overflow-hidden shadow-xl hidden lg:flex items-center justify-center">
            <span className="label text-forest-deep/60 text-center px-2 text-[0.55rem]">
              Plantes
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="author-content">
          <p className="label text-sage mb-4">L&apos;auteure</p>
          <h2 className="font-display text-4xl lg:text-5xl text-forest mb-2">
            Oum Soumayya
          </h2>
          <p className="font-serif text-lg italic text-sage mb-8">
            Praticienne en médecines naturelles
          </p>

          <p className="text-ink-soft mb-6 leading-relaxed">
            Après des années de souffrances personnelles – sinusite chronique, allergies, douleurs abdominales
            insupportables – Oum Soumayya a cherché des réponses au-delà de la médecine conventionnelle.
            Son parcours de guérison l&apos;a menée vers la naturopathie et les médecines traditionnelles.
          </p>
          <p className="text-ink-soft mb-10 leading-relaxed">
            Aujourd&apos;hui, elle accompagne les femmes – particulièrement les mamans épuisées – vers un bien-être
            profond alliant science, douceur et spiritualité. Ce livre est le fruit de ses années de pratique
            et de la demande de ses patientes.
          </p>

          {/* Credentials */}
          <div className="author-credentials flex flex-wrap gap-3">
            {credentials.map((credential) => (
              <span
                key={credential}
                className="px-4 py-2 bg-sage/10 text-forest text-sm font-medium rounded-sm border border-sage/20"
              >
                {credential}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
