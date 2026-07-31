import type { Category } from '@/payload-types'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PostsPageHeader } from '@/components/PostsPageHeader'
import type { CategoryFilterItem } from '@/components/PostsCategoryFilter'
import { PostsToolbar } from '@/components/PostsToolbar'
import { BodyText } from '@/components/theme'
import type { ArticleCardPostData } from '@/components/theme'

type PostsResult = {
  docs: ArticleCardPostData[]
  limit: number
  page?: number
  totalDocs: number
  totalPages: number
}

type Props = {
  categories: CategoryFilterItem[]
  category?: Category | null
  categorySlug?: string | null
  pageClient: React.ReactNode
  posts: PostsResult
}

export const PostsArchiveLayout: React.FC<Props> = ({
  categories,
  category,
  categorySlug,
  pageClient,
  posts,
}) => {
  return (
    <article className="bg-brand-warm-white pb-16 pt-24">
      {pageClient}
      <PostsPageHeader
        categoryDescription={category?.description}
        categoryTitle={category?.title}
        totalDocs={posts.totalDocs}
      />
      <PostsToolbar activeCategorySlug={categorySlug} categories={categories} />

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

          <div className="container mt-12">
            {posts.totalPages > 1 && posts.page && (
              <Pagination
                categorySlug={categorySlug ?? undefined}
                page={posts.page}
                totalPages={posts.totalPages}
              />
            )}
          </div>
        </>
      ) : (
        <div className="container">
          <BodyText>此主題目前尚無文章，請稍後再來看看。</BodyText>
        </div>
      )}
    </article>
  )
}
