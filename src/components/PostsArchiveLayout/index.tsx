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
import { formatCategoryTitles } from '@/utilities/categoryOrder'

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
  query?: string
  totalPostCount: number
}

export const PostsArchiveLayout: React.FC<Props> = ({
  categories,
  category,
  categorySlug,
  pageClient,
  posts,
  query,
  totalPostCount,
}) => {
  const isSearching = Boolean(query)
  const categoryTitlesDescription = formatCategoryTitles(categories)

  return (
    <article className="bg-brand-warm-white pb-16 pt-12 md:pt-20">
      {pageClient}
      <PostsPageHeader
        categoryDescription={category?.description}
        categoryTitle={category?.title}
        categoryTitlesDescription={categoryTitlesDescription}
        query={query}
        totalDocs={posts.totalDocs}
      />
      <PostsToolbar
        activeCategorySlug={categorySlug}
        categories={categories}
        initialQuery={query}
        totalPostCount={totalPostCount}
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

          <div className="container mt-12">
            {posts.totalPages > 1 && posts.page && (
              <Pagination
                categorySlug={categorySlug ?? undefined}
                page={posts.page}
                query={query}
                totalPages={posts.totalPages}
              />
            )}
          </div>
        </>
      ) : (
        <div className="container">
          <BodyText>
            {isSearching
              ? `找不到與「${query}」相關的文章，請試試其他關鍵字。`
              : '此主題目前尚無文章，請稍後再來看看。'}
          </BodyText>
        </div>
      )}
    </article>
  )
}
