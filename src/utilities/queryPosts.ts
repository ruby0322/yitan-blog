import type { Category, Post } from '@/payload-types'

import { POSTS_PER_PAGE } from '@/constants/posts'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type PostListItem = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt'>

type CategoryListItem = Pick<Category, 'title' | 'slug' | 'sortOrder'>

export type CategoryFilterItem = CategoryListItem & {
  postCount: number
}

export async function queryAllCategories(): Promise<CategoryListItem[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    sort: 'sortOrder',
    select: {
      title: true,
      slug: true,
      sortOrder: true,
    },
  })

  return result.docs
}

export async function queryCategoriesWithPostCounts(): Promise<{
  categories: CategoryFilterItem[]
  totalPostCount: number
}> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    sort: 'sortOrder',
    select: {
      id: true,
      title: true,
      slug: true,
      sortOrder: true,
    },
  })

  const [totalPostCount, ...categoryCounts] = await Promise.all([
    payload.count({
      collection: 'posts',
      overrideAccess: false,
    }),
    ...result.docs.map((category) =>
      payload.count({
        collection: 'posts',
        overrideAccess: false,
        where: {
          categories: {
            contains: category.id,
          },
        },
      }),
    ),
  ])

  return {
    totalPostCount: totalPostCount.totalDocs,
    categories: result.docs.map((category, index) => ({
      title: category.title,
      slug: category.slug,
      sortOrder: category.sortOrder,
      postCount: categoryCounts[index]?.totalDocs ?? 0,
    })),
  }
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0] ?? null
}

type QueryPostsArgs = {
  categorySlug?: string | null
  limit?: number
  page?: number
}

type QueryPostsResult = {
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

export async function queryPosts({
  categorySlug,
  limit = POSTS_PER_PAGE,
  page = 1,
}: QueryPostsArgs): Promise<QueryPostsResult> {
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
    collection: 'posts',
    depth: 1,
    limit,
    overrideAccess: false,
    page,
    sort: '-publishedAt',
    ...(category
      ? {
          where: {
            categories: {
              contains: category.id,
            },
          },
        }
      : {}),
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
  })

  return {
    category,
    notFound: false,
    posts,
  }
}

type CategoryTopicPreviewArgs = {
  categoryId?: number
  categorySlug?: string
  limit?: number
}

export async function getCategoryTopicPreviews({
  categoryId,
  categorySlug,
  limit = 3,
}: CategoryTopicPreviewArgs): Promise<{
  category: Category | null
  posts: PostListItem[]
}> {
  const payload = await getPayload({ config: configPromise })

  let category: Category | null = null

  if (categoryId) {
    const result = await payload.find({
      collection: 'categories',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      where: {
        id: {
          equals: categoryId,
        },
      },
    })
    category = result.docs[0] ?? null
  } else if (categorySlug) {
    category = await findCategoryBySlug(categorySlug)
  }

  if (!category) {
    return { category: null, posts: [] }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      categories: {
        contains: category.id,
      },
    },
    select: {
      title: true,
      slug: true,
      publishedAt: true,
    },
  })

  return {
    category,
    posts: posts.docs,
  }
}
