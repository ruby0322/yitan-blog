import { cn } from '@/utilities/ui'
import React from 'react'

type NumberedHeadingProps = {
  className?: string
  number?: number | string
  title: string
  tone?: 'default' | 'inverse'
  variant?: 'badge' | 'bar'
}

export const NumberedHeading: React.FC<NumberedHeadingProps> = ({
  className,
  number,
  title,
  tone = 'default',
  variant = 'badge',
}) => {
  const isInverse = tone === 'inverse'

  if (variant === 'bar') {
    return (
      <div
        className={cn(
          'border-l-4 pl-4',
          isInverse ? 'border-brand-inverse-fg/50' : 'border-brand-sage',
          className,
        )}
      >
        <h3
          className={cn(
            'font-serif text-2xl font-semibold tracking-wide',
            isInverse ? 'text-brand-inverse-fg' : 'text-foreground',
          )}
        >
          {title}
        </h3>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full font-serif text-lg',
          isInverse
            ? 'border border-brand-inverse-fg/30 bg-brand-inverse-fg/15 text-brand-inverse-fg'
            : 'bg-brand-sage text-white',
        )}
      >
        {number}
      </span>
      <h3
        className={cn(
          'font-serif text-2xl font-semibold tracking-wide',
          isInverse ? 'text-brand-inverse-fg' : 'text-foreground',
        )}
      >
        {title}
      </h3>
    </div>
  )
}
