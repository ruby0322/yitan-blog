'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { CategoryBadge } from '@/components/CategoryBadge'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

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

  const primaryCategory =
    categories && Array.isArray(categories) && categories.length > 0
      ? categories.find((category) => typeof category === 'object')?.title
      : undefined

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md',
        featured ? 'hover:cursor-pointer' : 'hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className={cn('relative w-full overflow-hidden bg-muted', featured ? 'aspect-[16/10]' : 'aspect-video')}>
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            resource={metaImage}
            size={featured ? '50vw' : '33vw'}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">暫無圖片</div>
        )}
      </div>
      <div className={cn('p-4', featured && 'p-6')}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {showCategories && primaryCategory && <CategoryBadge label={primaryCategory} />}
          {publishedAt && (
            <time className="text-xs text-muted-foreground" dateTime={publishedAt}>
              {formatDateTime(publishedAt)}
            </time>
          )}
        </div>
        {titleToUse && (
          <div className="prose dark:prose-invert">
            <h3 className={cn('not-prose font-semibold text-foreground', featured ? 'text-xl md:text-2xl' : 'text-lg')}>
              <Link className="hover:text-primary" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <div className="mt-2">
            <p className={cn('text-muted-foreground', featured ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm')}>
              {sanitizedDescription}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
