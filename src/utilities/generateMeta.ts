import type { Metadata } from 'next'

import { SITE_DESCRIPTION, SITE_FULL_NAME } from '@/constants/site'
import type { Config, Media, Page, Post } from '../payload-types'
import { buildMetadata } from './buildMetadata'
import { getServerSideURL } from './getURL'

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

  return buildMetadata({
    title,
    description,
    path: resolvedPath,
    ogImage,
    ogType,
  })
}
