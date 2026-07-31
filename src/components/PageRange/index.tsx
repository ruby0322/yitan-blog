import { cn } from '@/utilities/ui'
import React from 'react'

const defaultLabels = {
  plural: 'Docs',
  singular: 'Doc',
}

const defaultCollectionLabels = {
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
}

export const PageRange: React.FC<{
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const { plural, singular } =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabels[collection] : undefined) ||
    defaultLabels ||
    {}

  return (
    <p
      className={cn(
        'font-sans text-sm text-brand-body',
        className,
      )}
    >
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && '找不到符合條件的文章。'}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        `顯示第 ${indexStart}${indexStart > 0 ? ` - ${indexEnd}` : ''} 篇，共 ${totalDocs} ${
          totalDocs > 1 ? plural : singular
        }`}
    </p>
  )
}
