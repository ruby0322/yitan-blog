import type { Metadata } from 'next/types'

import { PostsArchiveLayout } from '@/components/PostsArchiveLayout'
import {
  getCategorySeoDescription,
  getCategorySeoTitle,
  POSTS_ARCHIVE_SEO,
} from '@/constants/seo'
import { buildMetadata } from '@/utilities/buildMetadata'
import { queryCategoriesWithPostCounts, queryPosts } from '@/utilities/queryPosts'
import { querySearchPosts } from '@/utilities/querySearch'
import { notFound } from 'next/navigation'
import React from 'react'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category: categorySlug, q: query = '' } = await searchParamsPromise
  const trimmedQuery = query.trim()
  const { categories, totalPostCount } = await queryCategoriesWithPostCounts()

  if (trimmedQuery) {
    const { category, notFound: searchNotFound, posts } = await querySearchPosts({
      categorySlug,
      page: 1,
      q: trimmedQuery,
    })

    if (searchNotFound || !posts) {
      notFound()
    }

    return (
      <PostsArchiveLayout
        categories={categories}
        category={category}
        categorySlug={categorySlug}
        pageClient={<PageClient />}
        posts={posts}
        query={trimmedQuery}
        totalPostCount={totalPostCount}
      />
    )
  }

  const [{ category, notFound: categoryNotFound, posts }] = await Promise.all([
    queryPosts({
      categorySlug,
      page: 1,
    }),
  ])

  if (categoryNotFound || !posts) {
    notFound()
  }

  return (
    <PostsArchiveLayout
      categories={categories}
      category={category}
      categorySlug={categorySlug}
      pageClient={<PageClient />}
      posts={posts}
      totalPostCount={totalPostCount}
    />
  )
}

export async function generateMetadata({
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { category: categorySlug, q: query = '' } = await searchParamsPromise
  const trimmedQuery = query.trim()

  if (trimmedQuery) {
    const params = new URLSearchParams({ q: trimmedQuery })
    if (categorySlug) {
      params.set('category', categorySlug)
    }

    return buildMetadata({
      title: `搜尋「${trimmedQuery}」| 部落格`,
      description: `在胰探究竟搜尋「${trimmedQuery}」相關的胰臟衛教文章。`,
      path: `/posts?${params.toString()}`,
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
        path: '/posts',
      })
    }

    return buildMetadata({
      title: getCategorySeoTitle(category.title),
      description: getCategorySeoDescription(category.title, category.description),
      path: `/posts?category=${encodeURIComponent(categorySlug)}`,
      keywords: [category.title, '胰臟', '章明珠醫師'],
    })
  }

  return buildMetadata({
    title: POSTS_ARCHIVE_SEO.title,
    description: POSTS_ARCHIVE_SEO.description,
    path: '/posts',
  })
}
