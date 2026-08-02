'use client'

import { cn } from '@/utilities/ui'
import React from 'react'

type CategoryLabelTooltipProps = {
  displayLabel: string
  fullLabel: string
  showTooltip: boolean
}

export const CategoryLabelTooltip: React.FC<CategoryLabelTooltipProps> = ({
  displayLabel,
  fullLabel,
  showTooltip,
}) => {
  if (!showTooltip) {
    return <span>{displayLabel}</span>
  }

  return (
    <span
      aria-label={fullLabel}
      className="group/category relative inline cursor-default underline decoration-brand-sage/30 decoration-dotted underline-offset-2"
      tabIndex={0}
    >
      {displayLabel}
      <span
        className={cn(
          'pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-max max-w-[min(18rem,calc(100vw-2rem))]',
          'rounded-md border border-brand-border bg-brand-warm-white px-2.5 py-1.5',
          'text-xs font-normal leading-snug text-brand-body shadow-sm',
          'opacity-0 transition-opacity duration-150',
          'group-focus-visible/category:opacity-100 group-hover/category:opacity-100',
        )}
        role="tooltip"
      >
        {fullLabel}
      </span>
    </span>
  )
}
