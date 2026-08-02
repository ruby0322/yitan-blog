import { formatDateTime } from '@/utilities/formatDateTime'
import { formatCategoryTitles, getPopulatedCategories } from '@/utilities/categoryOrder'
import React from 'react'

import type { Post } from '@/payload-types'

import { CategoryLabelTooltip } from '@/components/theme/category-label-tooltip'

const CATEGORY_SEPARATOR = ' · '
const MAX_VISIBLE_CATEGORIES = 3

type ArticleCardMetaProps = {
  categories?: Post['categories']
  publishedAt?: string | null
  showCategories?: boolean
}

export const ArticleCardMeta: React.FC<ArticleCardMetaProps> = ({
  categories,
  publishedAt,
  showCategories = true,
}) => {
  const populatedCategories = getPopulatedCategories(categories)
  const categoryLabel = showCategories
    ? formatCategoryTitles(populatedCategories, CATEGORY_SEPARATOR, MAX_VISIBLE_CATEGORIES)
    : ''
  const fullCategoryLabel = showCategories
    ? formatCategoryTitles(populatedCategories, CATEGORY_SEPARATOR)
    : ''
  const isCategoryTruncated = categoryLabel !== fullCategoryLabel

  if (!publishedAt && !categoryLabel) {
    return null
  }

  return (
    <div className="mb-3 text-xs font-medium text-brand-sage">
      {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
      {publishedAt && categoryLabel && (
        <span aria-hidden className="mx-2 font-normal">
          ｜
        </span>
      )}
      {categoryLabel && (
        <CategoryLabelTooltip
          displayLabel={categoryLabel}
          fullLabel={fullCategoryLabel}
          showTooltip={isCategoryTruncated}
        />
      )}
    </div>
  )
}
