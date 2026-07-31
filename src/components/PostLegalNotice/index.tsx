import { LegalSectionTitle } from '@/components/LegalSectionTitle'
import { LEGAL } from '@/content/legal'
import { cn } from '@/utilities/ui'
import React from 'react'

type PostLegalNoticeProps = {
  className?: string
}

export const PostLegalNotice: React.FC<PostLegalNoticeProps> = ({ className }) => {
  return (
    <aside
      aria-label="文章聲明"
      className={cn('mt-8 space-y-6 border-t border-brand-border pt-8', className)}
    >
      <section>
        <LegalSectionTitle>醫療資訊聲明</LegalSectionTitle>
        <p className="text-sm leading-relaxed text-brand-sage">{LEGAL.medicalDisclaimer}</p>
      </section>
      <section>
        <LegalSectionTitle>著作權聲明</LegalSectionTitle>
        <p className="text-sm leading-relaxed text-brand-sage">{LEGAL.articleEnd}</p>
      </section>
    </aside>
  )
}
