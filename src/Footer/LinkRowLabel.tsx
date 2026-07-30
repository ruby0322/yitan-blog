'use client'

import type { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type FooterLinkItem = NonNullable<NonNullable<Footer['linkGroups']>[number]['items']>[number]

export const LinkRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<FooterLinkItem>()

  const label = data?.data?.link?.label
    ? `連結 ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}：${data.data.link.label}`
    : '連結'

  return <div>{label}</div>
}
