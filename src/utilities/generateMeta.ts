import type { Metadata } from 'next'

import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_FULL_NAME } from '@/constants/site'
import type { Config, Media, Page, Post } from '../payload-types'
import { buildMetadata } from './buildMetadata'
import { getServerSideURL } from './getURL'
import { getPopulatedCategories, sortCategoriesByOrder } from './categoryOrder'

const getCmsImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string | undefined => {
  if (!image || typeof image !== 'object' || !('url' in image)) {
    return undefined
  }

  const serverUrl = getServerSideURL()
  const ogUrl = image.sizes?.og?.url

  return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  path?: string
  ogType?: 'website' | 'article'
}): Promise<Metadata> => {
  const { doc, path, ogType = 'website' } = args

  const title = doc?.meta?.title ? doc.meta.title : SITE_FULL_NAME
  const description = doc?.meta?.description || SITE_DESCRIPTION
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
