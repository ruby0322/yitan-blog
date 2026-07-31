import { ReadMoreLink } from '@/components/theme'
import React from 'react'

import { TOPIC_CATEGORIES_DESCRIPTION } from '@/constants/categories'

type Props = {
  categoryDescription?: string | null
  categoryTitle?: string | null
  totalDocs?: number
}

export const PostsPageHeader: React.FC<Props> = ({
  categoryDescription,
  categoryTitle,
  totalDocs,
}) => {
  const isFiltered = Boolean(categoryTitle)

  return (
    <div className="container mb-16">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">胰探究竟</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {isFiltered ? categoryTitle : '部落格'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isFiltered
            ? categoryDescription || `依「${categoryTitle}」主題整理的文章。`
            : `以臨床經驗與醫學證據整理胰臟相關知識，包含${TOPIC_CATEGORIES_DESCRIPTION}。`}
        </p>
        {typeof totalDocs === 'number' && (
          <p className="mt-4 text-sm text-muted-foreground">
            {isFiltered ? `${categoryTitle} · ` : ''}
            {totalDocs > 0 ? `目前共 ${totalDocs} 篇文章` : '目前尚無文章'}
          </p>
        )}
        {isFiltered ? (
          <div className="mt-6">
            <ReadMoreLink href="/posts" label="查看全部文章" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
