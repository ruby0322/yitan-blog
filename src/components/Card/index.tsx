'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { CategoryBadge } from '@/components/CategoryBadge'
import { ReadMoreLink } from '@/components/theme/read-more-link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getPopulatedCategories, sortCategoriesByOrder } from '@/utilities/categoryOrder'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  featured?: boolean
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const {
    className,
    doc,
    featured = false,
    relationTo,
    showCategories,
    title: titleFromProps,
  } = props

  const { slug, categories, meta, title, publishedAt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const sortedCategories = sortCategoriesByOrder(getPopulatedCategories(categories))

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-md border border-border bg-card shadow-none hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-brand-card">
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            resource={metaImage}
            size={featured ? '50vw' : '33vw'}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-subtitle">
            暫無圖片
          </div>
        )}
      </div>
      <div className={cn('p-4', featured && 'p-6')}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {showCategories &&
            sortedCategories.map((category) =>
              category.title ? <CategoryBadge key={category.title} label={category.title} /> : null,
            )}
          {publishedAt && (
            <time className="text-xs text-brand-sage" dateTime={publishedAt}>
              {formatDateTime(publishedAt)}
            </time>
          )}
        </div>
        {titleToUse && (
          <h3
            className={cn(
              'font-serif font-semibold text-brand-heading',
              featured ? 'text-xl md:text-2xl' : 'text-lg',
            )}
          >
            <Link className="hover:text-brand-cta" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {description && (
          <p
            className={cn(
              'mt-2 text-brand-body leading-relaxed',
              featured ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm',
            )}
          >
            {sanitizedDescription}
          </p>
        )}
        {slug && (
          <div className="mt-4">
            <ReadMoreLink href={href} />
          </div>
        )}
      </div>
    </article>
  )
}
