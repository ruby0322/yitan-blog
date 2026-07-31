import React from 'react'

import { cn } from '@/utilities/ui'

export type SearchResultItem = {
  slug?: string | null
  title?: string | null
  meta?: {
    description?: string | null
    title?: string | null
  } | null
  categories?: Array<{ title?: string | null }> | null
}

type SearchResultListProps = {
  activeIndex: number
  onSelect: (href: string) => void
  results: SearchResultItem[]
}

export const SearchResultList: React.FC<SearchResultListProps> = ({
  activeIndex,
  onSelect,
  results,
}) => {
  return (
    <ul className="py-2">
      {results.map((result, index) => {
        const categoryLabel = result.categories?.[0]?.title
        const description = result.meta?.description || result.meta?.title
        const isActive = index === activeIndex

        if (!result.slug) return null

        const href = `/posts/${result.slug}`

        return (
          <li key={result.slug}>
            <a
              className={cn(
                'block w-full cursor-pointer px-4 py-3 text-left no-underline transition-colors hover:bg-brand-border/30',
                isActive && 'bg-brand-border/30',
              )}
              href={href}
              onClick={(event) => {
                event.preventDefault()
                onSelect(href)
              }}
            >
              <span className="block font-medium text-brand-heading">{result.title}</span>
              {categoryLabel || description ? (
                <span className="mt-1 block line-clamp-1 text-sm text-brand-body">
                  {[categoryLabel, description].filter(Boolean).join(' · ')}
                </span>
              ) : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
