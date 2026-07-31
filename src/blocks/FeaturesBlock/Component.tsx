import React from 'react'

import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'

import { NumberedHeading, SectionHeader } from '@/components/theme'
import { Section } from '@/components/theme/section'

type FeatureItemProps = {
  description: string
  title: string
}

function FeatureItem({ description, title }: FeatureItemProps) {
  return (
    <article className="w-full max-w-prose text-left">
      <NumberedHeading title={title} variant="bar" />
      <p className="mt-3 font-sans text-sm leading-loose text-brand-body md:mt-4 md:text-base">
        {description}
      </p>
    </article>
  )
}

export const FeaturesBlockComponent: React.FC<FeaturesBlockProps> = ({
  heading,
  items,
  sectionNumber,
}) => {
  if (!items || items.length === 0) return null

  const leftColumnItems = [items[0], items[2]].filter(
    (item): item is NonNullable<(typeof items)[number]> => Boolean(item?.title),
  )
  const rightColumnItems = [items[1], items[3]].filter(
    (item): item is NonNullable<(typeof items)[number]> => Boolean(item?.title),
  )

  return (
    <Section spacing="default" variant="default">
      <div className="container">
        <SectionHeader heading={heading || '四大特色'} sectionNumber={sectionNumber} />

        {/* Mobile: single column, original order */}
        <div className="flex flex-col gap-8 md:hidden">
          {items.map(({ id, title, description }, index) =>
            title && description ? (
              <FeatureItem description={description} key={id ?? index} title={title} />
            ) : null,
          )}
        </div>

        {/* Desktop: two stacked groups — right group top offset for depth */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20">
          <div className="flex flex-col items-start gap-10 lg:gap-12">
            {leftColumnItems.map(({ id, title, description }, index) => (
              <FeatureItem description={description} key={id ?? `left-${index}`} title={title} />
            ))}
          </div>
          <div className="flex flex-col items-start gap-10 md:mt-12 lg:mt-16 lg:gap-12 xl:mt-20">
            {rightColumnItems.map(({ id, title, description }, index) => (
              <FeatureItem description={description} key={id ?? `right-${index}`} title={title} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
