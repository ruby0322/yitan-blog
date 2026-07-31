'use client'

import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

import { useImeSafeDebouncedSearch } from '@/hooks/useImeSafeDebouncedSearch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { buildPostsPagePath } from '@/utilities/buildPostsPagePath'
import { cn } from '@/utilities/ui'

type Props = {
  categorySlug?: string | null
  className?: string
  initialQuery?: string
  placeholder?: string
}

export const PostsSearchInput: React.FC<Props> = ({
  categorySlug,
  className,
  initialQuery = '',
  placeholder = '搜尋文章…',
}) => {
  const router = useRouter()

  const navigateToQuery = useCallback(
    (query: string) => {
      const trimmed = query.trim()
      router.replace(
        buildPostsPagePath({
          categorySlug,
          page: 1,
          q: trimmed || null,
        }),
      )
    },
    [categorySlug, router],
  )

  const { inputProps } = useImeSafeDebouncedSearch({
    externalValue: initialQuery,
    onDebouncedChange: navigateToQuery,
  })

  return (
    <div className={cn('relative', className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          navigateToQuery(inputProps.value)
        }}
      >
        <Label className="sr-only" htmlFor="posts-search">
          搜尋文章
        </Label>
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-sage"
        />
        <Input
          {...inputProps}
          className="border-brand-border pl-10"
          id="posts-search"
          placeholder={placeholder}
          type="search"
        />
        <button className="sr-only" type="submit">
          搜尋
        </button>
      </form>
    </div>
  )
}
