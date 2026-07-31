import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Category, Media, User } from '@/payload-types'

import {
  heading,
  mediaBlock,
  paragraph,
  richTextRoot,
  text,
  type ContentNode,
} from './lexical-helpers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export type ClientPostSection = {
  h: string | null
  p: string
}

export type ClientPostDefinition = {
  folder: string
  slug: string
  category: string
  title: string
  seoTitle: string
  metaDescription: string
  excerpt: string
  faq: Array<{ question: string; answer: string }>
  marketingNotes: {
    coverDesignNotes: string
    youtubeTitle: string
    youtubeDescription: string
    socialPost: string
    newsletterSummary: string
  }
  alts: string[]
  covers: string[]
  inlines: string[]
  sections: ClientPostSection[]
}

export async function loadClientPostDefinitions(): Promise<ClientPostDefinition[]> {
  const jsonPath = path.resolve(dirname, '../../../scripts/seed-data/client-posts.json')
  const raw = await readFile(jsonPath, 'utf-8')
  return JSON.parse(raw) as ClientPostDefinition[]
}

function splitParagraphs(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function distributeInlineInsertions(sectionCount: number, inlineCount: number): number[] {
  if (inlineCount === 0 || sectionCount === 0) return []
  const indices: number[] = []
  for (let i = 0; i < inlineCount; i++) {
    const index = Math.min(
      sectionCount - 1,
      Math.max(1, Math.round(((i + 1) * sectionCount) / (inlineCount + 1))),
    )
    indices.push(index)
  }
  return indices
}

type BuildClientPostArgs = {
  author: Pick<User, 'id'>
  category: Category
  heroImage: Media
  inlineImages: Media[]
  publishedAt: string
  definition: ClientPostDefinition
}

export function buildClientPost({
  author,
  category,
  definition,
  heroImage,
  inlineImages,
  publishedAt,
}: BuildClientPostArgs): RequiredDataFromCollectionSlug<'posts'> {
  const inlineInsertAt = distributeInlineInsertions(definition.sections.length, inlineImages.length)
  const contentNodes: ContentNode[] = []

  definition.sections.forEach((section, index) => {
    if (section.h) {
      contentNodes.push(heading('h2', section.h))
    }

    for (const paragraphText of splitParagraphs(section.p)) {
      contentNodes.push(paragraph(text(paragraphText)))
    }

    const inlineIndex = inlineInsertAt.indexOf(index)
    if (inlineIndex >= 0 && inlineImages[inlineIndex]) {
      contentNodes.push(mediaBlock(inlineImages[inlineIndex].id, `Figure ${inlineIndex + 1}`))
    }
  })

  const marketingNotes = definition.marketingNotes

  return {
    _status: 'published',
    title: definition.title,
    slug: definition.slug,
    excerpt: definition.excerpt,
    heroImage: heroImage.id,
    authors: [author.id],
    categories: [category.id],
    publishedAt,
    content: richTextRoot(...contentNodes),
    faq: definition.faq.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
    marketingNotes: {
      coverDesignNotes: marketingNotes.coverDesignNotes,
      youtubeTitle: marketingNotes.youtubeTitle,
      youtubeDescription: marketingNotes.youtubeDescription,
      socialPost: marketingNotes.socialPost,
      newsletterSummary: marketingNotes.newsletterSummary,
    },
    meta: {
      title: definition.seoTitle,
      description: definition.metaDescription,
      image: heroImage.id,
    },
  }
}
