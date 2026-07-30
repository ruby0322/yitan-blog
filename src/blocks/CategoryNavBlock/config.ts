import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionNumberField } from '@/fields/sectionNumber'

export const CategoryNavBlockConfig: Block = {
  slug: 'categoryNavBlock',
  interfaceName: 'CategoryNavBlock',
  labels: {
    plural: 'Category Nav Blocks',
    singular: 'Category Nav Block',
  },
  fields: [
    sectionNumberField('02'),
    {
      name: 'heading',
      type: 'text',
      defaultValue: '從這裡開始',
      label: '標題',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      required: true,
      label: '導覽項目',
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          label: '編號',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: '標題',
        },
        link({ appearances: false }),
      ],
    },
  ],
}
