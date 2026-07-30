import { OrganRingMark } from '@/components/brand/OrganRingMark'
import { cn } from '@/utilities/ui'
import React from 'react'

type EditorialImagePlaceholderProps = {
  className?: string
  label?: string
  variant?: 'card' | 'oval'
}

export const EditorialImagePlaceholder: React.FC<EditorialImagePlaceholderProps> = ({
  className,
  label = '待替換圖片',
  variant = 'card',
}) => {
  if (variant === 'oval') {
    return (
      <div
        className={cn(
          'flex aspect-[3/4] w-full max-w-xs items-center justify-center rounded-[999px] border border-brand-border bg-brand-card',
          className,
        )}
      >
        <div className="text-center">
          <p className="font-serif text-3xl tracking-wide text-brand-heading/40">章</p>
          <p className="mt-2 text-xs text-brand-sage">{label}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex size-full items-center justify-center overflow-hidden bg-brand-card',
        className,
      )}
    >
      <div className="size-1/2 opacity-40">
        <OrganRingMark className="size-full" />
      </div>
      <span className="absolute bottom-3 text-xs text-brand-sage">{label}</span>
    </div>
  )
}
