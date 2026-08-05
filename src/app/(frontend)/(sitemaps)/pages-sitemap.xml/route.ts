import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { SITEMAP_STATIC_PATHS } from '@/constants/sitemapStaticPaths'
import { getServerSideURL } from '@/utilities/getURL'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const siteUrl = getServerSideURL()

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const categories = await payload.find({
      collection: 'categories',
      overrideAccess: false,
      depth: 0,
      limit: 100,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const defaultSitemap = [
      ...SITEMAP_STATIC_PATHS.map((path) => ({
        loc: `${siteUrl}${path}`,
        lastmod: dateFallback,
      })),
      ...(categories.docs ?? [])
        .filter((category) => Boolean(category.slug))
        .map((category) => ({
          loc: `${siteUrl}/posts?category=${encodeURIComponent(category.slug as string)}`,
          lastmod: category.updatedAt || dateFallback,
        })),
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: page?.slug === 'home' ? `${siteUrl}/` : `${siteUrl}/${page?.slug}`,
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
