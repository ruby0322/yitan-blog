'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Menu, SearchIcon, X } from 'lucide-react'

type HeaderNavProps = {
  data: HeaderType
  onOpenSearch: () => void
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, onOpenSearch }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <nav aria-label="主選單" className="hidden items-center gap-3 md:flex">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}
        <button
          aria-label="搜尋"
          className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 text-primary hover:bg-muted"
          onClick={onOpenSearch}
          type="button"
        >
          <SearchIcon className="w-5" />
        </button>
      </nav>

      <div className="flex items-center gap-3 md:hidden">
        <button
          aria-label="搜尋"
          className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 text-primary hover:bg-muted"
          onClick={onOpenSearch}
          type="button"
        >
          <SearchIcon className="w-5" />
        </button>
        <button
          aria-expanded={open}
          aria-label={open ? '關閉選單' : '開啟選單'}
          className="inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-muted"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          aria-label="行動版主選單"
          className="absolute inset-x-0 top-full z-30 flex flex-col gap-1 border-b border-border bg-background px-4 py-4 shadow-sm md:hidden"
        >
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                {...link}
                appearance="link"
                className="block rounded-md px-2 py-2 hover:bg-muted"
              />
            )
          })}
        </nav>
      )}
    </>
  )
}
