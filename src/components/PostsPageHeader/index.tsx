import { BodyText, Caption, DisplayHeading, ReadMoreLink } from '@/components/theme'
import { SITE_NAME } from '@/constants/site'
import { TOPIC_CATEGORIES_DESCRIPTION } from '@/constants/categories'
import React from 'react'

type Props = {
  categoryDescription?: string | null
  categoryTitle?: string | null
  totalDocs?: number
}

export const PostsPageHeader: React.FC<Props> = ({
  categoryDescription,
  categoryTitle,
  totalDocs,
}) => {
  const isFiltered = Boolean(categoryTitle)

  return (
    <header className="border-b border-brand-border pb-8 md:pb-12">
      <div className="container">
        <div className="max-w-3xl">
          <Caption as="p" className="mb-3 block uppercase tracking-[0.28em]">
            {SITE_NAME}
          </Caption>
          <DisplayHeading className="mb-4 font-semibold text-brand-heading">
            {isFiltered ? categoryTitle : '部落格'}
          </DisplayHeading>
          <BodyText className="text-base md:text-lg">
            {isFiltered
              ? categoryDescription || `依「${categoryTitle}」主題整理的文章。`
              : `以臨床經驗與醫學證據整理胰臟相關知識，包含${TOPIC_CATEGORIES_DESCRIPTION}。`}
          </BodyText>
          {typeof totalDocs === 'number' && (
            <Caption as="p" className="mt-4 block">
              {isFiltered ? `${categoryTitle} · ` : ''}
              {totalDocs > 0 ? `目前共 ${totalDocs} 篇文章` : '目前尚無文章'}
            </Caption>
          )}
          {isFiltered ? (
            <div className="mt-6">
              <ReadMoreLink href="/posts" label="查看全部文章" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
