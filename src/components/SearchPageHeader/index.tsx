import { BodyText, DisplayHeading, Caption } from '@/components/theme'
import { SITE_NAME } from '@/constants/site'
import React from 'react'

export const SearchPageHeader: React.FC = () => {
  return (
    <header className="border-b border-brand-border pb-8 md:pb-12">
      <div className="container">
        <div className="max-w-3xl">
          <Caption as="p" className="mb-3 block uppercase tracking-[0.28em]">
            {SITE_NAME}
          </Caption>
          <DisplayHeading className="mb-4 font-semibold text-brand-heading">搜尋</DisplayHeading>
          <BodyText className="text-base md:text-lg">
            輸入關鍵字搜尋胰臟相關衛教文章，包含基礎知識、胰臟癌、胰臟發炎、飲食保健與健檢判讀等主題。
          </BodyText>
        </div>
      </div>
    </header>
  )
}
