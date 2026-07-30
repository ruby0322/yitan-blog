import React from 'react'

import type { AboutTeaserBlock as AboutTeaserBlockProps } from '@/payload-types'

import { EditorialImagePlaceholder } from '@/components/brand'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { ReadMoreLink, SectionHeader, themeRichTextClassName } from '@/components/theme'
import { Section } from '@/components/theme/section'

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

export const AboutTeaserBlockComponent: React.FC<AboutTeaserBlockProps> = ({
  body,
  heading,
  image,
  link,
  sectionNumber,
}) => {
  const href = resolveHref(link)
  const linkLabel = link?.label || '認識章醫師'

  return (
    <Section spacing="default" variant="muted">
      <div className="container">
        <SectionHeader heading={heading} sectionNumber={sectionNumber} />
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="mx-auto w-full max-w-sm">
            {image && typeof image === 'object' ? (
              <div className="aspect-square overflow-hidden rounded-md">
                <Media imgClassName="size-full object-cover" resource={image} size="400px" />
              </div>
            ) : (
              <EditorialImagePlaceholder label="待替換照片" variant="oval" />
            )}
          </div>

          <div className="flex flex-col gap-4">
            {body && (
              <RichText
                className={themeRichTextClassName}
                data={body}
                enableGutter={false}
                enableProse={false}
              />
            )}
            <ReadMoreLink href={href} label={linkLabel} />
          </div>
        </div>
      </div>
    </Section>
  )
}
