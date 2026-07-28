import type { Field } from 'payload'

import { toKebabCase } from '@/utilities/toKebabCase'

type SlugFieldArgs = {
  fieldToUse?: string
}

export const slugField = ({ fieldToUse = 'title' }: SlugFieldArgs = {}): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return toKebabCase(value.trim())
        }

        const source = siblingData?.[fieldToUse]
        if (typeof source === 'string' && source.trim().length > 0) {
          return toKebabCase(source.trim())
        }

        return value
      },
    ],
  },
})
