import { CategoryBadge } from '@/components/CategoryBadge'
import { Media } from '@/components/Media'
import { ReadMoreLink } from '@/components/theme/read-more-link'
import { cn } from '@/utilities/ui'
import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

export type ArticleCardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt'>

type ArticleCardProps = {
  className?: string
  doc?: ArticleCardPostData
  featured?: boolean
  href?: string
  relationTo?: 'posts'
  showCategories?: boolean
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  className,
  doc,
  featured = false,
  href: hrefFromProps,
  relationTo = 'posts',
  showCategories = true,
}) => {
  const { slug, categories, meta, title, publishedAt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const primaryCategory =
    categories && Array.isArray(categories) && categories.length > 0
      ? categories.find((category) => typeof category === 'object')?.title
      : undefined

  const href = hrefFromProps ?? `/${relationTo}/${slug}`
  const sanitizedDescription = description?.replace(/\s/g, ' ')

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-md border border-border bg-card shadow-none',
        className,
      )}
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
          {showCategories && primaryCategory && <CategoryBadge label={primaryCategory} />}
          {publishedAt && (
            <time className="text-xs text-brand-sage" dateTime={publishedAt}>
              {formatDateTime(publishedAt)}
            </time>
          )}
        </div>
        {title && (
          <h3
            className={cn(
              'font-serif font-semibold text-brand-heading',
              featured ? 'text-xl md:text-2xl' : 'text-lg',
            )}
          >
            {title}
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
