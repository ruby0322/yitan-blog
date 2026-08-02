import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { Caption } from '@/components/theme/typography'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatCategoryTitles, getPopulatedCategories } from '@/utilities/categoryOrder'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, excerpt, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''
  const categoryLabel = formatCategoryTitles(getPopulatedCategories(categories), ' · ')

  return (
    <header className="border-b border-brand-border bg-brand-warm-white pt-8 md:pt-12">
      <div className="container">
        <div className="mx-auto w-full max-w-[48rem]">
          {categoryLabel ? (
            <Caption className="mb-4 block uppercase tracking-[0.14em]">{categoryLabel}</Caption>
          ) : null}

          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] tracking-wide text-brand-heading md:text-4xl md:leading-[1.15]">
            {title}
          </h1>

          {heroImage && typeof heroImage !== 'string' && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden bg-brand-card">
              <Media fill priority imgClassName="object-cover" resource={heroImage} />
            </div>
          )}

          {excerpt && (
            <p className="mt-4 font-serif text-base leading-relaxed tracking-wide text-brand-body md:text-lg md:leading-loose">
              {excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 border-b border-brand-border pb-8 font-sans text-sm text-brand-body md:flex-row md:gap-10">
            {hasAuthors && (
              <div>
                <Caption as="span">作者</Caption>
                <span className="mx-2">·</span>
                <span>{formatAuthors(populatedAuthors)}</span>
              </div>
            )}
            {publishedAt && (
              <div>
                <Caption as="span">發布日期</Caption>
                <span className="mx-2">·</span>
                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
