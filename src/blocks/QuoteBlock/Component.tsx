import React from 'react'

import type { QuoteBlockBlock as QuoteBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { QuoteBlock, Section, SectionHeader, themeRichTextClassName } from '@/components/theme'
import { cn } from '@/utilities/ui'
import Link from 'next/link'

const BOOK_SALES_SECTION_ID = 'book-sales'

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
        <div className="w-full">
          <div className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 lg:gap-16">
            <QuoteBlock className="mx-0 max-w-none text-left" showAttribution={false}>
              {quote}
            </QuoteBlock>
            {sideText && (
              <RichText
                className={cn(
                  themeRichTextClassName,
                  'prose-p:font-normal prose-p:text-sm prose-p:leading-loose prose-p:tracking-[0.05em] md:prose-p:text-base md:prose-p:tracking-[0.06em]',
                )}
                data={sideText}
                enableGutter={false}
                enableProse={false}
              />
            )}
          </div>
          {attribution ? (
            <div className="mt-8 flex justify-end md:mt-10">
              <Link
                className="font-serif text-base tracking-wide text-brand-sage underline decoration-brand-sage/50 underline-offset-[0.35em] transition-[color,text-decoration-color] hover:text-brand-heading hover:decoration-brand-heading md:text-lg"
                href={`#${BOOK_SALES_SECTION_ID}`}
              >
                {attribution}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
