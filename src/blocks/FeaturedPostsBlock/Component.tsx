import React from 'react'

import type { FeaturedPostsBlock as FeaturedPostsBlockProps, Post } from '@/payload-types'

import { ArticleCard, ReadMoreLink, SectionHeader } from '@/components/theme'
import { Section } from '@/components/theme/section'

export const FeaturedPostsBlockComponent: React.FC<FeaturedPostsBlockProps> = ({
  heading,
  posts,
  sectionNumber,
}) => {
  const resolvedPosts = (posts || []).filter(
    (post): post is Post => typeof post === 'object' && post !== null,
  )

  if (resolvedPosts.length === 0) return null

  return (
    <Section spacing="default" variant="default">
      <div className="container">
        <SectionHeader heading={heading || '本期精選'} sectionNumber={sectionNumber} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resolvedPosts.map((post) => (
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
