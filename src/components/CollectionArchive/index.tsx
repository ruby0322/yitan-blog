import { cn } from '@/utilities/ui'
import React from 'react'

import { ArticleCard, type ArticleCardPostData } from '@/components/theme'

export type Props = {
  posts: ArticleCardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <ArticleCard
                className="h-full"
                doc={result}
                key={result.slug ?? index}
                relationTo="posts"
                showCategories
              />
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
