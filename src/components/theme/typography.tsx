import { cn } from '@/utilities/ui'
import React from 'react'

type TypographyProps = {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export const DisplayHeading: React.FC<TypographyProps> = ({
  as: Tag = 'h1',
  children,
  className,
}) => (
  <Tag className={cn('font-serif text-4xl tracking-wide text-foreground md:text-5xl', className)}>
    {children}
  </Tag>
)

export const SectionHeading: React.FC<TypographyProps> = ({
  as: Tag = 'h2',
  children,
  className,
}) => (
  <Tag
    className={cn(
      'font-serif text-2xl font-semibold tracking-wide text-foreground md:text-3xl',
      className,
    )}
  >
    {children}
  </Tag>
)

export const SectionNumber: React.FC<TypographyProps> = ({
  as: Tag = 'span',
  children,
  className,
}) => (
  <Tag className={cn('font-serif text-5xl text-brand-sage/40', className)}>{children}</Tag>
)

export const BodyText: React.FC<TypographyProps> = ({ as: Tag = 'p', children, className }) => (
  <Tag className={cn('font-sans tracking-wide text-muted-foreground leading-loose', className)}>
    {children}
  </Tag>
)

export const EmphasisText: React.FC<TypographyProps> = ({
  as: Tag = 'span',
  children,
  className,
}) => (
  <Tag className={cn('font-sans font-bold text-brand-subtitle', className)}>{children}</Tag>
)

export const Caption: React.FC<TypographyProps> = ({ as: Tag = 'span', children, className }) => (
  <Tag className={cn('font-sans text-sm text-brand-sage', className)}>{children}</Tag>
)
