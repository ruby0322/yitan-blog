'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { buildPostsPagePath } from '@/utilities/buildPostsPagePath'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

export const Pagination: React.FC<{
  categorySlug?: string | null
  className?: string
  page: number
  query?: string
  totalPages: number
}> = (props) => {
  const router = useRouter()

  const { categorySlug, className, page, query, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  const goToPage = (targetPage: number) => {
    router.push(
      buildPostsPagePath({
        categorySlug,
        page: targetPage,
        q: query,
      }),
    )
  }

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={!hasPrevPage} onClick={() => goToPage(page - 1)} />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive onClick={() => goToPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink onClick={() => goToPage(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext disabled={!hasNextPage} onClick={() => goToPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
