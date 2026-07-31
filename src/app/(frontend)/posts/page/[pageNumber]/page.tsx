import type { Metadata } from 'next/types'

import { PostsArchiveLayout } from '@/components/PostsArchiveLayout'
import { POSTS_PER_PAGE } from '@/constants/posts'
import { TOPIC_CATEGORIES_DESCRIPTION } from '@/constants/categories'
import { buildMetadata } from '@/utilities/buildMetadata'
import { queryAllCategories, queryPosts } from '@/utilities/queryPosts'
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

  const [{ category, notFound: categoryNotFound, posts }, categories] = await Promise.all([
    queryPosts({
      categorySlug,
      page: sanitizedPageNumber,
    }),
    queryAllCategories(),
  ])

  if (categoryNotFound || !posts) {
    notFound()
  }

  if (sanitizedPageNumber > posts.totalPages) notFound()

  return (
    <PostsArchiveLayout
      categories={categories}
      category={category}
      categorySlug={categorySlug}
      pageClient={<PageClient />}
      posts={posts}
    />
  )
}

export async function generateMetadata({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const { category: categorySlug } = await searchParamsPromise
  const pageNum = Number(pageNumber)
  const noIndex = pageNum > 1

  if (categorySlug) {
    const { category, notFound: categoryNotFound } = await queryPosts({
      categorySlug,
      limit: 1,
      page: 1,
    })

    if (categoryNotFound || !category) {
      return buildMetadata({
        title: '找不到分類',
        path: `/posts/page/${pageNumber}`,
        noIndex,
      })
    }

    return buildMetadata({
      title: `${category.title} | 部落格 - 第 ${pageNumber} 頁`,
      description:
        category.description || `閱讀「${category.title}」主題文章，了解胰臟相關資訊。`,
      path: `/posts/page/${pageNumber}?category=${encodeURIComponent(categorySlug)}`,
      noIndex,
    })
  }

  return buildMetadata({
    title: `部落格 - 第 ${pageNumber} 頁`,
    description: `閱讀胰探究竟的最新文章，了解${TOPIC_CATEGORIES_DESCRIPTION}等主題。`,
    path: `/posts/page/${pageNumber}`,
    noIndex,
  })
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
