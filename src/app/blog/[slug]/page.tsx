import { client } from '@/sanity/lib/client'
import { postBySlugQuery, postSlugsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Header, Footer } from '@/components/layout'
import { Container, Section, Badge } from '@/components/ui'
import type { Post } from '@/types/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(postBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(postSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Article non trouvé' }
  }

  return {
    title: post.seo?.metaTitle || `${post.title} - Oum Soumayya`,
    description: post.seo?.metaDescription || post.excerpt,
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string } }) => {
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            width={800}
            height={500}
            className="w-full"
          />
          {value.alt && (
            <figcaption className="text-center text-sage text-sm mt-2 italic">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-serif text-2xl text-forest mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-serif text-xl text-forest mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-gold pl-6 my-6 italic text-ink-soft">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => {
      const href = value?.href || ''
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-sage hover:text-forest underline transition-colors"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-forest">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-ink-soft">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-ink-soft">{children}</ol>
    ),
  },
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <Section background="forest-deep" spacing="lg">
          <Container size="md">
            <div className="text-center">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex justify-center gap-2 mb-6">
                  {post.categories.map((cat) => (
                    <Badge key={cat._id} variant="gold">
                      {cat.title}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="display-large text-cream mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-sage-light font-serif text-lg italic max-w-xl mx-auto mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-center gap-4 text-sage">
                {post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.image && (
                      <Image
                        src={urlFor(post.author.image).width(40).height(40).url()}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <span className="label">{post.author.name}</span>
                  </div>
                )}
                {post.publishedAt && (
                  <>
                    <span className="text-sage-light">•</span>
                    <time className="label">{formatDate(post.publishedAt)}</time>
                  </>
                )}
              </div>
            </div>
          </Container>
        </Section>

        {/* Featured Image */}
        {post.mainImage && (
          <Section background="cream" spacing="none">
            <Container>
              <div className="relative aspect-[21/9] -mt-12 mb-12 overflow-hidden shadow-xl">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(514).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Container>
          </Section>
        )}

        {/* Content */}
        <Section background="cream" spacing="lg">
          <Container size="sm">
            <article className="prose-custom text-ink-soft">
              {post.body && (
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              )}
            </article>

            {/* Author Bio */}
            {post.author?.bio && (
              <div className="mt-16 pt-8 border-t border-sage-light/30">
                <div className="flex items-start gap-6">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).width(80).height(80).url()}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="rounded-full flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="label text-sage mb-2">À propos de l&apos;auteur</p>
                    <h3 className="font-serif text-xl text-forest mb-3">{post.author.name}</h3>
                    <div className="text-ink-soft text-sm">
                      <PortableText value={post.author.bio} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back Link */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sage hover:text-forest transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour aux articles
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
