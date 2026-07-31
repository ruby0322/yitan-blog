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
    sectionNumberField('03'),
    {
      name: 'heading',
      type: 'text',
      defaultValue: '依主題閱讀',
      label: '標題',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      required: true,
      label: '導覽項目',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          label: '分類',
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
