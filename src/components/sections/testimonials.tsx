'use client'

const testimonials = [
  {
    text: 'J\'ai enfin compris pourquoi j\'étais toujours fatiguée. Les questionnaires m\'ont ouvert les yeux.',
    name: 'Lectrice Amazon',
    stars: 5,
  },
  {
    text: 'Un livre que je garde sur ma table de chevet. Je le consulte régulièrement.',
    name: 'Oum Yasmine',
    stars: 5,
  },
  {
    text: 'Pour la première fois, j\'ai terminé le Ramadan avec plus d\'énergie qu\'au début. El hamdouliLlah.',
    name: 'Fatima',
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="testimonials-section py-20 lg:py-32 px-6 lg:px-20 bg-blush/20">
      {/* Header */}
      <div className="text-center mb-12 lg:mb-16">
        <p className="label text-sage mb-4">Témoignages</p>
        <h2 className="display-medium text-forest">
          Ce qu&apos;elles disent du livre
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card bg-cream p-8 lg:p-10 relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonial.stars)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote mark */}
            <div className="absolute top-6 right-8 font-display text-5xl text-sage/15 leading-none">
              &ldquo;
            </div>

            <p className="text-ink-soft mb-6 leading-relaxed relative z-10 font-serif italic">
              {testimonial.text}
            </p>

            <p className="text-sm font-medium text-forest">
              — {testimonial.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
