import RichText from '@/components/RichText'
import { BodyText, SectionHeading } from '@/components/theme/typography'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { Post } from '@/payload-types'

import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { Card } from '../../components/Card'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  if (!docs?.length) return null

  return (
    <section className={cn('mt-12 w-full border-t border-brand-border pt-12', className)}>
      <div className="mb-8">
        <SectionHeading as="h2" className="text-brand-heading">
          相關文章
        </SectionHeading>
        <BodyText className="mt-2 text-sm md:text-base">
          延伸閱讀主題相近的文章，協助您更完整理解相關知識。
        </BodyText>
      </div>

      {introContent && <RichText className="mb-8" data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {docs.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </section>
  )
}
