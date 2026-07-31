import type { Block } from 'payload'

import { sectionNumberField } from '@/fields/sectionNumber'

export const FeaturesBlockConfig: Block = {
  slug: 'featuresBlock',
  interfaceName: 'FeaturesBlock',
  labels: {
    plural: 'Features Blocks',
    singular: 'Features Block',
  },
  fields: [
    sectionNumberField('01'),
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: '四大特色',
      label: '標題',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      required: true,
      label: '特色項目',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: '標題',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: '說明',
        },
      ],
    },
  ],
}
