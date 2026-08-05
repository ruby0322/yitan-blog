import type { Metadata } from 'next'

import { ABOUT_SEO, HOME_SEO } from '@/constants/seo'
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_FULL_NAME } from '@/constants/site'
import type { Config, Media, Page, Post } from '../payload-types'
import { buildMetadata } from './buildMetadata'
import { getServerSideURL } from './getURL'
import { getPopulatedCategories, sortCategoriesByOrder } from './categoryOrder'

const PAGE_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  home: HOME_SEO,
  about: ABOUT_SEO,
}

const getCmsImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string | undefined => {
  if (!image || typeof image !== 'object' || !('url' in image)) {
    return undefined
  }

  const serverUrl = getServerSideURL()
  const ogUrl = image.sizes?.og?.url

  return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
}

function resolvePageSlug(doc: Partial<Page> | Partial<Post> | null, path?: string): string | undefined {
  if (path === '/') return 'home'
  if (path?.startsWith('/')) return path.slice(1)

  if (!doc?.slug) return undefined

  const slug = Array.isArray(doc.slug) ? doc.slug.join('/') : doc.slug
  return slug === 'home' ? 'home' : slug
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  path?: string
  ogType?: 'website' | 'article'
}): Promise<Metadata> => {
  const { doc, path, ogType = 'website' } = args
  const pageSlug = resolvePageSlug(doc, path)
  const pageOverride = pageSlug ? PAGE_SEO_OVERRIDES[pageSlug] : undefined

  const title = pageOverride?.title ?? (doc?.meta?.title ? doc.meta.title : SITE_FULL_NAME)
  const description = pageOverride?.description ?? doc?.meta?.description ?? SITE_DESCRIPTION
  const ogImage = getCmsImageURL(doc?.meta?.image)

  let resolvedPath = path
  if (!resolvedPath && doc?.slug) {
    const slug = Array.isArray(doc.slug) ? doc.slug.join('/') : doc.slug
    resolvedPath = slug === 'home' ? '/' : `/${slug}`
  }

  const postDoc = ogType === 'article' ? (doc as Partial<Post> | null) : null
  const tags = sortCategoriesByOrder(getPopulatedCategories(postDoc?.categories))
    .map((category) => category.title)
    .filter((title): title is string => Boolean(title))

  const authors =
    postDoc?.populatedAuthors?.map((a) => a.name).filter((name): name is string => Boolean(name)) ??
    (ogType === 'article' ? [SITE_AUTHOR] : undefined)

  return buildMetadata({
    title,
    description,
    path: resolvedPath,
    ogImage,
    ogType,
    article:
      ogType === 'article'
        ? {
            publishedTime: postDoc?.publishedAt,
            modifiedTime: postDoc?.updatedAt,
            authors,
            tags,
          }
        : undefined,
  })
}
