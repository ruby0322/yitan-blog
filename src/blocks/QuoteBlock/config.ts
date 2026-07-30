import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { sectionNumberField } from '@/fields/sectionNumber'

export const QuoteBlockConfig: Block = {
  slug: 'quoteBlock',
  interfaceName: 'QuoteBlockBlock',
  labels: {
    plural: 'Quote Blocks',
    singular: 'Quote Block',
  },
  fields: [
    sectionNumberField(),
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: '引文',
    },
    {
      name: 'attribution',
      type: 'text',
      label: '出處',
    },
    {
      name: 'sideText',
      type: 'richText',
      label: '側欄說明',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()],
      }),
    },
  ],
}
