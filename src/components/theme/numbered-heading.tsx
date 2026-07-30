import { cn } from '@/utilities/ui'
import React from 'react'

type NumberedHeadingProps = {
  className?: string
  number?: number | string
  title: string
  variant?: 'badge' | 'bar'
}

export const NumberedHeading: React.FC<NumberedHeadingProps> = ({
  className,
  number,
  title,
  variant = 'badge',
}) => {
  if (variant === 'bar') {
    return (
      <div className={cn('border-l-4 border-brand-sage pl-4', className)}>
        <h3 className="font-serif text-2xl font-semibold tracking-wide text-foreground">{title}</h3>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-sage font-serif text-lg text-white">
        {number}
      </span>
      <h3 className="font-serif text-2xl font-semibold tracking-wide text-foreground">{title}</h3>
    </div>
  )
}
