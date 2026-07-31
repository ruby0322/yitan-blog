import type { RequiredDataFromCollectionSlug } from 'payload'

import {
  aboutDisclaimerRichText,
  aboutHeroRichText,
  aboutMainRichTextAfterTopics,
  aboutMainRichTextBeforeTopics,
  aboutMeta,
} from './about-content'

export const about = (): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'about',
  _status: 'published',
  title: '關於',
  hero: {
    type: 'lowImpact',
    richText: aboutHeroRichText,
  },
  layout: [
    {
      blockType: 'content',
      blockName: 'About Intro',
      columns: [
        {
          size: 'full',
          richText: aboutMainRichTextBeforeTopics,
        },
      ],
    },
    {
      blockType: 'content',
      blockName: 'About Outro',
      columns: [
        {
          size: 'full',
          richText: aboutMainRichTextAfterTopics,
        },
      ],
    },
    {
      blockType: 'content',
      blockName: 'Disclaimer',
      columns: [
        {
          size: 'full',
          richText: aboutDisclaimerRichText,
        },
      ],
    },
  ],
  meta: aboutMeta,
})
