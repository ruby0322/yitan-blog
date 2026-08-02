'use client'

import React from 'react'

import type { Page } from '@/payload-types'

import { HeroDecor, HeroRingStage } from '@/components/brand'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { heroRichTextClassName } from '@/components/theme'
import { Section } from '@/components/theme/section'
import type { LinkAppearances } from '@/fields/link'
import { cn } from '@/utilities/ui'

function heroLinkAppearance(appearance?: LinkAppearances | null) {
  if (appearance === 'outline') return 'outline' as const
  return 'cta' as const
}

/** Vertical stack below lg (`lg:grid-cols-2`). Illustration sizing follows the same breakpoint. */
const heroGridClassName =
  'container relative z-10 grid items-center gap-7.5 sm:gap-9.375 lg:grid-cols-2 lg:gap-12 xl:gap-16'

/** Vertical: viewport-relative width. Horizontal (lg+): fixed max width. */
const heroIllustrationClassName = cn(
  'order-1 mx-auto max-w-full',
  'max-lg:w-[75vw]',
  'lg:order-2 lg:w-full lg:max-w-264.6 lg:-translate-y-6 xl:-translate-y-8',
)

export const HighImpactHero: React.FC<Page['hero']> = ({ links, richText }) => {
  return (
    <Section className="relative overflow-hidden py-12 md:py-20 lg:pb-28 lg:pt-32 xl:pb-28 xl:pt-36" spacing="none" variant="default">
      <HeroDecor />

      <div className={heroGridClassName}>
        <div className="order-2 flex flex-col gap-4 text-center sm:gap-6 sm:text-left lg:order-1 lg:gap-8">
          {richText && (
            <RichText
              className={heroRichTextClassName}
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="mx-auto flex w-full max-w-md flex-col gap-3 sm:mx-0 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
              {links.map(({ link }, i) => (
                <li className="w-full sm:w-auto" key={i}>
                  <CMSLink
                    {...link}
                    appearance={heroLinkAppearance(link.appearance)}
                    className={cn(
                      'h-11 w-full justify-center px-6 text-[0.9375rem] sm:w-auto sm:px-8 sm:text-sm',
                      i === 0 && 'shadow-sm',
                    )}
                    size="clear"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={heroIllustrationClassName}>
          <HeroRingStage />
        </div>
      </div>
    </Section>
  )
}
