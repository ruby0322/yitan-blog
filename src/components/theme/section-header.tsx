import { SectionNumber } from '@/components/theme/typography'
import { cn } from '@/utilities/ui'
import React from 'react'

export type SectionHeaderProps = {
  className?: string
  heading?: string | null
  sectionNumber?: string | null
}

/** Magazine section meta row — kicker left, section number right, sage underline. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  className,
  heading,
  sectionNumber,
}) => {
  if (!heading && !sectionNumber) return null

  return (
    <header
      className={cn(
        'mb-6 flex items-end justify-between gap-4 border-b border-brand-sage/25 pb-4 lg:mb-8 lg:pb-6',
        !heading && sectionNumber && 'justify-end',
        className,
      )}
    >
      {heading ? (
        <p className="font-sans text-sm tracking-[0.28em] text-brand-sage uppercase md:text-base">
          {heading}
        </p>
      ) : null}
      {sectionNumber ? (
        <SectionNumber className="text-3xl md:text-4xl lg:text-5xl">{sectionNumber}</SectionNumber>
      ) : null}
    </header>
  )
}
