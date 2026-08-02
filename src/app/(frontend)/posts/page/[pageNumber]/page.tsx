import type { Metadata } from 'next/types'

import { PostsArchiveLayout } from '@/components/PostsArchiveLayout'
import { POSTS_PER_PAGE } from '@/constants/posts'
import { buildMetadata } from '@/utilities/buildMetadata'
import { formatCategoryTitles } from '@/utilities/categoryOrder'
import { queryAllCategories, queryPosts } from '@/utilities/queryPosts'
import { querySearchPosts } from '@/utilities/querySearch'
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
    q?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const { category: categorySlug, q: query = '' } = await searchParamsPromise
  const sanitizedPageNumber = Number(pageNumber)
  const trimmedQuery = query.trim()

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const categories = await queryAllCategories()

  if (trimmedQuery) {
    const { category, notFound: searchNotFound, posts } = await querySearchPosts({
      categorySlug,
      page: sanitizedPageNumber,
      q: trimmedQuery,
    })

    if (searchNotFound || !posts) {
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
        query={trimmedQuery}
      />
    )
  }

  const [{ category, notFound: categoryNotFound, posts }] = await Promise.all([
    queryPosts({
      categorySlug,
      page: sanitizedPageNumber,
    }),
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
  const { category: categorySlug, q: query = '' } = await searchParamsPromise
  const pageNum = Number(pageNumber)
  const trimmedQuery = query.trim()
  const noIndex = pageNum > 1

  if (trimmedQuery) {
    const params = new URLSearchParams({ q: trimmedQuery })
    if (categorySlug) {
      params.set('category', categorySlug)
    }

    return buildMetadata({
      title: `搜尋「${trimmedQuery}」| 部落格 - 第 ${pageNumber} 頁`,
      description: `在胰探究竟搜尋「${trimmedQuery}」相關的胰臟衛教文章。`,
      path: `/posts/page/${pageNumber}?${params.toString()}`,
      noIndex: true,
    })
  }

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
    description: `閱讀胰探究竟的最新文章，了解${formatCategoryTitles(await queryAllCategories())}等主題。`,
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
