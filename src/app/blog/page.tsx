import { client } from '@/sanity/lib/client'
import { postsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Header, Footer } from '@/components/layout'
import { Container, Section, Badge } from '@/components/ui'
import type { Post } from '@/types/sanity'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export const metadata = {
  title: 'Blog Naturopathie - Conseils Santé Naturelle | Oum Soumayya',
  description: 'Découvrez nos articles sur la naturopathie, la santé naturelle et le bien-être. Conseils pratiques sur l\'alimentation, les remèdes naturels et la prévention.',
}


async function getPosts(): Promise<Post[]> {
  return client.fetch(postsQuery)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <Section background="forest-deep" spacing="lg">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Badge variant="gold" className="mb-6">Blog</Badge>
              <h1 className="display-large text-cream mb-6">
                Conseils <em className="italic text-gold-light">Santé</em>
              </h1>
              <p className="text-sage-light font-serif text-lg italic">
                Des articles pour vous accompagner vers une vie plus saine et équilibrée
              </p>
            </div>
          </Container>
        </Section>

        {/* Articles Grid */}
        <Section background="cream" spacing="lg">
          <Container>
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-ink-soft text-lg mb-4">
                  Aucun article pour le moment.
                </p>
                <p className="text-sage">
                  Revenez bientôt pour découvrir nos conseils santé !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <article
                    key={post._id}
                    className={`group ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                  >
                    <Link href={`/blog/${post.slug.current}`} className="block">
                      {/* Image */}
                      <div className={`relative overflow-hidden bg-sage-light mb-5 ${
                        index === 0 ? 'aspect-[2/1]' : 'aspect-[4/3]'
                      }`}>
                        {post.mainImage ? (
                          <Image
                            src={urlFor(post.mainImage).width(800).height(index === 0 ? 400 : 600).url()}
                            alt={post.mainImage.alt || post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={index < 2}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="label text-forest-deep/60">Image à venir</span>
                          </div>
                        )}

                        {/* Categories */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="absolute top-4 left-4 flex gap-2">
                            {post.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat._id}
                                className="px-3 py-1 bg-cream/90 text-forest text-xs font-medium"
                              >
                                {cat.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        {post.publishedAt && (
                          <time className="label text-sage block mb-2">
                            {formatDate(post.publishedAt)}
                          </time>
                        )}
                        <h2 className={`font-serif text-forest mb-3 group-hover:text-sage transition-colors ${
                          index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                        }`}>
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-ink-soft line-clamp-2">
                            {post.excerpt}
                          </p>
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
