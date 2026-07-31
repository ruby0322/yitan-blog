import React from 'react'

import type { AboutTeaserBlock as AboutTeaserBlockProps, Media as MediaType } from '@/payload-types'

import { EditorialImagePlaceholder } from '@/components/brand'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { DisplayHeading, ReadMoreLink, SectionHeader, themeRichTextClassName } from '@/components/theme'
import { Section } from '@/components/theme/section'
import { cn } from '@/utilities/ui'

const frameClassName =
  'rounded-sm bg-background/70 shadow-[0_1px_2px_rgba(74,82,72,0.05),0_16px_48px_rgba(74,82,72,0.1)]'

function resolveHref(link?: AboutTeaserBlockProps['link']): string {
  if (!link) return '/about'

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

  return '/about'
}

function DesktopPortrait({ image }: { image: MediaType }) {
  return (
    <figure
      className={cn(
        'relative hidden h-full min-h-0 self-stretch overflow-hidden',
        frameClassName,
        'lg:block',
      )}
    >
      <Media
        className="absolute inset-0"
        fill
        imgClassName="object-cover object-top"
        pictureClassName="relative block h-full w-full"
        resource={image}
        size="480px"
      />
    </figure>
  )
}

export const AboutTeaserBlockComponent: React.FC<AboutTeaserBlockProps> = ({
  body,
  credentialsLine,
  doctorName,
  heading,
  highlightLine,
  image,
  link,
  sectionNumber,
}) => {
  const href = resolveHref(link)
  const linkLabel = link?.label || '了解更多'
  const hasImage = image && typeof image === 'object'

  const nameBlock = (className?: string) => (
    <div className={className}>
      <DisplayHeading
        as="h2"
        className="text-[clamp(1.625rem,3.5vw,2.25rem)] leading-[1.15] tracking-[0.04em] text-brand-heading lg:text-[clamp(2rem,4vw,2.75rem)]"
      >
        {doctorName}
      </DisplayHeading>
      {credentialsLine ? (
        <p className="mt-2 font-serif text-sm leading-relaxed tracking-wide text-brand-heading/80 md:mt-3 md:text-base md:leading-loose lg:mt-5 lg:text-lg">
          {credentialsLine}
        </p>
      ) : null}
    </div>
  )

  const placeholder = (className?: string) => (
    <EditorialImagePlaceholder className={className} label="待替換照片" variant="oval" />
  )

  return (
    <Section spacing="default" variant="muted">
      <div className="container">
        <SectionHeader heading={heading} sectionNumber={sectionNumber} />

        <div
          className={cn(
            'flex flex-col gap-6',
            'lg:grid lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:grid-rows-1 lg:items-stretch lg:gap-x-16 lg:gap-y-0 xl:gap-x-20',
          )}
        >
          {hasImage ? (
            <>
              <div className={cn('flex flex-col items-center gap-5 p-5 lg:hidden', frameClassName)}>
                <figure className="aspect-3/4 w-full max-w-56 overflow-hidden">
                  <Media
                    htmlElement={null}
                    imgClassName="size-full object-cover object-top"
                    pictureClassName="contents"
                    resource={image}
                    size="320px"
                  />
                </figure>
                {nameBlock('w-full text-center')}
              </div>
              <DesktopPortrait image={image} />
            </>
          ) : (
            <>
              <div className={cn('flex justify-center p-5 lg:hidden', frameClassName)}>
                {placeholder()}
              </div>
              <div className={cn('hidden justify-center p-6 lg:flex', frameClassName)}>
                {placeholder('max-w-none')}
              </div>
            </>
          )}

          <div className="flex min-w-0 flex-col lg:col-start-2 lg:row-start-1 lg:h-full">
            {hasImage ? nameBlock('hidden lg:block') : nameBlock()}

            {body ? (
              <RichText
                className={cn(
                  themeRichTextClassName,
                  'max-w-prose prose-p:text-sm prose-p:leading-[1.85] md:prose-p:text-base lg:prose-p:text-[1.0625rem] lg:prose-p:leading-[1.9]',
                  hasImage ? 'mt-6 lg:mt-0' : 'mt-6',
                )}
                data={body}
                enableGutter={false}
                enableProse={false}
              />
            ) : null}

            {highlightLine ? (
              <blockquote className="mt-6 border-l-2 border-brand-sage/70 pl-5 md:mt-7 md:pl-6 lg:mt-10 lg:pl-8">
                <p className="font-sans text-lg leading-snug tracking-wide text-brand-heading md:text-xl md:leading-relaxed">
                  {highlightLine}
                </p>
              </blockquote>
            ) : null}

            <div className="mt-8 md:mt-9 lg:mt-10">
              <ReadMoreLink href={href} label={linkLabel} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
