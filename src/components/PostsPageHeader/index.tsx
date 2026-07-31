import { BodyText, Caption, DisplayHeading, ReadMoreLink } from '@/components/theme'
import { SITE_NAME } from '@/constants/site'
import { TOPIC_CATEGORIES_DESCRIPTION } from '@/constants/categories'
import React from 'react'

type Props = {
  categoryDescription?: string | null
  categoryTitle?: string | null
  query?: string
  totalDocs?: number
}

export const PostsPageHeader: React.FC<Props> = ({
  categoryDescription,
  categoryTitle,
  query,
  totalDocs,
}) => {
  const isFiltered = Boolean(categoryTitle)
  const isSearching = Boolean(query)

  return (
    <header className="border-b border-brand-border pb-8 md:pb-12">
      <div className="container">
        <div className="max-w-3xl">
          <Caption as="p" className="mb-3 block uppercase tracking-[0.28em]">
            {SITE_NAME}
            {isFiltered && !isSearching ? ` · ${categoryTitle}` : null}
            {isFiltered && isSearching ? ` · ${categoryTitle}` : null}
          </Caption>
          <DisplayHeading className="mb-4 font-semibold text-brand-heading">
            {isSearching ? `搜尋「${query}」` : isFiltered ? categoryTitle : '部落格'}
          </DisplayHeading>
          <BodyText className="text-base md:text-lg">
            {isSearching
              ? isFiltered
                ? `在「${categoryTitle}」主題中搜尋與「${query}」相關的文章。`
                : '輸入關鍵字搜尋胰臟相關衛教文章，包含基礎知識、胰臟癌、胰臟發炎、飲食保健與健檢判讀等主題。'
              : isFiltered
                ? categoryDescription || `依「${categoryTitle}」主題整理的文章。`
                : `以臨床經驗與醫學證據整理胰臟相關知識，包含${TOPIC_CATEGORIES_DESCRIPTION}。`}
          </BodyText>
          {typeof totalDocs === 'number' && (
            <Caption as="p" className="mt-4 block">
              {totalDocs > 0
                ? `找到 ${totalDocs} 篇文章`
                : isSearching
                  ? '沒有符合的結果'
                  : '目前尚無文章'}
            </Caption>
          )}
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
