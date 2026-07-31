import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutTeaserBlockComponent } from '@/blocks/AboutTeaserBlock/Component'
import { BookSalesBlockComponent } from '@/blocks/BookSalesBlock/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CategoryNavBlockComponent } from '@/blocks/CategoryNavBlock/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeaturedPostsBlockComponent } from '@/blocks/FeaturedPostsBlock/Component'
import { FeaturesBlockComponent } from '@/blocks/FeaturesBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { NewsletterBlockComponent } from '@/blocks/NewsletterBlock/Component'
import { QuoteBlockComponent } from '@/blocks/QuoteBlock/Component'

const blockComponents = {
  aboutTeaserBlock: AboutTeaserBlockComponent,
  archive: ArchiveBlock,
  bookSalesBlock: BookSalesBlockComponent,
  categoryNavBlock: CategoryNavBlockComponent,
  content: ContentBlock,
  cta: CallToActionBlock,
  featuredPostsBlock: FeaturedPostsBlockComponent,
  featuresBlock: FeaturesBlockComponent,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  newsletterBlock: NewsletterBlockComponent,
  quoteBlock: QuoteBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  layoutVariant?: 'default' | 'article'
}> = (props) => {
  const { blocks, layoutVariant = 'default' } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              const blockProps =
                blockType === 'content' && layoutVariant === 'article'
                  ? { ...block, layoutVariant: 'article' as const }
                  : block

              return (
                <div
                  className={
                    layoutVariant === 'article' && index > 0
                      ? 'mt-12 border-t border-brand-border pt-8'
                      : undefined
                  }
                  key={index}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...blockProps} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
