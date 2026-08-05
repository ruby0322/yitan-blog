import {
  DEFAULT_OG_PATH,
  ICON_PATH,
  SITE_AUTHOR,
  SITE_AUTHOR_ALIASES,
  SITE_DESCRIPTION,
  SITE_FULL_NAME,
  SITE_NAME,
} from '@/constants/site'
import type { Post } from '@/payload-types'
import { getServerSideURL } from './getURL'

const AUTHOR_KNOWS_ABOUT = [
  '胰臟',
  '胰臟癌',
  '胰臟癌篩檢',
  '慢性胰臟炎',
  '胰臟囊腫',
  '胰臟水泡',
  '胰臟健康',
] as const

export function getAuthorStructuredData() {
  const serverUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: SITE_AUTHOR,
    alternateName: [...SITE_AUTHOR_ALIASES],
    jobTitle: '台大醫院內科部主治醫師',
    description:
      '台灣胰臟癌篩檢權威，近 30 年專注胰臟疾病臨床、研究與教學，創立胰臟衛教網站「胰探究竟」。',
    url: `${serverUrl}/about`,
    knowsAbout: [...AUTHOR_KNOWS_ABOUT],
    worksFor: {
      '@type': 'Organization',
      name: '台大醫院',
    },
  }
}

export function getSiteStructuredData() {
  const serverUrl = getServerSideURL()
  const author = getAuthorStructuredData()

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_FULL_NAME,
      alternateName: SITE_NAME,
      url: serverUrl,
      description: SITE_DESCRIPTION,
      inLanguage: 'zh-TW',
      author: {
        '@type': 'Person',
        name: SITE_AUTHOR,
        alternateName: [...SITE_AUTHOR_ALIASES],
        url: `${serverUrl}/about`,
      },
      about: {
        '@type': 'MedicalSpecialty',
        name: '胰臟疾病',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: SITE_FULL_NAME,
      url: serverUrl,
      logo: `${serverUrl}${ICON_PATH}`,
      description: SITE_DESCRIPTION,
      founder: {
        '@type': 'Person',
        name: SITE_AUTHOR,
        alternateName: [...SITE_AUTHOR_ALIASES],
      },
    },
    author,
  ]
}

export function getAboutStructuredData() {
  return getAuthorStructuredData()
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
      alternateName: [...SITE_AUTHOR_ALIASES],
      url: `${serverUrl}/about`,
    },
    image,
    url: `${serverUrl}/posts/${slug}`,
    inLanguage: 'zh-TW',
    about: {
      '@type': 'MedicalCondition',
      name: '胰臟疾病',
    },
  }
}

export function getPostStructuredDataBundle(post: Post, ogImage?: string) {
  const schemas: Record<string, unknown>[] = [getPostStructuredData(post, ogImage)]
  const faq = getFaqStructuredData(post.faq ?? [])
  if (faq) schemas.push(faq)
  return schemas
}
