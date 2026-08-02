import { cn } from '@/utilities/ui'
import React from 'react'

type CategoryCountLabelProps = {
  active?: boolean
  count: number
  className?: string
}

export const CategoryCountLabel: React.FC<CategoryCountLabelProps> = ({
  active = false,
  count,
  className,
}) => {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 font-sans text-[11px] font-medium tabular-nums leading-none',
        active
          ? 'bg-brand-sage/15 text-brand-sage'
          : 'border border-brand-sage/20 bg-brand-bg text-brand-body/70',
        className,
      )}
    >
      {count}
    </span>
  )
}
