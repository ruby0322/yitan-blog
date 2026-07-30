import { OrganRingMark } from '@/components/brand'
import clsx from 'clsx'
import React from 'react'

type LogoProps = {
  className?: string
  size?: 'default' | 'lg'
  variant?: 'default' | 'inverse'
}

export const Logo = ({ className, size = 'default', variant = 'default' }: LogoProps) => {
  const isLg = size === 'lg'
  const isInverse = variant === 'inverse'

  return (
    <span
      className={clsx(
        'inline-flex items-center',
        isLg ? 'gap-3 sm:gap-3.5' : 'gap-2 sm:gap-2.5',
        className,
      )}
    >
      <OrganRingMark
        className={isLg ? 'h-10 w-9 sm:h-12 sm:w-10' : 'h-6 w-5 sm:h-8 sm:w-7'}
        variant={isInverse ? 'inverse' : 'nav'}
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={clsx(
            'font-serif font-semibold tracking-wide',
            isLg ? 'text-xl sm:text-2xl' : 'text-base md:text-lg',
            isInverse ? 'text-brand-inverse-fg' : 'text-brand-heading',
          )}
        >
          胰探究竟
        </span>
        <span
          className={clsx(
            'tracking-wide',
            isLg ? 'mt-0.5 block text-sm sm:text-base' : 'hidden text-[11px] sm:block',
            isInverse ? 'text-brand-inverse-fg/85' : 'text-brand-sage',
          )}
        >
          章醫師的胰臟日常
        </span>
      </span>
    </span>
  )
}
