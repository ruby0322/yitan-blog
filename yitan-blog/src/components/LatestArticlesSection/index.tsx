import Link from 'next/link'
import React from 'react'

import { Card, type CardPostData } from '@/components/Card'
import { cn } from '@/utilities/ui'

type Props = {
  featured?: boolean
  posts: CardPostData[]
  showViewAll?: boolean
  title?: string
}

export const LatestArticlesSection: React.FC<Props> = ({
  featured = false,
  posts,
  showViewAll = true,
  title = '最新文章',
}) => {
  if (!posts?.length) return null

  return (
    <section className="my-16">
      <div className="container mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            精選最近發布的文章，點選標題即可閱讀全文。
          </p>
        </div>
        {showViewAll && (
          <Link
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            href="/posts"
          >
            查看全部文章 →
          </Link>
        )}
      </div>

      <div className="container">
        {featured ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              {typeof posts[0] === 'object' && posts[0] !== null && (
                <Card className="h-full" doc={posts[0]} featured relationTo="posts" showCategories />
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-4 xl:grid-cols-2">
              {posts.slice(1).map((post, index) => {
                if (typeof post !== 'object' || post === null) return null

                return (
                  <Card
                    className="h-full"
                    doc={post}
                    key={post.slug || index}
                    relationTo="posts"
                    showCategories
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8',
            )}
          >
            {posts.map((post, index) => {
              if (typeof post !== 'object' || post === null) return null

              return (
                <Card
                  className="h-full"
                  doc={post}
                  key={post.slug || index}
                  relationTo="posts"
                  showCategories
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
