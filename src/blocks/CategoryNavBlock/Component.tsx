import React from 'react'

import type { Category, CategoryNavBlock as CategoryNavBlockProps } from '@/payload-types'

import { CategoryNavCarousel } from '@/blocks/CategoryNavBlock/CategoryNavCarousel'
import type { CategoryTopicSlide } from '@/blocks/CategoryNavBlock/types'
import { SectionHeader } from '@/components/theme'
import { Section } from '@/components/theme/section'
import { postsCategoryUrl } from '@/constants/categories'
import { getCategoryTopicPreviews } from '@/utilities/queryPosts'

function resolveHref(link?: CategoryNavBlockProps['items'][0]['link']): string | null {
  if (!link) return null

  if (link.type === 'custom' && link.url) {
    return link.url
  }

  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value.slug
  ) {
    const prefix = link.reference.relationTo === 'pages' ? '' : `/${link.reference.relationTo}`
    return `${prefix}/${link.reference.value.slug}`
  }

  return null
}

function resolveCategory(item: CategoryNavBlockProps['items'][0]): Category | null {
  if (typeof item.category === 'object' && item.category !== null) {
    return item.category
  }

  return null
}

export const CategoryNavBlockComponent = async ({
  heading,
  items,
  sectionNumber,
}: CategoryNavBlockProps) => {
  if (!items || items.length === 0) return null

  const slides: CategoryTopicSlide[] = await Promise.all(
    items.map(async (item) => {
      const category = resolveCategory(item)
      const categoryId = typeof item.category === 'number' ? item.category : category?.id
      const { category: resolvedCategory, posts } = await getCategoryTopicPreviews({
        categoryId,
        categorySlug: category?.slug,
        limit: 3,
      })

      const slug = resolvedCategory?.slug ?? category?.slug
      const href =
        resolveHref(item.link) ?? (slug ? postsCategoryUrl(slug) : null) ?? '/posts'

      return {
        title: item.title,
        description:
          resolvedCategory?.description ?? category?.description ?? '依此主題閱讀相關文章。',
        href,
        posts: posts.map((post) => ({
          title: post.title,
          slug: post.slug,
          publishedAt: post.publishedAt,
        })),
      }
    }),
  )

  return (
    <Section spacing="default" variant="default">
      <div className="container">
        <SectionHeader heading={heading || '依主題閱讀'} sectionNumber={sectionNumber} />
        <CategoryNavCarousel slides={slides} />
      </div>
    </Section>
  )
}
