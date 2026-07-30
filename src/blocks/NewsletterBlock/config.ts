import type { Block } from 'payload'

import { sectionNumberField } from '@/fields/sectionNumber'

export const NewsletterBlockConfig: Block = {
  slug: 'newsletterBlock',
  interfaceName: 'NewsletterBlock',
  labels: {
    plural: 'Newsletter Blocks',
    singular: 'Newsletter Block',
  },
  fields: [
    sectionNumberField('05'),
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: '每月一封，陪您看懂胰臟。',
      label: '標題',
    },
    {
      name: 'description',
      type: 'textarea',
      label: '說明',
    },
  ],
}
