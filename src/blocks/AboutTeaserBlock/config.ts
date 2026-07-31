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
      defaultValue: '認識章醫師',
      label: '區塊標籤',
    },
    {
      name: 'doctorName',
      type: 'text',
      required: true,
      defaultValue: '章明珠',
      label: '醫師姓名',
    },
    {
      name: 'credentialsLine',
      type: 'text',
      label: '職稱',
      defaultValue: '台大醫學院臨床副教授 · 台大醫院內科部消化系主治醫師',
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
      name: 'highlightLine',
      type: 'text',
      label: '重點引述',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '肖像',
    },
    link({
      appearances: false,
      overrides: {
        label: '連結',
      },
    }),
  ],
}
