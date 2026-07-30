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
    <Section spacing="default" variant="muted">
      <div className="container">
        <SectionHeader heading={heading || '從這裡開始'} sectionNumber={sectionNumber} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ id, link, number, title }, index) => {
            const href = resolveHref(link)
            if (!href) return null

            return (
              <Link
                className="group relative flex min-h-[140px] flex-col justify-between rounded-md border border-brand-border bg-background p-6 transition-colors hover:border-brand-sage hover:bg-brand-hover"
                href={href}
                key={id || index}
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full border border-brand-border bg-brand-card font-serif text-sm text-brand-heading">
                  {number}
                </span>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <h4 className="font-serif text-lg font-semibold tracking-wide text-brand-heading">
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
