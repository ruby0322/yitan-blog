import { SectionHeading, SectionNumber } from '@/components/theme/typography'
import { cn } from '@/utilities/ui'
import React from 'react'

export type SectionHeaderProps = {
  className?: string
  heading?: string | null
  sectionNumber?: string | null
}

/** Magazine section label row — heading left, large section number right. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  className,
  heading,
  sectionNumber,
}) => {
  if (!heading && !sectionNumber) return null

  return (
    <div
      className={cn(
        'mb-8 flex items-end justify-between gap-4',
        !heading && sectionNumber && 'justify-end',
        className,
      )}
    >
      {heading ? <SectionHeading>{heading}</SectionHeading> : null}
      {sectionNumber ? <SectionNumber>{sectionNumber}</SectionNumber> : null}
    </div>
  )
}
