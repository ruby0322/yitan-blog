import { ChevronDown } from 'lucide-react'
import React from 'react'

import type { Post } from '@/payload-types'

import { BodyText } from '@/components/theme/typography'
import { cn } from '@/utilities/ui'

type PostFaqProps = {
  items: NonNullable<Post['faq']>
}

export const PostFaq: React.FC<PostFaqProps> = ({ items }) => {
  if (!items.length) return null

  return (
    <section aria-labelledby="post-faq-heading" className="mt-12 border-t border-brand-border pt-10">
      <h2
        className="heading-sage-bar mb-8 font-serif text-2xl font-semibold tracking-wide text-brand-heading md:text-3xl"
        id="post-faq-heading"
      >
        常見問題
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => {
          if (!item?.question || !item?.answer) return null

          return (
            <details
              className={cn(
                'group rounded-md border border-brand-border bg-brand-card/60 px-5 py-4 md:px-6 md:py-5',
                'open:bg-brand-card/80',
              )}
              key={`${item.question}-${index}`}
            >
              <summary
                className={cn(
                  'flex cursor-pointer list-none items-center gap-3',
                  '[&::-webkit-details-marker]:hidden',
                )}
              >
                <span className="shrink-0 font-sans text-xs font-medium tracking-[0.12em] text-brand-sage uppercase">
                  Q{index + 1}
                </span>
                <span className="flex-1 font-serif text-base font-semibold leading-snug tracking-wide text-brand-heading md:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  aria-hidden
                  className="size-4 shrink-0 text-brand-sage transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <BodyText className="mt-3 pl-8 md:pl-9">{item.answer}</BodyText>
            </details>
          )
        })}
      </div>
    </section>
  )
}
