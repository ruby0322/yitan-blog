import React from 'react'

import type { AboutTeaserBlock as AboutTeaserBlockProps, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { DisplayHeading, ReadMoreLink, SectionHeader, themeRichTextClassName } from '@/components/theme'
import { Section } from '@/components/theme/section'
import { cn } from '@/utilities/ui'

const editorialGridClassName =
  'grid items-start gap-8 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-12 lg:gap-16'

const portraitGridClassName =
  'grid items-start gap-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-12 lg:gap-16 xl:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]'

function parseCredentials(credentialsLine?: string | null): string[] {
  if (!credentialsLine) return []

  return credentialsLine
    .split(/\r?\n|·/)
    .map((item) => item.trim())
    .filter(Boolean)
}

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
    <figure className="relative hidden aspect-3/4 min-h-0 overflow-hidden lg:block">
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
  const credentials = parseCredentials(credentialsLine)

  const nameBlock = (className?: string) => (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <DisplayHeading
          as="h2"
          className="text-[clamp(1.625rem,3.5vw,2.25rem)] leading-[1.15] tracking-[0.04em] text-brand-heading lg:text-[clamp(2rem,4vw,2.75rem)]"
        >
          {doctorName}
        </DisplayHeading>
        <span className="font-sans text-sm tracking-[0.22em] text-brand-sage md:text-base">醫師</span>
      </div>
      {credentials.length > 0 ? (
        <ul className="mt-4 w-max max-w-full space-y-2 font-serif text-sm leading-relaxed tracking-wide text-brand-heading/80 md:mt-5 md:text-base md:leading-loose lg:text-[0.9375rem]">
          {credentials.map((item) => (
            <li key={item} className="flex gap-2.5 md:whitespace-nowrap">
              <span
                aria-hidden
                className="mt-[0.55em] size-1 shrink-0 rounded-full bg-brand-sage/80"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )

  const textContent = (contentOffsetClassName?: string) => (
    <>
      {body ? (
        <RichText
          className={cn(
            themeRichTextClassName,
            'max-w-none prose-p:text-sm prose-p:leading-[1.85] prose-p:tracking-[0.03em] md:prose-p:text-base lg:prose-p:text-[1.0625rem] lg:prose-p:leading-[1.9]',
            contentOffsetClassName,
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
    </>
  )

  return (
    <Section spacing="default" variant="muted">
      <div className="container">
        <SectionHeader heading={heading} sectionNumber={sectionNumber} />

        {hasImage ? (
          <div className={portraitGridClassName}>
            <div className="flex flex-col gap-6 lg:hidden">
              <figure className="mx-auto aspect-3/4 w-full max-w-56 overflow-hidden">
                <Media
                  htmlElement={null}
                  imgClassName="size-full object-cover object-top"
                  pictureClassName="contents"
                  resource={image}
                  size="320px"
                />
              </figure>
              {nameBlock()}
            </div>
            <DesktopPortrait image={image} />

            <div className="flex min-w-0 flex-col md:col-start-2 md:row-start-1">
              {nameBlock('hidden lg:block')}
              {textContent('mt-6 lg:mt-0')}
            </div>
          </div>
        ) : (
          <div className={editorialGridClassName}>
            {nameBlock('w-max max-w-full md:pr-2 lg:pr-4')}
            <div className="flex min-w-0 flex-col md:border-l md:border-brand-sage/15 md:pl-10 lg:pl-14">
              {textContent()}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}
