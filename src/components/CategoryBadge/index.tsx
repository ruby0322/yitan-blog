import { cn } from '@/utilities/ui'
import React from 'react'

export const CategoryBadge: React.FC<{
  className?: string
  label: string
}> = ({ className, label }) => {
  return (
    <span className={cn('text-xs font-medium text-brand-sage', className)}>{label}</span>
  )
}
