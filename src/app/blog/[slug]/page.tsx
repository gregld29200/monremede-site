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

export const revalidate = 60

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

  const title = post.seo?.metaTitle || `${post.title} - Oum Soumayya`
  const description = post.seo?.metaDescription || post.excerpt || ''
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.mainImage?.alt || post.title,
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Image layout types
type ImageLayout = 'full' | 'center' | 'left' | 'right'
type ImageSize = 'small' | 'medium' | 'large'

// Layout classes for images
const getImageLayoutClasses = (layout: ImageLayout, size: ImageSize): string => {
  // Size classes - used for center, left, right layouts
  const sizeClasses = {
    small: 'max-w-xs',
    medium: 'max-w-md',
    large: 'max-w-2xl',
  }

  switch (layout) {
    case 'full':
      return 'w-full'
    case 'center':
      return `mx-auto ${sizeClasses[size]}`
    case 'left':
      return `float-left mr-6 mb-4 ${sizeClasses[size]}`
    case 'right':
      return `float-right ml-6 mb-4 ${sizeClasses[size]}`
    default:
      return 'w-full'
  }
}

// Wrapper to clear floats
const ClearFloat = () => <div className="clear-both" />

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string; caption?: string; layout?: ImageLayout; size?: ImageSize } }) => {
      const layout = value.layout || 'full'
      const size = value.size || 'medium'
      const layoutClasses = getImageLayoutClasses(layout, size)
      const isFloating = layout === 'left' || layout === 'right'

      return (
        <>
          <figure className={`my-8 ${layoutClasses}`}>
            <Image
              src={urlFor(value).width(layout === 'full' ? 800 : size === 'large' ? 600 : size === 'medium' ? 400 : 250).url()}
              alt={value.alt || ''}
              width={layout === 'full' ? 800 : size === 'large' ? 600 : size === 'medium' ? 400 : 250}
              height={layout === 'full' ? 500 : size === 'large' ? 375 : size === 'medium' ? 250 : 156}
              className={`rounded-lg ${layout === 'full' ? 'w-full' : 'w-full h-auto'}`}
            />
            {(value.caption || value.alt) && (
              <figcaption className="text-center text-sage text-sm mt-2 italic">
                {value.caption || value.alt}
              </figcaption>
            )}
          </figure>
          {/* Add clear for floating images - but not inline to avoid breaking text flow */}
        </>
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

  // JSON-LD Article Schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          image: post.author.image
            ? urlFor(post.author.image).width(200).height(200).url()
            : undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Mon Remède',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.monremede.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.monremede.com/blog/${slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <main id="main-content" className="pt-20">
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
