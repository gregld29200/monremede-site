'use client'

const testimonials = [
  {
    text: 'Pour la première fois, j\'ai terminé le Ramadan avec plus d\'énergie qu\'au début. Les conseils sur la digestion ont changé ma vie. El hamdouliLlah.',
    name: 'Fatima',
    role: 'Maman de 3 enfants, 35 ans',
    initial: 'F',
  },
  {
    text: 'Enfin un livre qui parle de santé avec douceur, sans culpabiliser. J\'ai compris pourquoi mon ventre me faisait tant souffrir et comment y remédier naturellement.',
    name: 'Samia',
    role: 'Troubles digestifs, 28 ans',
    initial: 'S',
  },
  {
    text: 'Les questionnaires d\'auto-évaluation m\'ont permis de mieux me connaître. Je suis enfin devenue actrice de ma santé, pas juste spectatrice.',
    name: 'Yousra',
    role: 'Dérèglements hormonaux, 32 ans',
    initial: 'Y',
  },
]

export function TestimonialsSection() {
  return (
    <section className="testimonials-section py-20 lg:py-32 px-6 lg:px-20 bg-blush/30">
      {/* Header */}
      <div className="testimonials-header text-center mb-12 lg:mb-16">
        <p className="label text-sage mb-4">Témoignages</p>
        <h2 className="display-medium text-forest">
          Elles ont transformé leur Ramadan
        </h2>
      </div>

      {/* Grid */}
      <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card bg-cream p-8 lg:p-10 relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Quote mark */}
            <div className="absolute top-6 right-8 font-display text-6xl text-sage/20 leading-none">
              &ldquo;
            </div>

            <p className="text-ink-soft mb-8 leading-relaxed relative z-10 font-serif italic">
              {testimonial.text}
            </p>

            <div className="testimonial-author flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-light to-sage flex items-center justify-center text-forest-deep font-serif text-lg">
                {testimonial.initial}
              </div>
              <div>
                <h4 className="font-serif font-medium text-forest">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-ink-soft">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
