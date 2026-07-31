import type { Metadata } from 'next'

import { DEFAULT_OG_PATH, SITE_DESCRIPTION, SITE_FULL_NAME } from '@/constants/site'
import { getServerSideURL } from './getURL'

export function getDefaultOgImageUrl(): string {
  return `${getServerSideURL()}${DEFAULT_OG_PATH}`
}

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: SITE_DESCRIPTION,
  images: [
    {
      url: getDefaultOgImageUrl(),
    },
  ],
  siteName: SITE_FULL_NAME,
  title: SITE_FULL_NAME,
  locale: 'zh_TW',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

export const mergeTwitter = (args: {
  title: string
  description?: string
  image?: string
}): Metadata['twitter'] => {
  return {
    card: 'summary_large_image',
    title: args.title,
    description: args.description ?? SITE_DESCRIPTION,
    images: [args.image ?? getDefaultOgImageUrl()],
  }
}
