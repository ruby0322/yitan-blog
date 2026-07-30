import type { Field } from 'payload'

export const sectionNumberField = (defaultValue?: string): Field => ({
  name: 'sectionNumber',
  type: 'text',
  ...(defaultValue !== undefined ? { defaultValue } : {}),
  label: 'Section 編號',
})
