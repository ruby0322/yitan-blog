'use client'

import { Loader2, Search as SearchIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useImeSafeDebouncedSearch } from '@/hooks/useImeSafeDebouncedSearch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { buildPostsPagePath } from '@/utilities/buildPostsPagePath'

import { SearchOverlayShell } from './SearchOverlayShell'
import { SearchResultList, type SearchResultItem } from './SearchResultList'

type SearchOverlayProps = {
  onClose: () => void
  open: boolean
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, open }) => {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category')
  const inputRef = useRef<HTMLInputElement>(null)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const navigate = useCallback((href: string) => {
    window.location.assign(href)
  }, [])

  const buildPostsSearchHref = useCallback(
    (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return null

      return buildPostsPagePath({
        categorySlug,
        page: 1,
        q: trimmed,
      })
    },
    [categorySlug],
  )

  const fetchResults = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) {
        setResults([])
        setTotalDocs(0)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const params = new URLSearchParams({ q: trimmed, limit: '8' })
        if (categorySlug) {
          params.set('category', categorySlug)
        }

        const response = await fetch(`/api/search?${params.toString()}`)
        if (!response.ok) {
          setResults([])
          setTotalDocs(0)
          return
        }

        const data = (await response.json()) as { docs: SearchResultItem[]; totalDocs: number }
        setResults(data.docs)
        setTotalDocs(data.totalDocs)
        setActiveIndex(-1)
      } catch {
        setResults([])
        setTotalDocs(0)
      } finally {
        setIsLoading(false)
      }
    },
    [categorySlug],
  )

  const { inputProps, setValue, value } = useImeSafeDebouncedSearch({
    onDebouncedChange: fetchResults,
  })

  useEffect(() => {
    if (!open) return

    setValue('')
    setResults([])
    setTotalDocs(0)
    setActiveIndex(-1)

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [open, setValue])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => Math.min(current + 1, results.length - 1))
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => Math.max(current - 1, -1))
        return
      }

      if (event.key === 'Enter' && activeIndex >= 0) {
        const slug = results[activeIndex]?.slug
        if (!slug) return

        event.preventDefault()
        navigate(`/posts/${slug}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, navigate, open, results])

  const showEmptyState = value.trim().length > 0 && !isLoading && results.length === 0
  const showResults = value.trim().length > 0 && results.length > 0
  const postsSearchHref = buildPostsSearchHref(value)

  return (
    <SearchOverlayShell onClose={onClose} open={open}>
      <form
        className="relative border-b border-brand-border"
        onSubmit={(event) => {
          event.preventDefault()
          if (!postsSearchHref) return
          navigate(postsSearchHref)
        }}
      >
        <Label className="sr-only" htmlFor="overlay-search">
          搜尋文章
        </Label>
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-brand-sage"
        />
        <Input
          {...inputProps}
          ref={inputRef}
          autoComplete="off"
          className="h-14 rounded-none border-0 pr-12 pl-12 text-base shadow-none focus-visible:ring-0"
          id="overlay-search"
          placeholder="搜尋文章…"
          type="search"
        />
        <button
          aria-label="前往搜尋結果頁"
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-brand-sage hover:bg-brand-border/40"
          type="submit"
        >
          <SearchIcon className="size-4" />
        </button>
      </form>

      <div aria-live="polite" className="max-h-[min(50vh,24rem)] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-brand-body">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            搜尋中…
          </div>
        ) : null}

        {showEmptyState ? (
          <p className="px-4 py-6 text-sm text-brand-body">
            找不到與「{value.trim()}」相關的文章，請試試其他關鍵字。
          </p>
        ) : null}

        {showResults ? (
          <SearchResultList activeIndex={activeIndex} onSelect={navigate} results={results} />
        ) : null}

        {showResults && totalDocs > results.length && postsSearchHref ? (
          <div className="border-t border-brand-border px-4 py-3">
            <a
              className="cursor-pointer text-sm font-medium text-brand-sage no-underline hover:underline"
              href={postsSearchHref}
              onClick={(event) => {
                event.preventDefault()
                navigate(postsSearchHref)
              }}
            >
              查看全部 {totalDocs} 筆結果
            </a>
          </div>
        ) : null}
      </div>
    </SearchOverlayShell>
  )
}
