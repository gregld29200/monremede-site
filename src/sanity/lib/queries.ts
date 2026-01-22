import { groq } from 'next-sanity'

// Posts queries
export const postsQuery = groq`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug}
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && defined(publishedAt)][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    body,
    "author": author->{name, image, bio},
    "categories": categories[]->{title, slug},
    seo
  }
`

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)][].slug.current
`

// Recipes queries
export const recipesQuery = groq`
  *[_type == "recipe" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    prepTime,
    cookTime,
    servings,
    difficulty,
    "categories": categories[]->{title, slug}
  }
`

export const recipeBySlugQuery = groq`
  *[_type == "recipe" && slug.current == $slug && defined(publishedAt)][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    prepTime,
    cookTime,
    servings,
    difficulty,
    ingredients,
    steps,
    tips,
    healthBenefits,
    "categories": categories[]->{title, slug},
    seo
  }
`

export const recipeSlugsQuery = groq`
  *[_type == "recipe" && defined(slug.current) && defined(publishedAt)][].slug.current
`

// Categories query
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }
`

// Author query
export const authorQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    certifications,
    socialLinks
  }
`
