'use client'

import React from 'react'

import type { NewsletterBlock as NewsletterBlockProps } from '@/payload-types'

import { BodyText, NewsletterForm, SectionHeader } from '@/components/theme'
import { Section } from '@/components/theme/section'

export const NewsletterBlockComponent: React.FC<NewsletterBlockProps> = ({
  description,
  heading,
  sectionNumber,
}) => {
  const handleSubmit = (email: string) => {
    console.info('[newsletterBlock] subscription placeholder:', email)
  }

  return (
    <Section spacing="default" variant="default">
      <div className="container">
        <SectionHeader
          className="mx-auto max-w-2xl"
          heading={heading}
          sectionNumber={sectionNumber}
        />
        <div className="mx-auto max-w-2xl text-center">
          {description && <BodyText>{description}</BodyText>}
          <NewsletterForm className="mx-auto mt-8 justify-center" onSubmit={handleSubmit} />
        </div>
      </div>
    </Section>
  )
}
