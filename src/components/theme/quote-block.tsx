import { cn } from '@/utilities/ui'
import React from 'react'

type QuoteBlockProps = {
  attribution?: string
  children: React.ReactNode
  className?: string
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({ attribution, children, className }) => {
  return (
    <blockquote className={cn('mx-auto max-w-3xl text-center', className)}>
      <p className="font-serif text-2xl leading-relaxed text-brand-heading md:text-3xl">
        「{children}」
      </p>
      {attribution && (
        <footer className="mt-6 font-sans text-sm text-brand-sage">{attribution}</footer>
      )}
    </blockquote>
  )
}
