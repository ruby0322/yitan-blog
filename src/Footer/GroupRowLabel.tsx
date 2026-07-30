'use client'

import type { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const GroupRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['linkGroups']>[number]>()

  const label = data?.data?.label
    ? `分類 ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}：${data.data.label}`
    : '連結分類'

  return <div>{label}</div>
}
