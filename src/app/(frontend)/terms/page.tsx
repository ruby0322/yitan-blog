import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { legalPageProseClassName, NumberedHeading } from '@/components/theme'
import { LEGAL } from '@/content/legal'
import { cn } from '@/utilities/ui'

export const metadata: Metadata = {
  title: `${LEGAL.termsPageTitle} | ${LEGAL.siteName}`,
  description:
    '胰探究竟著作權與使用條款、醫療資訊聲明：本網站原創內容之版權歸屬、引用規範與授權聯絡方式。',
}

export default function TermsPage() {
  const [copyrightLine, protectionLine] = LEGAL.termsFull

  return (
    <article className="pb-24 pt-16">
      <div className="container">
        <div className={cn('mx-auto w-full max-w-[48rem] lg:max-w-[40rem]', legalPageProseClassName)}>
          <header>
            <h1>{LEGAL.termsPageTitle}</h1>
            <p>本頁說明網站內容之著作權歸屬、引用規範，以及醫療資訊之使用限制。</p>
          </header>

          <p>{copyrightLine}</p>
          <p>{protectionLine}</p>
          <p>
            如需引用，請註明作者、文章名稱及原始文章連結。若有合作、媒體引用或內容授權需求，請與
            <Link href={LEGAL.contactPath}>本網站</Link>
            聯絡。
          </p>

          <div className="not-prose mt-12 md:mt-16">
            <NumberedHeading className="mb-6 md:mb-8" title="醫療資訊聲明" variant="bar" />
          </div>
          <p>{LEGAL.medicalDisclaimer}</p>
        </div>
      </div>
    </article>
  )
}
