import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { aboutStatic } from '@/endpoints/seed/about-static'
import { homeStatic } from '@/endpoints/seed/home-static'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { AboutArticleBody } from '@/components/AboutArticleBody'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = pages.docs
      ?.filter((doc) => {
        return doc.slug !== 'home'
      })
      .map(({ slug }) => {
        return { slug }
      })

    return params ?? []
  } catch (error) {
    console.warn(
      '[pages] generateStaticParams skipped — database unavailable. Start Postgres with `pnpm db:up`, then run `pnpm migrate`.',
      error,
    )
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null = null

  try {
    page = await queryPageBySlug({
      slug: decodedSlug,
    })
  } catch (error) {
    console.warn(
      `[pages] Failed to load slug "${decodedSlug}" — database unavailable. Using static fallback when available.`,
      error,
    )
  }

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page && slug === 'about') {
    page = aboutStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const isHome = decodedSlug === 'home'
  const isAbout = decodedSlug === 'about'

  return (
    <div className={isHome ? undefined : isAbout ? 'bg-brand-warm-white pb-16' : 'pb-24 pt-16'}>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} variant={isAbout ? 'article' : 'default'} />
      {isAbout ? (
        <div className="container pt-8">
          <div className="mx-auto w-full max-w-[48rem]">
            <AboutArticleBody />
          </div>
        </div>
      ) : (
        <RenderBlocks blocks={layout} />
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  try {
    const page = await queryPageBySlug({
      slug: decodedSlug,
    })

    const path = decodedSlug === 'home' ? '/' : `/${decodedSlug}`

    return generateMeta({ doc: page, path })
  } catch (error) {
    console.warn(`[pages] generateMetadata skipped for "${decodedSlug}" — database unavailable.`, error)
    const path = decodedSlug === 'home' ? '/' : `/${decodedSlug}`
    return generateMeta({ doc: null, path })
  }
}

async function queryPageBySlug({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}
