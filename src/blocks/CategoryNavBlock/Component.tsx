import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'

import type { CategoryNavBlock as CategoryNavBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/theme'
import { Section } from '@/components/theme/section'

function resolveHref(link?: CategoryNavBlockProps['items'][0]['link']): string | null {
  if (!link) return null

  if (link.type === 'custom' && link.url) {
    return link.url
  }

  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value.slug
  ) {
    const prefix = link.reference.relationTo === 'pages' ? '' : `/${link.reference.relationTo}`
    return `${prefix}/${link.reference.value.slug}`
  }

  return null
}

export const CategoryNavBlockComponent: React.FC<CategoryNavBlockProps> = ({
  heading,
  items,
  sectionNumber,
}) => {
  if (!items || items.length === 0) return null

  return (
    <Section spacing="default" variant="default">
      <div className="container">
        <SectionHeader heading={heading || '依主題閱讀'} sectionNumber={sectionNumber} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map(({ id, link, number, title }, index) => {
            const href = resolveHref(link)
            if (!href) return null

            return (
              <Link
                className="group relative flex min-h-[120px] flex-col justify-between rounded-md border border-brand-sage/20 bg-brand-bg p-6 transition-colors hover:border-brand-sage hover:bg-brand-hover lg:min-h-[132px]"
                href={href}
                key={id || index}
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full border border-brand-sage/30 bg-brand-sage/10 font-serif text-sm text-brand-sage">
                  {number}
                </span>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <h4 className="font-serif text-lg font-semibold leading-snug tracking-wide text-brand-heading">
                    {title}
                  </h4>
                  <ArrowUpRight className="size-5 shrink-0 text-brand-sage transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
