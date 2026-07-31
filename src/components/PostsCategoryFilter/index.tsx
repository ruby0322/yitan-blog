'use client'

import Link from 'next/link'
import React from 'react'

import { buildPostsPagePath } from '@/utilities/buildPostsPagePath'
import { cn } from '@/utilities/ui'

export type CategoryFilterItem = {
  slug: string
  title: string
}

type Props = {
  activeSlug?: string | null
  categories: CategoryFilterItem[]
  query?: string
}

export const PostsCategoryFilter: React.FC<Props> = ({ activeSlug, categories, query }) => {
  const isAllActive = !activeSlug

  return (
    <nav aria-label="文章分類" className="border-b border-brand-border">
      <ul className="-mb-px flex gap-6 overflow-x-auto pb-px md:gap-8">
        <li className="shrink-0">
          <Link
            className={cn(
              'inline-block whitespace-nowrap border-b-2 pb-3 text-sm transition-colors md:text-base',
              isAllActive
                ? 'border-brand-sage font-medium text-brand-heading'
                : 'border-transparent text-brand-body hover:text-brand-heading',
            )}
            href={buildPostsPagePath({ page: 1, q: query })}
          >
            全部
          </Link>
        </li>
        {categories.map((category) => {
          const isActive = activeSlug === category.slug

          return (
            <li className="shrink-0" key={category.slug}>
              <Link
                className={cn(
                  'inline-block whitespace-nowrap border-b-2 pb-3 text-sm transition-colors md:text-base',
                  isActive
                    ? 'border-brand-sage font-medium text-brand-heading'
                    : 'border-transparent text-brand-body hover:text-brand-heading',
                )}
                href={buildPostsPagePath({
                  categorySlug: category.slug,
                  page: 1,
                  q: query,
                })}
              >
                {category.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
