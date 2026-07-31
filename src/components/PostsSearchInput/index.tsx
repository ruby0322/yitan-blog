'use client'

import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/utilities/useDebounce'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  placeholder?: string
}

export const PostsSearchInput: React.FC<Props> = ({
  className,
  placeholder = '搜尋文章…',
}) => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const debouncedValue = useDebounce(value)
  const [hasTyped, setHasTyped] = useState(false)

  useEffect(() => {
    if (!hasTyped) return

    if (debouncedValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedValue.trim())}`)
    }
  }, [debouncedValue, hasTyped, router])

  return (
    <div className={cn('relative', className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const trimmed = value.trim()
          if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}`)
          }
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
          className="border-brand-border pl-10"
          id="posts-search"
          onChange={(event) => {
            setHasTyped(true)
            setValue(event.target.value)
          }}
          placeholder={placeholder}
          type="search"
          value={value}
        />
        <button className="sr-only" type="submit">
          搜尋
        </button>
      </form>
    </div>
  )
}
