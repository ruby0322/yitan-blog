import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'


import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PostFaq } from '@/components/PostFaq'
import { PostLegalNotice } from '@/components/PostLegalNotice'
import { postPageProseClassName } from '@/components/theme'
import { PostHero } from '@/heros/PostHero'
import { StructuredData } from '@/components/StructuredData'
import { generateMeta } from '@/utilities/generateMeta'
import { getPostStructuredData } from '@/utilities/structuredData'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="bg-brand-warm-white pb-16">
      <StructuredData data={getPostStructuredData(post)} />
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="container pt-8">
        <div className="mx-auto w-full max-w-[48rem]">
          <RichText className={postPageProseClassName} data={post.content} enableGutter={false} />
          {post.faq && post.faq.length > 0 && <PostFaq items={post.faq} />}
          <PostLegalNotice />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts docs={post.relatedPosts.filter((post) => typeof post === 'object')} />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({
    doc: post,
    ogType: 'article',
    path: `/posts/${decodedSlug}`,
  })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
