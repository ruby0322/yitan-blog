import type { Block } from 'payload'

import { sectionNumberField } from '@/fields/sectionNumber'

export const FeaturedPostsBlockConfig: Block = {
  slug: 'featuredPostsBlock',
  interfaceName: 'FeaturedPostsBlock',
  labels: {
    plural: 'Featured Posts Blocks',
    singular: 'Featured Posts Block',
  },
  fields: [
    sectionNumberField('01'),
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: '本期精選',
      label: '標題',
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      minRows: 1,
      maxRows: 3,
      required: true,
      label: '精選文章',
    },
  ],
}
