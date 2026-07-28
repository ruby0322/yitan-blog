import { cn } from '@/utilities/ui'
import React from 'react'

export const CategoryBadge: React.FC<{
  className?: string
  label: string
}> = ({ className, label }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
        className,
      )}
    >
      {label}
    </span>
  )
}
