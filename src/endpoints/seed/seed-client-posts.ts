import type { Payload } from 'payload'
import type { Category, Media, User } from '@/payload-types'

import {
  buildClientPost,
  loadClientPostDefinitions,
  type ClientPostDefinition,
} from './build-client-post'
import { fetchMaterialsFile } from './seed-media'

const PUBLISHED_AT_START = new Date('2026-05-01T08:00:00.000Z')

function publishedAtForIndex(index: number): string {
  const date = new Date(PUBLISHED_AT_START)
  date.setDate(date.getDate() + index * 3)
  return date.toISOString()
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
  const createdPosts: Array<{ id: number; slug: string; category: string }> = []

  for (const [index, definition] of definitions.entries()) {
    const category = categoryByTitle[definition.category]
    if (!category) {
      throw new Error(`Missing category for post ${definition.slug}: ${definition.category}`)
    }

    const coverPath = definition.covers[0]
    if (!coverPath) {
      throw new Error(`Missing cover image for post ${definition.slug}`)
    }

    const heroAlt = definition.alts[0] || definition.title
    const heroFile = await fetchMaterialsFile(definition.folder, coverPath)
    const heroImage = await payload.create({
      collection: 'media',
      data: { alt: heroAlt },
      file: heroFile,
    })

    const inlineImages: Media[] = []
    for (const [inlineIndex, inlinePath] of definition.inlines.entries()) {
      const inlineAlt =
        definition.alts[inlineIndex + 1] ||
        `${definition.title} 配圖 ${inlineIndex + 1}`
      const inlineFile = await fetchMaterialsFile(definition.folder, inlinePath)
      inlineImages.push(
        await payload.create({
          collection: 'media',
          data: { alt: inlineAlt },
          file: inlineFile,
        }),
      )
    }

    const postDoc = await payload.create({
      collection: 'posts',
      depth: 0,
      context: { disableRevalidate: true },
      data: buildClientPost({
        author,
        category,
        definition,
        heroImage,
        inlineImages,
        publishedAt: publishedAtForIndex(index),
      }),
    })

    createdPosts.push({
      id: postDoc.id,
      slug: definition.slug,
      category: definition.category,
    })
  }

  for (const post of createdPosts) {
    const related = createdPosts
      .filter((candidate) => candidate.category === post.category && candidate.id !== post.id)
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

  return createdPosts
}

export function featuredPostIdsFromClientPosts(
  createdPosts: Array<{ id: number; slug: string }>,
): number[] {
  const preferredSlugs = [
    'pancreatic-cancer-early-symptoms-6-warning-signs',
    'pancreas-three-questions',
    'who-should-watch-pancreas-health',
  ]

  return preferredSlugs
    .map((slug) => createdPosts.find((post) => post.slug === slug)?.id)
    .filter((id): id is number => typeof id === 'number')
}

export async function getClientPostDefinitions(): Promise<ClientPostDefinition[]> {
  return loadClientPostDefinitions()
}
