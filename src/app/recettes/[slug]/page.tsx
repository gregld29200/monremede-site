import { client } from '@/sanity/lib/client'
import { recipeBySlugQuery, recipeSlugsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Header, Footer } from '@/components/layout'
import { Container, Section, Badge } from '@/components/ui'
import type { Recipe } from '@/types/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getRecipe(slug: string): Promise<Recipe | null> {
  return client.fetch(recipeBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(recipeSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    return { title: 'Recette non trouvée' }
  }

  const title = recipe.seo?.metaTitle || `${recipe.title} - Oum Soumayya`
  const description = recipe.seo?.metaDescription || recipe.excerpt || ''
  const imageUrl = recipe.mainImage
    ? urlFor(recipe.mainImage).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: recipe.mainImage?.alt || recipe.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    facile: 'Facile',
    moyen: 'Moyen',
    difficile: 'Difficile',
  }
  return labels[difficulty] || difficulty
}

// Helper to format duration to ISO 8601 format (PT30M for 30 minutes)
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) {
    return `PT${hours}H${mins}M`
  } else if (hours > 0) {
    return `PT${hours}H`
  }
  return `PT${mins}M`
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  // JSON-LD Recipe Schema for rich results in Google
  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.excerpt || '',
    image: recipe.mainImage
      ? urlFor(recipe.mainImage).width(1200).height(630).url()
      : undefined,
    author: {
      '@type': 'Person',
      name: 'Oum Soumayya',
    },
    prepTime: recipe.prepTime ? formatDuration(recipe.prepTime) : undefined,
    cookTime: recipe.cookTime ? formatDuration(recipe.cookTime) : undefined,
    totalTime: totalTime > 0 ? formatDuration(totalTime) : undefined,
    recipeYield: recipe.servings ? `${recipe.servings} personnes` : undefined,
    recipeCategory: recipe.categories?.[0]?.title,
    recipeIngredient: recipe.ingredients?.map(
      (ing) => `${ing.quantity || ''} ${ing.unit || ''} ${ing.name}`.trim()
    ),
    recipeInstructions: recipe.steps?.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title || `Étape ${index + 1}`,
      text: step.description,
      image: step.image ? urlFor(step.image).width(600).height(338).url() : undefined,
    })),
    nutrition: recipe.healthBenefits?.length
      ? {
          '@type': 'NutritionInformation',
          description: recipe.healthBenefits.join(', '),
        }
      : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <Section background="forest-deep" spacing="lg">
          <Container size="md">
            <div className="text-center">
              {/* Categories */}
              {recipe.categories && recipe.categories.length > 0 && (
                <div className="flex justify-center gap-2 mb-6">
                  {recipe.categories.map((cat) => (
                    <Badge key={cat._id} variant="gold">
                      {cat.title}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="display-large text-cream mb-6">
                {recipe.title}
              </h1>

              {recipe.excerpt && (
                <p className="text-sage-light font-serif text-lg italic max-w-xl mx-auto mb-8">
                  {recipe.excerpt}
                </p>
              )}

              {/* Recipe Meta */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sage">
                {recipe.prepTime && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="label">Prépa: {recipe.prepTime} min</span>
                  </div>
                )}
                {recipe.cookTime && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span className="label">Cuisson: {recipe.cookTime} min</span>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className="flex items-center gap-2 text-gold-light">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="label">Total: {totalTime} min</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="label">{recipe.servings} personnes</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="label">{getDifficultyLabel(recipe.difficulty)}</span>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>

        {/* Featured Image */}
        {recipe.mainImage && (
          <Section background="cream" spacing="none">
            <Container>
              <div className="relative aspect-[21/9] -mt-12 mb-12 overflow-hidden shadow-xl">
                <Image
                  src={urlFor(recipe.mainImage).width(1200).height(514).url()}
                  alt={recipe.mainImage.alt || recipe.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Container>
          </Section>
        )}

        {/* Recipe Content */}
        <Section background="cream" spacing="lg">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Ingredients Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-cream-warm p-8 sticky top-24">
                  <h2 className="font-serif text-2xl text-forest mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Ingrédients
                  </h2>

                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient) => (
                        <li key={ingredient._key} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-ink-soft">
                            <strong className="text-forest">{ingredient.quantity}</strong>
                            {ingredient.unit && ` ${ingredient.unit}`} {ingredient.name}
                            {ingredient.notes && (
                              <em className="text-sage text-sm ml-1">({ingredient.notes})</em>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sage italic">Ingrédients à venir...</p>
                  )}
                </div>
              </div>

              {/* Steps */}
              <div className="lg:col-span-2">
                <h2 className="font-serif text-2xl text-forest mb-8 flex items-center gap-3">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Préparation
                </h2>

                {recipe.steps && recipe.steps.length > 0 ? (
                  <div className="space-y-8">
                    {recipe.steps.map((step, index) => (
                      <div key={step._key} className="flex gap-6">
                        <div className="flex-shrink-0 w-10 h-10 bg-forest text-cream rounded-full flex items-center justify-center font-serif text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          {step.title && (
                            <h3 className="font-serif text-lg text-forest mb-2">{step.title}</h3>
                          )}
                          <p className="text-ink-soft leading-relaxed">{step.description}</p>
                          {step.image && (
                            <div className="mt-4 relative aspect-video overflow-hidden">
                              <Image
                                src={urlFor(step.image).width(600).height(338).url()}
                                alt={step.title || `Étape ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sage italic">Instructions à venir...</p>
                )}

                {/* Tips */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="mt-12 p-6 bg-gold-light/20 border-l-4 border-gold">
                    <h3 className="font-serif text-xl text-forest mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Astuces
                    </h3>
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-ink-soft">
                          <span className="text-gold">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Health Benefits */}
                {recipe.healthBenefits && recipe.healthBenefits.length > 0 && (
                  <div className="mt-8 p-6 bg-sage-light/20 border-l-4 border-sage">
                    <h3 className="font-serif text-xl text-forest mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Bienfaits santé
                    </h3>
                    <ul className="space-y-2">
                      {recipe.healthBenefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-ink-soft">
                          <span className="text-sage">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-16 text-center">
              <Link
                href="/recettes"
                className="inline-flex items-center gap-2 text-sage hover:text-forest transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour aux recettes
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
