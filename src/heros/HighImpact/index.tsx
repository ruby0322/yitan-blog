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

export const HighImpactHero: React.FC<Page['hero']> = ({ links, richText }) => {
  return (
    <Section className="relative overflow-hidden py-12 md:py-20 lg:py-28" spacing="none" variant="default">
      <HeroDecor />

      <div className="container relative z-10 grid items-center gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6 xl:gap-8">
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

        <div className="order-1 mx-auto w-full max-w-80 -translate-y-5 sm:max-w-96 sm:-translate-y-6 lg:order-2 lg:max-w-lg lg:-translate-y-8">
          <HeroRingStage />
        </div>
      </div>
    </Section>
  )
}
