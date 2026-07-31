import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { postPageProseClassName } from '@/components/theme'
import { CMSLink } from '../../components/Link'

type ContentBlockComponentProps = ContentBlockProps & {
  layoutVariant?: 'default' | 'article'
}

export const ContentBlock: React.FC<ContentBlockComponentProps> = (props) => {
  const { columns, layoutVariant = 'default' } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  if (layoutVariant === 'article') {
    return (
      <>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText } = col

            return (
              <div
                className={cn(index > 0 && 'mt-12 border-t border-brand-border pt-8')}
                key={index}
              >
                {richText && (
                  <RichText
                    className={postPageProseClassName}
                    data={richText}
                    enableGutter={false}
                  />
                )}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </>
    )
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-1 gap-y-8 gap-x-8 lg:grid-cols-12 lg:gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div className={cn(`lg:col-span-${colsSpanClasses[size!]}`)} key={index}>
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
