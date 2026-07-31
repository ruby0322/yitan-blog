import { cn } from '@/utilities/ui'
import React from 'react'

type LegalSectionTitleProps = {
  children: React.ReactNode
  className?: string
}

export const LegalSectionTitle: React.FC<LegalSectionTitleProps> = ({ children, className }) => (
  <h2
    className={cn(
      'mb-2 font-sans text-xs tracking-[0.2em] text-brand-sage uppercase',
      className,
    )}
  >
    {children}
  </h2>
)
