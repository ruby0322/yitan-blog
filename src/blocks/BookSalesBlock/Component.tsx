import React from 'react'

import type { BookSalesBlock as BookSalesBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { BodyText, DisplayHeading, SectionHeader } from '@/components/theme'
import { Section } from '@/components/theme/section'
import { cn } from '@/utilities/ui'

const frameClassName =
  'rounded-sm bg-background/70 shadow-[0_1px_2px_rgba(74,82,72,0.05),0_16px_48px_rgba(74,82,72,0.1)]'

export const BookSalesBlockComponent: React.FC<BookSalesBlockProps> = ({
  authorLine,
  bookSubtitle,
  buyLink,
  coverImage,
  description,
  heading,
  highlightLine,
  sectionNumber,
}) => {
  const hasCover = coverImage && typeof coverImage === 'object'
  const buyHref =
    buyLink?.type === 'custom'
      ? buyLink.url
      : buyLink?.type === 'reference' &&
          typeof buyLink.reference?.value === 'object' &&
          buyLink.reference.value.slug
        ? `${buyLink.reference.relationTo !== 'pages' ? `/${buyLink.reference.relationTo}` : ''}/${buyLink.reference.value.slug}`
        : buyLink?.url

  const titleBlock = (className?: string) => (
    <div className={className}>
      <DisplayHeading
        as="h2"
        className="text-[clamp(1.625rem,3.5vw,2.25rem)] leading-[1.15] tracking-[0.04em] text-brand-heading lg:text-[clamp(2rem,4vw,2.75rem)]"
      >
        {heading}
      </DisplayHeading>
      {bookSubtitle ? (
        <p className="mt-2 font-serif text-base leading-relaxed tracking-wide text-brand-heading/80 md:mt-3 md:text-lg md:leading-loose lg:mt-5 lg:text-xl">
          {bookSubtitle}
        </p>
      ) : null}
    </div>
  )

  return (
    <Section className="scroll-mt-20" id="book-sales" spacing="default" variant="muted">
      <div className="container">
        <SectionHeader heading="新書出版" sectionNumber={sectionNumber} />

        <div
          className={cn(
            'flex flex-col gap-6',
            hasCover &&
              'lg:grid lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:grid-rows-1 lg:items-stretch lg:gap-x-16 lg:gap-y-0 xl:gap-x-20',
          )}
        >
          {hasCover ? (
            <>
              <div
                className={cn(
                  'flex flex-col items-center gap-5 p-5',
                  frameClassName,
                  'lg:hidden',
                )}
              >
                <figure className="flex w-full justify-center">
                  <Media
                    htmlElement={null}
                    imgClassName="h-auto max-h-56 w-auto max-w-full object-contain"
                    pictureClassName="contents"
                    resource={coverImage}
                    size="320px"
                  />
                </figure>
                {titleBlock('w-full text-center')}
              </div>

              <figure
                className={cn(
                  'relative hidden h-full min-h-0 self-stretch p-6',
                  frameClassName,
                  'lg:block',
                )}
              >
                <Media
                  className="absolute inset-6"
                  fill
                  imgClassName="object-contain object-center"
                  pictureClassName="relative block h-full w-full"
                  resource={coverImage}
                  size="480px"
                />
              </figure>
            </>
          ) : (
            titleBlock()
          )}

          <div className={cn('flex min-w-0 flex-col', hasCover && 'lg:col-start-2 lg:row-start-1 lg:h-full')}>
            {hasCover ? titleBlock('hidden lg:block') : null}

            {description ? (
              <BodyText
                className={cn(
                  'max-w-prose text-sm leading-[1.85] md:text-base',
                  hasCover ? 'lg:mt-0' : 'mt-6',
                  'lg:text-[1.0625rem] lg:leading-[1.9]',
                )}
              >
                {description}
              </BodyText>
            ) : null}

            {highlightLine ? (
              <blockquote className="mt-6 border-l-2 border-brand-sage/70 pl-5 md:mt-7 md:pl-6 lg:mt-10 lg:pl-8">
                <p className="font-sans text-lg leading-snug tracking-wide text-brand-heading md:text-xl md:leading-relaxed lg:text-2xl">
                  {highlightLine}
                </p>
              </blockquote>
            ) : null}

            {authorLine ? (
              <p className="mt-6 font-sans text-xs tracking-[0.18em] text-brand-sage md:mt-7 lg:mt-10">
                {authorLine}
              </p>
            ) : null}

            {buyLink && buyHref ? (
              <div className="mt-8 md:mt-9 lg:mt-12">
                <CMSLink
                  appearance="outline"
                  className="w-full border-brand-border font-sans tracking-wide text-brand-heading hover:bg-brand-hover lg:w-auto lg:min-w-44"
                  label={buyLink.label}
                  newTab={buyLink.newTab ?? true}
                  size="default"
                  type={buyLink.type ?? 'custom'}
                  url={buyHref}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  )
}
