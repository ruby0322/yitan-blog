import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { SearchPageHeader } from '@/components/SearchPageHeader'
import { BodyText } from '@/components/theme'
import type { ArticleCardPostData } from '@/components/theme'
import { Search } from '@/search/Component'
import { buildMetadata } from '@/utilities/buildMetadata'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import PageClient from './page.client'

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query = '' } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <article className="bg-brand-warm-white pb-16 pt-24">
      <PageClient />
      <SearchPageHeader />

      <div className="container py-8 md:py-10">
        <Search initialValue={query} />
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as ArticleCardPostData[]} />
      ) : (
        <div className="container">
          <BodyText>
            {query ? `找不到與「${query}」相關的文章，請試試其他關鍵字。` : '請輸入關鍵字開始搜尋。'}
          </BodyText>
        </div>
      )}
    </article>
  )
}

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: '搜尋',
    description: '在胰探究竟搜尋胰臟相關衛教文章，包含基礎知識、胰臟癌、胰臟發炎、飲食保健與健檢判讀等主題。',
    path: '/search',
    noIndex: true,
  })
}
