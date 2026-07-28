import React from 'react'

type Props = {
  totalDocs?: number
}

export const PostsPageHeader: React.FC<Props> = ({ totalDocs }) => {
  return (
    <div className="container mb-16">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">胰探究竟</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">部落格</h1>
        <p className="text-lg text-muted-foreground">
          以臨床經驗與醫學證據整理胰臟相關知識，包含基礎概念、迷思破解與日常保健建議。
        </p>
        {typeof totalDocs === 'number' && totalDocs > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">目前共 {totalDocs} 篇文章</p>
        )}
      </div>
    </div>
  )
}
