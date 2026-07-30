import { cn } from '@/utilities/ui'
import { type VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const sectionVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      muted: 'bg-brand-card text-foreground',
      inverse: 'bg-brand-inverse-bg text-brand-inverse-fg',
    },
    spacing: {
      default: 'py-16 md:py-20',
      sm: 'py-10 md:py-12',
      lg: 'py-20 md:py-28',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'default',
  },
})

export type SectionProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants> & {
    as?: 'section' | 'div' | 'footer' | 'header'
  }

export const Section: React.FC<SectionProps> = ({
  as: Tag = 'section',
  children,
  className,
  spacing,
  variant,
  ...props
}) => {
  const isInverse = variant === 'inverse'

  return (
    <Tag
      className={cn(sectionVariants({ variant, spacing, className }))}
      {...(isInverse ? { 'data-theme': 'dark' as const } : {})}
      {...props}
    >
      {children}
    </Tag>
  )
}

export { sectionVariants }
