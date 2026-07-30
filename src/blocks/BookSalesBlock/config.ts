import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionNumberField } from '@/fields/sectionNumber'

export const BookSalesBlockConfig: Block = {
  slug: 'bookSalesBlock',
  interfaceName: 'BookSalesBlock',
  labels: {
    plural: 'Book Sales Blocks',
    singular: 'Book Sales Block',
  },
  fields: [
    sectionNumberField('05'),
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: '攔截胰臟癌',
      label: '書名',
    },
    {
      name: 'bookSubtitle',
      type: 'text',
      label: '副標',
      defaultValue: '破解癌王無聲警報，及早攔截沉默殺手',
    },
    {
      name: 'description',
      type: 'textarea',
      label: '內文',
    },
    {
      name: 'highlightLine',
      type: 'text',
      label: '重點引述',
    },
    {
      name: 'authorLine',
      type: 'text',
      label: '作者署名',
      defaultValue: '章明珠醫師 著',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: '書封圖片',
    },
    link({
      appearances: false,
      overrides: {
        name: 'buyLink',
        label: '購買連結',
      },
    }),
  ],
}
