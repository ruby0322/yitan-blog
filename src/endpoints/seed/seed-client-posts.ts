import type { Payload } from 'payload'
import type { Category, Media, User } from '@/payload-types'

import {
  buildClientPost,
  loadClientPostDefinitions,
  type ClientPostDefinition,
} from './build-client-post'
import { fetchMaterialsFile } from './seed-media'

const PUBLISHED_AT_START = new Date('2026-05-01T08:00:00.000Z')

/** Only this post is published on seed; all other client posts stay draft. */
const PUBLISHED_SEED_POST_SLUG = 'pancreatic-cancer-treatment-30-years'

function publishedAtForIndex(index: number): string {
  const date = new Date(PUBLISHED_AT_START)
  date.setDate(date.getDate() + index * 3)
  return date.toISOString()
}

async function uploadHeroImage(
  payload: Payload,
  definition: ClientPostDefinition,
): Promise<Media> {
  const coverPath = definition.covers[0]
  if (!coverPath) {
    throw new Error(`Missing cover image for post ${definition.slug}`)
  }

  const heroAlt = definition.alts[0] || definition.title
  const heroFile = await fetchMaterialsFile(definition.folder, coverPath)
  return payload.create({
    collection: 'media',
    data: { alt: heroAlt },
    file: heroFile,
  })
}

async function uploadInlineImages(
  payload: Payload,
  definition: ClientPostDefinition,
): Promise<Media[]> {
  const inlineImages: Media[] = []

  for (const [inlineIndex, inlinePath] of definition.inlines.entries()) {
    const inlineAlt =
      definition.alts[inlineIndex + 1] || `${definition.title} 配圖 ${inlineIndex + 1}`
    const inlineFile = await fetchMaterialsFile(definition.folder, inlinePath)
    inlineImages.push(
      await payload.create({
        collection: 'media',
        data: { alt: inlineAlt },
        file: inlineFile,
      }),
    )
  }

  return inlineImages
}

export async function seedClientPosts({
  author,
  categoryByTitle,
  payload,
}: {
  author: Pick<User, 'id'>
  categoryByTitle: Record<string, Category>
  payload: Payload
}) {
  const definitions = await loadClientPostDefinitions()
  const upsertedPosts: Array<{ id: number; slug: string; categories: string[] }> = []

  for (const [index, definition] of definitions.entries()) {
    const categories = definition.categories.map((title) => {
      const category = categoryByTitle[title]
      if (!category) {
        throw new Error(`Missing category for post ${definition.slug}: ${title}`)
      }
      return category
    })

    const heroImage = await uploadHeroImage(payload, definition)
    const inlineImages = await uploadInlineImages(payload, definition)

    const postData = buildClientPost({
      author,
      categories,
      definition,
      heroImage,
      inlineImages,
      publishedAt: publishedAtForIndex(index),
      status: definition.slug === PUBLISHED_SEED_POST_SLUG ? 'published' : 'draft',
    })

    const existing = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      where: {
        slug: {
          equals: definition.slug,
        },
      },
    })

    const existingPost = existing.docs[0]

    const postDoc = existingPost
      ? await payload.update({
          id: existingPost.id,
          collection: 'posts',
          depth: 0,
          context: { disableRevalidate: true },
          data: postData,
        })
      : await payload.create({
          collection: 'posts',
          depth: 0,
          context: { disableRevalidate: true },
          data: postData,
        })

    upsertedPosts.push({
      id: postDoc.id,
      slug: definition.slug,
      categories: definition.categories,
    })
  }

  for (const post of upsertedPosts) {
    const postCategories = new Set(post.categories)
    const related = upsertedPosts
      .filter(
        (candidate) =>
          candidate.id !== post.id &&
          candidate.categories.some((category) => postCategories.has(category)),
      )
      .slice(0, 3)
      .map((candidate) => candidate.id)

    if (related.length > 0) {
      await payload.update({
        id: post.id,
        collection: 'posts',
        context: { disableRevalidate: true },
        data: { relatedPosts: related },
      })
    }
  }

  return upsertedPosts
}

export function featuredPostIdsFromClientPosts(
  createdPosts: Array<{ id: number; slug: string }>,
): number[] {
  const publishedPost = createdPosts.find((post) => post.slug === PUBLISHED_SEED_POST_SLUG)
  return publishedPost ? [publishedPost.id] : []
}

export async function getClientPostDefinitions(): Promise<ClientPostDefinition[]> {
  return loadClientPostDefinitions()
}
