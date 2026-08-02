import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slugField'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Categories: CollectionConfig = {
  slug: 'categories',
  defaultSort: 'sortOrder',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    singular: '分類',
    plural: '分類',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sortOrder', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: '說明',
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: '排序',
      required: true,
      admin: {
        description: '數字越小越靠前。建議以 10 為間距（10、20、30…）方便日後插入新分類。',
        position: 'sidebar',
      },
    },
    slugField(),
  ],
}
