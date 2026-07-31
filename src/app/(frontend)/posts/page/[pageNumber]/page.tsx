import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PostsPageHeader } from '@/components/PostsPageHeader'
import { POSTS_PER_PAGE } from '@/constants/posts'
import { TOPIC_CATEGORIES_DESCRIPTION } from '@/constants/categories'
import { queryPosts } from '@/utilities/queryPosts'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
  searchParams: Promise<{
    category?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const { category: categorySlug } = await searchParamsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const { category, notFound: categoryNotFound, posts } = await queryPosts({
    categorySlug,
    page: sanitizedPageNumber,
  })

  if (categoryNotFound || !posts) {
    notFound()
  }

  if (sanitizedPageNumber > posts.totalPages) notFound()

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <PostsPageHeader categoryTitle={category?.title} totalDocs={posts.totalDocs} />

      {posts.totalDocs > 0 ? (
        <>
          <div className="container mb-8">
            <PageRange
              collection="posts"
              collectionLabels={{
                plural: '篇文章',
                singular: '篇文章',
              }}
              currentPage={posts.page}
              limit={posts.limit}
              totalDocs={posts.totalDocs}
            />
          </div>

          <CollectionArchive posts={posts.docs} />

          <div className="container">
            {posts?.page && posts?.totalPages > 1 && (
              <Pagination
                categorySlug={categorySlug}
                page={posts.page}
                totalPages={posts.totalPages}
              />
            )}
          </div>
        </>
      ) : (
        <div className="container">
          <p className="text-muted-foreground">此主題目前尚無文章，請稍後再來看看。</p>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const { category: categorySlug } = await searchParamsPromise

  if (categorySlug) {
    const { category, notFound: categoryNotFound } = await queryPosts({
      categorySlug,
      limit: 1,
      page: 1,
    })

    if (categoryNotFound || !category) {
      return {
        title: '找不到分類',
      }
    }

    return {
      title: `${category.title} | 部落格 - 第 ${pageNumber} 頁`,
      description: `閱讀「${category.title}」主題文章，了解胰臟相關的${category.title}資訊。`,
    }
  }

  return {
    title: `部落格 - 第 ${pageNumber} 頁`,
    description: `閱讀胰探究竟的最新文章，了解${TOPIC_CATEGORIES_DESCRIPTION}等主題。`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / POSTS_PER_PAGE)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
