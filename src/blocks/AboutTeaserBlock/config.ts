import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { sectionNumberField } from '@/fields/sectionNumber'

export const AboutTeaserBlockConfig: Block = {
  slug: 'aboutTeaserBlock',
  interfaceName: 'AboutTeaserBlock',
  labels: {
    plural: 'About Teaser Blocks',
    singular: 'About Teaser Block',
  },
  fields: [
    sectionNumberField('04'),
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: '標題',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: '內文',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()],
      }),
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '圖片',
    },
    link({
      appearances: false,
      overrides: {
        label: '連結',
      },
    }),
  ],
}
