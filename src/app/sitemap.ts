import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const baseUrl = 'https://monremede.com'

type SanityDocument = {
  slug: { current: string }
  _updatedAt: string
}

async function getPostsForSitemap(): Promise<SanityDocument[]> {
  return client.fetch(groq`
    *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      slug,
      _updatedAt
    }
  `)
}

async function getRecipesForSitemap(): Promise<SanityDocument[]> {
  return client.fetch(groq`
    *[_type == "recipe" && defined(slug.current)] | order(publishedAt desc) {
      slug,
      _updatedAt
    }
  `)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/livre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consultations`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/questionnaire`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/recettes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Pages dynamiques - Articles de blog
  const posts = await getPostsForSitemap()
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Pages dynamiques - Recettes
  const recipes = await getRecipesForSitemap()
  const recipePages: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${baseUrl}/recettes/${recipe.slug.current}`,
    lastModified: new Date(recipe._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...postPages, ...recipePages]
}
