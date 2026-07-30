import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { ArticleCard, ReadMoreLink, SectionHeader, themeRichTextClassName } from '@/components/theme'
import { Section } from '@/components/theme/section'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    categories,
    heading,
    introContent,
    limit: limitFromProps,
    populateBy,
    sectionNumber,
    selectedDocs,
  } = props

  const limit = limitFromProps || 6

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      sort: '-publishedAt',
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  if (posts.length === 0) return null

  return (
    <Section spacing="default" variant="default">
      <div className="container">
        <SectionHeader heading={heading || '最新文章'} sectionNumber={sectionNumber} />

        {introContent && (
          <div className="mb-8 max-w-3xl">
            <RichText
              className={themeRichTextClassName}
              data={introContent}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard doc={post} key={post.id} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <ReadMoreLink href="/posts" label="查看全部文章" />
        </div>
      </div>
    </Section>
  )
}
