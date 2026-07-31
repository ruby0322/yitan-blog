import type { Metadata } from 'next/types'

import { PostsArchiveLayout } from '@/components/PostsArchiveLayout'
import { TOPIC_CATEGORIES_DESCRIPTION } from '@/constants/categories'
import { buildMetadata } from '@/utilities/buildMetadata'
import { queryAllCategories, queryPosts } from '@/utilities/queryPosts'
import { notFound } from 'next/navigation'
import React from 'react'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category: categorySlug } = await searchParamsPromise
  const [{ category, notFound: categoryNotFound, posts }, categories] = await Promise.all([
    queryPosts({
      categorySlug,
      page: 1,
    }),
    queryAllCategories(),
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
    />
  )
}

export async function generateMetadata({
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { category: categorySlug } = await searchParamsPromise

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
      title: `${category.title} | 部落格`,
      description:
        category.description || `閱讀「${category.title}」主題文章，了解胰臟相關資訊。`,
      path: `/posts?category=${encodeURIComponent(categorySlug)}`,
    })
  }

  return buildMetadata({
    title: '部落格',
    description: `閱讀胰探究竟的最新文章，了解${TOPIC_CATEGORIES_DESCRIPTION}等主題。`,
    path: '/posts',
  })
}
