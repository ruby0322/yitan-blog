import {
  DEFAULT_OG_PATH,
  ICON_PATH,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_FULL_NAME,
} from '@/constants/site'
import type { Post } from '@/payload-types'
import { getServerSideURL } from './getURL'

export function getSiteStructuredData() {
  const serverUrl = getServerSideURL()

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_FULL_NAME,
      url: serverUrl,
      description: SITE_DESCRIPTION,
      inLanguage: 'zh-TW',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_FULL_NAME,
      url: serverUrl,
      logo: `${serverUrl}${ICON_PATH}`,
      founder: {
        '@type': 'Person',
        name: SITE_AUTHOR,
      },
    },
  ]
}

type FaqItem = { question: string; answer: string }

export function getFaqStructuredData(items: FaqItem[]) {
  const validItems = items.filter((item) => item.question?.trim() && item.answer?.trim())
  if (!validItems.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validItems.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function getPostStructuredData(post: Post, ogImage?: string) {
  const serverUrl = getServerSideURL()
  const slug = typeof post.slug === 'string' ? post.slug : ''
  const image = ogImage ?? `${serverUrl}${DEFAULT_OG_PATH}`

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: post.meta?.title || post.title,
    description: post.meta?.description ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? undefined,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR,
    },
    image,
    url: `${serverUrl}/posts/${slug}`,
    inLanguage: 'zh-TW',
  }
}

export function getPostStructuredDataBundle(post: Post, ogImage?: string) {
  const schemas: Record<string, unknown>[] = [getPostStructuredData(post, ogImage)]
  const faq = getFaqStructuredData(post.faq ?? [])
  if (faq) schemas.push(faq)
  return schemas
}
