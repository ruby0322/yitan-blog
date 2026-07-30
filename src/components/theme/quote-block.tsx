import { cn } from '@/utilities/ui'
import React from 'react'

type QuoteBlockProps = {
  attribution?: string
  children: React.ReactNode
  className?: string
  showAttribution?: boolean
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  attribution,
  children,
  className,
  showAttribution = true,
}) => {
  return (
    <blockquote className={cn('mx-auto max-w-3xl text-center', className)}>
      <p className="font-serif text-2xl leading-relaxed text-brand-heading md:text-3xl">
        「{children}」
      </p>
      {showAttribution && attribution && (
        <footer className="mt-6 font-sans text-sm text-brand-sage">{attribution}</footer>
      )}
    </blockquote>
  )
}
