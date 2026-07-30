import React from 'react'

import type { QuoteBlockBlock as QuoteBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { QuoteBlock, Section, SectionHeader, themeRichTextClassName } from '@/components/theme'

export const QuoteBlockComponent: React.FC<QuoteBlockProps> = ({
  attribution,
  quote,
  sectionNumber,
  sideText,
}) => {
  if (!quote) return null

  return (
    <Section spacing="default" variant="muted">
      <div className="container">
        <SectionHeader sectionNumber={sectionNumber} />
        <div className="grid max-w-5xl items-start gap-8 md:grid-cols-2 md:gap-12">
          <QuoteBlock attribution={attribution ?? undefined} className="mx-0 max-w-none text-left">
            {quote}
          </QuoteBlock>
          {sideText && (
            <RichText
              className={themeRichTextClassName}
              data={sideText}
              enableGutter={false}
              enableProse={false}
            />
          )}
        </div>
      </div>
    </Section>
  )
}
