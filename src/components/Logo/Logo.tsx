import { OrganRingMark } from '@/components/brand'
import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <span className={clsx('inline-flex items-center gap-2 sm:gap-2.5', className)}>
      <OrganRingMark className="h-6 w-5 sm:h-8 sm:w-7" variant="nav" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="font-serif text-base font-semibold tracking-wide text-brand-heading md:text-lg">
          胰探究竟
        </span>
        <span className="hidden text-[11px] tracking-wide text-brand-sage sm:block">
          章醫師的胰臟日常
        </span>
      </span>
    </span>
  )
}
