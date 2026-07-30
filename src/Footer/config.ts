import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'linkGroups',
      type: 'array',
      label: '連結分類',
      maxRows: 4,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: '分類名稱',
        },
        {
          name: 'items',
          type: 'array',
          label: '連結',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: '@/Footer/LinkRowLabel#LinkRowLabel',
            },
          },
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/GroupRowLabel#GroupRowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  versions: false,
}
