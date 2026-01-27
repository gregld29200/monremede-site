import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4otm8dqd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

interface GuideReview {
  _id: string
  rating: number
  comment: string
  displayName: string
  featured: boolean
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-gold fill-gold' : 'text-sage/30'}`}
          viewBox="0 0 24 24"
          fill={star <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
    </div>
  )
}

export async function GuideTestimonials() {
  // Fetch approved reviews (prioritize featured)
  const reviews = await client.fetch<GuideReview[]>(
    `*[_type == "guideReview" && approved == true] | order(featured desc, submittedAt desc) [0...6] {
      _id,
      rating,
      comment,
      displayName,
      featured
    }`
  )

  // Calculate stats
  const allApproved = await client.fetch<{ rating: number }[]>(
    `*[_type == "guideReview" && approved == true] { rating }`
  )

  const count = allApproved.length
  const average = count > 0
    ? Math.round((allApproved.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
    : 0

  if (reviews.length === 0) {
    return null
  }

  const displayReviews = reviews.slice(0, 3)

  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label text-sage mb-4">Témoignages</p>
          <h2 className="display-medium text-forest mb-4">
            Ce qu&apos;en pensent nos lectrices
          </h2>
          {count > 0 && (
            <div className="flex items-center justify-center gap-3 text-ink-soft">
              <StarRating rating={Math.round(average)} size="md" />
              <span className="font-body text-sm">
                {average}/5 basé sur {count} avis
              </span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <div
              key={review._id}
              className="bg-cream-warm rounded-2xl p-6 border border-sage/10 transition-shadow hover:shadow-md"
            >
              <StarRating rating={review.rating} />
              <p className="font-body text-ink-soft mt-4 mb-4 leading-relaxed text-sm">
                &ldquo;{review.comment}&rdquo;
              </p>
              <p className="font-display text-forest text-sm">
                — {review.displayName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
