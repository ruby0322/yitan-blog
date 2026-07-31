import type { Category, Post } from '@/payload-types'

import { POSTS_PER_PAGE } from '@/constants/posts'
import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'

import { findCategoryBySlug } from './queryPosts'

type PostListItem = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt'>

type QuerySearchPostsArgs = {
  categorySlug?: string | null
  limit?: number
  page?: number
  q: string
}

type QuerySearchPostsResult = {
  category: Category | null
  notFound: boolean
  posts: {
    docs: PostListItem[]
    limit: number
    page?: number
    totalDocs: number
    totalPages: number
  } | null
}

function buildSearchWhere(query: string, categoryId?: number): Where {
  const textFilter: Where = {
    or: [
      { title: { like: query } },
      { 'meta.description': { like: query } },
      { 'meta.title': { like: query } },
      { slug: { like: query } },
    ],
  }

  if (!categoryId) {
    return textFilter
  }

  return {
    and: [
      textFilter,
      {
        'categories.categoryID': {
          equals: String(categoryId),
        },
      },
    ],
  }
}

export async function querySearchPosts({
  categorySlug,
  limit = POSTS_PER_PAGE,
  page = 1,
  q,
}: QuerySearchPostsArgs): Promise<QuerySearchPostsResult> {
  const trimmedQuery = q.trim()

  if (!trimmedQuery) {
    return {
      category: null,
      notFound: false,
      posts: null,
    }
  }

  const payload = await getPayload({ config: configPromise })

  let category: Category | null = null

  if (categorySlug) {
    category = await findCategoryBySlug(categorySlug)

    if (!category) {
      return {
        category: null,
        notFound: true,
        posts: null,
      }
    }
  }

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit,
    page,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
    where: buildSearchWhere(trimmedQuery, category?.id),
  })

  return {
    category,
    notFound: false,
    posts: {
      docs: posts.docs as PostListItem[],
      limit: posts.limit,
      page: posts.page,
      totalDocs: posts.totalDocs,
      totalPages: posts.totalPages,
    },
  }
}
