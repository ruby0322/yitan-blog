import React from 'react'

import type { CategoryFilterItem } from '@/components/PostsCategoryFilter'
import { PostsCategoryFilter } from '@/components/PostsCategoryFilter'
import { PostsSearchInput } from '@/components/PostsSearchInput'

type Props = {
  activeCategorySlug?: string | null
  categories: CategoryFilterItem[]
}

export const PostsToolbar: React.FC<Props> = ({ activeCategorySlug, categories }) => {
  return (
    <div className="container space-y-6 py-8 md:py-10">
      <PostsCategoryFilter activeSlug={activeCategorySlug} categories={categories} />
      <PostsSearchInput />
    </div>
  )
}
