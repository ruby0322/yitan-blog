import { BodyText, Caption, DisplayHeading, ReadMoreLink } from '@/components/theme'
import { SITE_NAME } from '@/constants/site'
import React from 'react'

type Props = {
  categoryDescription?: string | null
  categoryTitle?: string | null
  categoryTitlesDescription: string
  query?: string
  totalDocs?: number
}

export const PostsPageHeader: React.FC<Props> = ({
  categoryDescription,
  categoryTitle,
  categoryTitlesDescription,
  query,
  totalDocs,
}) => {
  const isFiltered = Boolean(categoryTitle)
  const isSearching = Boolean(query)

  const contextLabel = isSearching ? `搜尋「${query}」` : isFiltered ? categoryTitle : '部落格'

  const resultLabel =
    typeof totalDocs === 'number'
      ? totalDocs > 0
        ? `找到 ${totalDocs} 篇文章`
        : isSearching
          ? '沒有符合的結果'
          : '目前尚無文章'
      : null

  return (
    <header className="border-b border-brand-border pb-8 md:pb-12">
      <div className="container">
        <div className="max-w-3xl">
          <DisplayHeading className="mb-4 font-semibold text-brand-heading">
            {SITE_NAME}
          </DisplayHeading>
          <BodyText className="text-base md:text-lg">
            {isSearching
              ? isFiltered
                ? `在「${categoryTitle}」主題中搜尋與「${query}」相關的文章。`
                : `輸入關鍵字搜尋胰臟相關衛教文章，包含${categoryTitlesDescription}等主題。`
              : isFiltered
                ? categoryDescription || `依「${categoryTitle}」主題整理的文章。`
                : `以臨床經驗與醫學證據整理胰臟相關知識，包含${categoryTitlesDescription}等主題。`}
          </BodyText>
          {resultLabel ? (
            <Caption as="p" className="mt-4 block text-base">
              <span className="uppercase tracking-[0.28em]">{contextLabel}</span>
              {' / '}
              {resultLabel}
            </Caption>
          ) : null}
          {isFiltered && !isSearching ? (
            <div className="mt-6">
              <ReadMoreLink href="/posts" label="查看全部文章" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
