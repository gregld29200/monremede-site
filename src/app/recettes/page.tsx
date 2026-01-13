import { client } from '@/sanity/lib/client'
import { recipesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Header, Footer } from '@/components/layout'
import { Container, Section, Badge } from '@/components/ui'
import type { Recipe } from '@/types/sanity'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Recettes Santé - Oum Soumayya',
  description: 'Recettes saines et naturelles pour une alimentation équilibrée. Découvrez des plats nutritifs et délicieux.',
}

export const revalidate = 60

async function getRecipes(): Promise<Recipe[]> {
  return client.fetch(recipesQuery)
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    facile: 'Facile',
    moyen: 'Moyen',
    difficile: 'Difficile',
  }
  return labels[difficulty] || difficulty
}

function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    facile: 'bg-sage-light text-forest',
    moyen: 'bg-gold-light text-forest-deep',
    difficile: 'bg-blush-deep text-forest-deep',
  }
  return colors[difficulty] || 'bg-sage-light text-forest'
}

export default async function RecettesPage() {
  const recipes = await getRecipes()

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <Section background="forest-deep" spacing="lg">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Badge variant="gold" className="mb-6">Recettes</Badge>
              <h1 className="display-large text-cream mb-6">
                Cuisine <em className="italic text-gold-light">Santé</em>
              </h1>
              <p className="text-sage-light font-serif text-lg italic">
                Des recettes saines et savoureuses pour prendre soin de votre corps
              </p>
            </div>
          </Container>
        </Section>

        {/* Recipes Grid */}
        <Section background="cream" spacing="lg">
          <Container>
            {recipes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-ink-soft text-lg mb-4">
                  Aucune recette pour le moment.
                </p>
                <p className="text-sage">
                  Revenez bientôt pour découvrir nos recettes santé !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                  <article key={recipe._id} className="group">
                    <Link href={`/recettes/${recipe.slug.current}`} className="block">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-sage-light mb-5">
                        {recipe.mainImage ? (
                          <Image
                            src={urlFor(recipe.mainImage).width(600).height(450).url()}
                            alt={recipe.mainImage.alt || recipe.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="label text-forest-deep/60">Image à venir</span>
                          </div>
                        )}

                        {/* Difficulty Badge */}
                        {recipe.difficulty && (
                          <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                            {getDifficultyLabel(recipe.difficulty)}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mb-3">
                          {recipe.prepTime && (
                            <div className="flex items-center gap-1 text-sage text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Prépa: {recipe.prepTime} min</span>
                            </div>
                          )}
                          {recipe.cookTime && (
                            <div className="flex items-center gap-1 text-sage text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                              </svg>
                              <span>Cuisson: {recipe.cookTime} min</span>
                            </div>
                          )}
                          {recipe.servings && (
                            <div className="flex items-center gap-1 text-sage text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{recipe.servings} pers.</span>
                            </div>
                          )}
                        </div>

                        <h2 className="font-serif text-xl text-forest mb-3 group-hover:text-sage transition-colors">
                          {recipe.title}
                        </h2>

                        {recipe.excerpt && (
                          <p className="text-ink-soft line-clamp-2 text-sm">
                            {recipe.excerpt}
                          </p>
                        )}

                        {/* Categories */}
                        {recipe.categories && recipe.categories.length > 0 && (
                          <div className="flex gap-2 mt-4">
                            {recipe.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat._id}
                                className="px-2 py-1 bg-sage-light/50 text-forest text-xs"
                              >
                                {cat.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
