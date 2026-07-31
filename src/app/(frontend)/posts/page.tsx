import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PostsPageHeader } from '@/components/PostsPageHeader'
import { TOPIC_CATEGORIES_DESCRIPTION } from '@/constants/categories'
import { queryPosts } from '@/utilities/queryPosts'
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
  const { category, notFound: categoryNotFound, posts } = await queryPosts({
    categorySlug,
    page: 1,
  })

  if (categoryNotFound || !posts) {
    notFound()
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <PostsPageHeader
        categoryDescription={category?.description}
        categoryTitle={category?.title}
        totalDocs={posts.totalDocs}
      />

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
            {posts.totalPages > 1 && posts.page && (
              <Pagination categorySlug={categorySlug} page={posts.page} totalPages={posts.totalPages} />
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
      return {
        title: '找不到分類',
      }
    }

    return {
      title: `${category.title} | 部落格`,
      description: category.description || `閱讀「${category.title}」主題文章，了解胰臟相關資訊。`,
    }
  }

  return {
    title: '部落格',
    description: `閱讀胰探究竟的最新文章，了解${TOPIC_CATEGORIES_DESCRIPTION}等主題。`,
  }
}
