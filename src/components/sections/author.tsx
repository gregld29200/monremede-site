'use client'

import Image from 'next/image'

const credentials = [
  'Naturopathie',
  'Micronutrition',
  'Hijama',
  'Accompagnement du jeûne',
]

export function AuthorSection() {
  return (
    <section className="author-section py-20 lg:py-32 px-6 lg:px-20 bg-cream relative">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative mx-auto lg:mx-0">
            {/* Decorative circle */}
            <div className="absolute -inset-4 rounded-full border border-sage/20 hidden lg:block" />

            {/* Main Image */}
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-lg">
              <Image
                src="/images/author-brand.webp"
                alt="Mon Remède - Oum Soumayya"
                width={224}
                height={224}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="label text-sage mb-4">Qui est l&apos;auteure ?</p>
            <h2 className="font-display text-3xl lg:text-4xl text-forest mb-6">
              Zayneb, Oum Soumayya
            </h2>

            <p className="text-ink-soft mb-8 leading-relaxed text-lg">
              Accompagne des familles depuis <strong className="text-forest">2009</strong>.
              Ancienne étudiante en médecine devenue naturopathe, elle a compilé dans ce livre
              <strong className="text-forest"> 15 années de pratique</strong> et les demandes de ses patientes.
            </p>

            {/* Credentials */}
            <div className="flex flex-wrap gap-3">
              {credentials.map((credential, index) => (
                <span
                  key={credential}
                  className="px-4 py-2 bg-sage/10 text-forest text-sm font-medium rounded-sm border border-sage/20"
                >
                  {index > 0 && <span className="mr-2 text-sage/40">·</span>}
                  {credential}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
