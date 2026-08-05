import type { Metadata } from 'next'

import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_FULL_NAME,
  SITE_KEYWORDS,
} from '@/constants/site'
import { getServerSideURL } from './getURL'
import { getDefaultOgImageUrl, mergeOpenGraph, mergeTwitter } from './mergeOpenGraph'

type BuildMetadataArgs = {
  title: string
  description?: string
  path?: string
  /** Custom OG image URL. Omit to use the generated default. */
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
  keywords?: string[]
  article?: {
    publishedTime?: string | null
    modifiedTime?: string | null
    authors?: string[]
    tags?: string[]
  }
}

function resolveAbsoluteUrl(path: string): string {
  const serverUrl = getServerSideURL()
  if (path === '/') return serverUrl
  return `${serverUrl}${path}`
}

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  ogImage,
  ogType = 'website',
  noIndex = false,
  keywords,
  article,
}: BuildMetadataArgs): Metadata {
  const ogImages = ogImage ? [{ url: ogImage }] : undefined
  const twitterImage = ogImage ?? getDefaultOgImageUrl()
  const absoluteUrl = path ? resolveAbsoluteUrl(path) : getServerSideURL()
  const resolvedKeywords = keywords ? [...new Set([...keywords, ...SITE_KEYWORDS])] : [...SITE_KEYWORDS]

  return {
    title,
    description,
    keywords: resolvedKeywords,
    authors: [{ name: SITE_AUTHOR }],
    creator: SITE_AUTHOR,
    publisher: SITE_FULL_NAME,
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: mergeOpenGraph({
      type: ogType,
      title,
      description,
      url: absoluteUrl,
      ...(ogImages ? { images: ogImages } : {}),
      ...(ogType === 'article' && article?.publishedTime
        ? { publishedTime: article.publishedTime }
        : {}),
      ...(ogType === 'article' && article?.modifiedTime
        ? { modifiedTime: article.modifiedTime }
        : {}),
      ...(ogType === 'article' && article?.authors?.length
        ? { authors: article.authors }
        : {}),
      ...(ogType === 'article' && article?.tags?.length ? { tags: article.tags } : {}),
    }),
    twitter: mergeTwitter({ title, description, image: twitterImage }),
  }
}
