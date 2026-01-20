import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/gestion-mon-remede-oum/', '/api/'],
    },
    sitemap: 'https://monremede.com/sitemap.xml',
  }
}
