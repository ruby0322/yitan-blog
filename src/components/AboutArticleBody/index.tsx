import React from 'react'

import RichText from '@/components/RichText'
import { AboutTopicsSection } from '@/components/AboutTopicsSection'
import { aboutPageProseClassName } from '@/components/theme'
import {
  aboutDisclaimerRichText,
  aboutMainRichTextAfterTopics,
  aboutMainRichTextBeforeTopics,
  aboutTopicsClosing,
  aboutTopicsHeading,
  aboutTopicsIntro,
  ABOUT_TOPICS,
} from '@/endpoints/seed/about-content'

export const AboutArticleBody: React.FC = () => {
  return (
    <>
      <RichText
        className={aboutPageProseClassName}
        data={aboutMainRichTextBeforeTopics}
        enableGutter={false}
      />

      <AboutTopicsSection
        closing={aboutTopicsClosing}
        heading={aboutTopicsHeading}
        intro={aboutTopicsIntro}
        topics={ABOUT_TOPICS}
      />

      <RichText
        className={aboutPageProseClassName}
        data={aboutMainRichTextAfterTopics}
        enableGutter={false}
      />

      <div className="mt-12 border-t border-brand-border pt-8">
        <RichText
          className={aboutPageProseClassName}
          data={aboutDisclaimerRichText}
          enableGutter={false}
        />
      </div>
    </>
  )
}
